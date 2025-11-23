import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  
  // Webhook GTI-API (REST endpoint fora do tRPC)
  app.post("/api/webhook/gti", async (req, res) => {
    try {
      console.log("\n" + "=".repeat(80));
      console.log("[Webhook GTI-API] PAYLOAD COMPLETO RECEBIDO:");
      console.log(JSON.stringify(req.body, null, 2));
      console.log("[Webhook GTI-API] Headers:", JSON.stringify(req.headers, null, 2));
      console.log("[Webhook GTI-API] Query params:", JSON.stringify(req.query, null, 2));
      console.log("=".repeat(80) + "\n");
      
      // Salvar payload em arquivo para debug
      try {
        const fs = await import("fs/promises");
        await fs.writeFile("/tmp/webhook-debug.txt", JSON.stringify({
          timestamp: new Date().toISOString(),
          body: req.body,
          headers: req.headers,
          query: req.query
        }, null, 2));
      } catch (e) {
        console.error("[Webhook GTI-API] Failed to save debug file:", e);
      }
      
      const { processMessage } = await import("../services/conversation-flow?t=" + Date.now());
      const { sendTextMessage } = await import("../services/gti-api");
      const { createWebhookLog } = await import("../db");
      
      const payload = req.body;
      
      // Log do webhook
      try {
        await createWebhookLog({
          webhookSource: "gti-api",
          webhookEvent: payload.event || "webhook_trigger",
          requestPayload: JSON.stringify(payload),
          responseStatus: 200,
          processed: false,
        });
      } catch (logError) {
        console.error("[Webhook GTI-API] Failed to log:", logError);
      }
      
      // Se payload está vazio ou sem dados, retornar sucesso (GTI-API só notifica)
      const data = payload.data;
      if (!data || Object.keys(payload).length === 0) {
        console.log("[Webhook GTI-API] Payload vazio - GTI-API apenas notificou. Retornando sucesso.");
        return res.json({ success: true, message: "Webhook received - polling not implemented yet" });
      }
      
      // Verificar se é mensagem recebida
      const event = payload.event;
      const validEvents = ["messages.upsert", "messages.update", "send.message"];
      
      if (!validEvents.includes(event)) {
        console.log("[Webhook GTI-API] Ignored event:", event);
        return res.json({ success: true, message: "Event ignored" });
      }
      
      // Ignorar eventos de envio (send.message) para evitar loop
      if (event === "send.message") {
        console.log("[Webhook GTI-API] Ignored send.message event");
        return res.json({ success: true, message: "Send event ignored" });
      }
      
      // GTI-API pode enviar data diretamente ou data.message
      const message = data.message || data;
      
      console.log("[Webhook GTI-API] Event:", event);
      console.log("[Webhook GTI-API] Message structure:", JSON.stringify(message, null, 2));
      
      if (!message) {
        return res.status(400).json({ success: false, error: "Missing message" });
      }
      
      // Extrair informações da mensagem
      const key = message.key || {};
      const fromMe = key.fromMe || false;
      const remoteJid = key.remoteJid || "";
      const isGroup = remoteJid.includes("@g.us");
      
      // Ignorar mensagens do próprio bot ou de grupos
      if (fromMe || isGroup) {
        console.log("[Webhook GTI-API] Ignored: fromMe=", fromMe, "isGroup=", isGroup);
        return res.json({ success: true, message: "Ignored: bot message or group" });
      }
      
      // Extrair número do telefone (remover @s.whatsapp.net)
      const phone = remoteJid.replace("@s.whatsapp.net", "");
      
      // Extrair nome do contato (pushName ou notifyName)
      const chatName = data.pushName || data.notifyName || null;
      
      // Extrair conteúdo da mensagem
      let messageContent = "";
      const msgData = message.message || message;
      
      // Tentar extrair texto de diferentes formatos
      if (typeof msgData === 'string') {
        messageContent = msgData;
      } else if (msgData.conversation) {
        messageContent = msgData.conversation;
      } else if (msgData.extendedTextMessage) {
        messageContent = msgData.extendedTextMessage.text || "";
      } else if (msgData.imageMessage) {
        messageContent = msgData.imageMessage.caption || "[Imagem]";
      } else if (msgData.videoMessage) {
        messageContent = msgData.videoMessage.caption || "[Vídeo]";
      } else if (msgData.documentMessage) {
        messageContent = "[Documento]";
      } else if (msgData.audioMessage) {
        messageContent = "[Áudio]";
      }
      
      if (!phone || !messageContent) {
        console.log("[Webhook GTI-API] Missing phone or message:", { phone, messageContent });
        console.log("[Webhook GTI-API] Payload completo:", JSON.stringify(req.body, null, 2));
        return res.status(400).json({ success: false, error: "Missing phone or message" });
      }
      
      console.log("[Webhook GTI-API] Processing message from:", phone, "message:", messageContent);
      
      // Processar mensagem (passar chatName para usar nome do contato)
      const result = await processMessage(phone, messageContent, undefined, chatName);
      
      console.log("[Webhook GTI-API] Resposta gerada:", result.response);
      
      // Enviar resposta
      try {
        await sendTextMessage({
          phone: phone,
          message: result.response,
        });
        console.log(`[Webhook GTI-API] ✅ Mensagem enviada com sucesso para ${phone}`);
      } catch (sendError) {
        console.error(`[Webhook GTI-API] ❌ Erro ao enviar mensagem:`, sendError);
        // Continuar mesmo se falhar o envio
      }
      
      res.json({ success: true, leadId: result.newContext.leadId });
    } catch (error) {
      console.error("[Webhook GTI-API] Error:", error);
      res.status(500).json({ success: false, error: String(error) });
    }
  });
  
  // Webhook Z-API (REST endpoint fora do tRPC)
  // Cache de mensagens processadas (evita duplicatas)
  const processedMessages = new Map<string, number>();
  const CACHE_TTL = 60000; // 60 segundos
  
  // Limpar cache periodicamente
  setInterval(() => {
    const now = Date.now();
    const entries = Array.from(processedMessages.entries());
    for (const [key, timestamp] of entries) {
      if (now - timestamp > CACHE_TTL) {
        processedMessages.delete(key);
      }
    }
  }, 30000); // Limpar a cada 30 segundos

  app.post("/api/webhook/zapi", async (req, res) => {
    try {
      console.log("\n" + "=".repeat(80));
      console.log("[Webhook Z-API] 📥 MENSAGEM RECEBIDA:");
      console.log(JSON.stringify(req.body, null, 2));
      console.log("=".repeat(80) + "\n");
      
      // Salvar payload em arquivo para debug
      try {
        const fs = await import("fs/promises");
        await fs.writeFile("/tmp/zapi-debug.txt", JSON.stringify({
          timestamp: new Date().toISOString(),
          body: req.body,
          headers: req.headers,
          query: req.query
        }, null, 2));
      } catch (e) {
        console.error("[Webhook Z-API] Failed to save debug file:", e);
      }
      
      const { processMessage } = await import("../services/conversation-flow?t=" + Date.now());
      const { sendTextMessage } = await import("../services/zapi");
      const { createWebhookLog } = await import("../db");
      
      const payload = req.body;
      
      // Extrair dados primeiro
      const phone = payload.phone;
      let messageContent = payload.text?.message || payload.message || "";
      const fromMe = payload.fromMe || false;
      const fromApi = payload.fromApi || false;
      const isGroup = payload.isGroup || false;
      const messageId = payload.messageId || payload.id || null;
      const messageType = payload.messageType || payload.type || "text";
      const isAudio = messageType === "audio" || messageType === "ptt" || payload.audio || payload.audioMessage;
      const isDocument = messageType === "document" || messageType === "image" || payload.documentMessage || payload.imageMessage;
      const isImage = messageType === "image" || payload.imageMessage;
      const chatName = payload.chatName || null; // Nome do contato salvo no WhatsApp
      
      // Se mensagem está vazia mas é mídia, criar conteúdo descritivo
      if (!messageContent || messageContent.trim() === "") {
        if (isImage) {
          messageContent = "[Cliente enviou uma imagem]";
        } else if (isAudio) {
          messageContent = "[Cliente enviou um áudio]";
        } else if (isDocument) {
          messageContent = "[Cliente enviou um documento]";
        } else {
          messageContent = "[Mensagem vazia]";
        }
      }
      
      console.log("[Webhook Z-API] 📋 Dados extraídos:", { phone, messageContent, fromMe, fromApi, isGroup, messageId, messageType, isAudio, isDocument, isImage, chatName });
      
      // Log em arquivo também
      try {
        const fs = await import("fs/promises");
        await fs.appendFile("/tmp/webhook-flow.log", `\n[${new Date().toISOString()}] Dados extraídos: phone=${phone}, message=${messageContent}, fromMe=${fromMe}, fromApi=${fromApi}, isGroup=${isGroup}, messageId=${messageId}, type=${messageType}\n`);
      } catch (e) {}
      
      
      if (!phone) {
        console.log("[Webhook Z-API] ❌ Telefone faltando!");
        return res.status(400).json({ success: false, error: "Missing phone" });
      }
      
      // Ignorar mensagens próprias, de API ou grupos
      if (fromMe || fromApi || isGroup) {
        console.log("[Webhook Z-API] ⏭️  Ignorando: mensagem própria, API ou grupo", { fromMe, fromApi, isGroup });
        return res.json({ success: true, message: "Ignored: bot message, API message or group" });
      }
      
      // Verificar se já processamos esta mensagem (deduplicação)
      const cacheKey = `${phone}-${messageContent.substring(0, 50)}-${messageId || ''}`;
      const now = Date.now();
      
      if (processedMessages.has(cacheKey)) {
        const lastProcessed = processedMessages.get(cacheKey)!;
        if (now - lastProcessed < CACHE_TTL) {
          console.log("[Webhook Z-API] ⏭️  Ignorando: mensagem duplicada (cache)", { cacheKey });
          return res.json({ success: true, message: "Ignored: duplicate message" });
        }
      }
      
      // Marcar mensagem como processada ANTES de processar
      processedMessages.set(cacheKey, now);
      console.log("[Webhook Z-API] ✅ Mensagem marcada como processada:", cacheKey);
      
      // Se for áudio, responder automaticamente e encaminhar
      if (isAudio) {
        console.log("[Webhook Z-API] 🎤 Áudio detectado - enviando resposta automática");
        const audioResponse = "Oi! Infelizmente não consigo ouvir áudios. 😅\n\nVocê prefere:\n1️⃣ Escrever sua mensagem (te respondo na hora)\n2️⃣ Que eu avise o Dr. Juliano para ouvir seu áudio";
        
        try {
          await sendTextMessage({ phone, message: audioResponse });
          console.log("[Webhook Z-API] ✅ Resposta de áudio enviada");
          
          // Salvar no banco que recebeu áudio
          await createWebhookLog({
            webhookSource: "zapi",
            webhookEvent: "audio_received",
            requestPayload: JSON.stringify(payload),
          });
          
          return res.json({ success: true, message: "Audio received and forwarded" });
        } catch (error) {
          console.error("[Webhook Z-API] Erro ao responder áudio:", error);
        }
      }
      
      console.log("[Webhook Z-API] 🤖 Processando mensagem com IA...");
      try {
        const fs = await import("fs/promises");
        await fs.appendFile("/tmp/webhook-flow.log", `[${new Date().toISOString()}] Processando com IA...\n`);
      } catch (e) {}
      // Processar mensagem (passar chatName para usar nome do contato)
      const result = await processMessage(phone, messageContent, undefined, chatName);
      console.log("[Webhook Z-API] ✅ IA respondeu:", result.response.substring(0, 100) + "...");
      
      // Se cliente enviou documento (PDF/imagem), qualificar automaticamente
      if (isDocument && result.newContext.leadId) {
        console.log("[Webhook Z-API] 📎 Documento detectado - qualificando lead automaticamente...");
        const { getDb } = await import("../db");
        const { leads } = await import("../../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        
        const db = await getDb();
        if (db) {
          await db
            .update(leads)
            .set({ 
              casoQualificado: true,
              motivoNaoQualificado: null,
            })
            .where(eq(leads.id, result.newContext.leadId));
          
          console.log("[Webhook Z-API] ✅ Lead qualificado por envio de documento!");
        }
      }
      try {
        const fs = await import("fs/promises");
        await fs.appendFile("/tmp/webhook-flow.log", `[${new Date().toISOString()}] IA respondeu: ${result.response.substring(0, 100)}...\n`);
      } catch (e) {}
      
      console.log("[Webhook Z-API] 📤 Enviando resposta via Z-API...");
      try {
        const fs = await import("fs/promises");
        await fs.appendFile("/tmp/webhook-flow.log", `[${new Date().toISOString()}] Enviando via Z-API...\n`);
      } catch (e) {}
      // Enviar resposta
      const sendResult = await sendTextMessage({
        phone: phone,
        message: result.response,
      });
      console.log("[Webhook Z-API] ✅ Resposta enviada com sucesso!", sendResult);
      
      // Verificar se cliente solicitou atendimento humano
      const { detectsHumanHandoffRequest, notifyHumanHandoffRequest, detectsProgressInquiry, notifyProgressInquiry, detectsScamReport, notifyScamReport, detectsNonStandardCase, notifyNonStandardCase } = await import("../services/human-handoff-notification");
      if (detectsHumanHandoffRequest(messageContent) || result.shouldHandoff) {
        console.log("[Webhook Z-API] 🚨 Atendimento humano solicitado - notificando Dr. Juliano...");
        // Enviar notificação imediata de forma assíncrona
        notifyHumanHandoffRequest(
          phone,
          result.newContext.leadData?.clienteNome,
          result.handoffReason || "Cliente solicitou falar com advogado",
          messageContent
        ).catch(err => {
          console.error("[Webhook Z-API] Erro ao notificar handoff:", err);
        });
      }
      
      // Verificar se cliente está cobrando andamento
      if (detectsProgressInquiry(messageContent)) {
        console.log("[Webhook Z-API] ⚠️ Cliente cobrando andamento - notificando ENFATICAMENTE Dr. Juliano...");
        // Enviar notificação enfática de forma assíncrona
        notifyProgressInquiry(
          phone,
          result.newContext.leadData?.clienteNome,
          messageContent
        ).catch(err => {
          console.error("[Webhook Z-API] Erro ao notificar cobrança de andamento:", err);
        });
      }
      
      // Verificar se cliente está relatando tentativa de golpe
      if (detectsScamReport(messageContent)) {
        console.log("[Webhook Z-API] 🚨 GOLPE RELATADO - notificando Dr. Juliano...");
        // Enviar notificação de golpe de forma assíncrona
        notifyScamReport(
          phone,
          result.newContext.leadData?.clienteNome,
          messageContent
        ).catch(err => {
          console.error("[Webhook Z-API] Erro ao notificar relato de golpe:", err);
        });
      }
      
      // Verificar se é caso fora do padrão (não consignado)
      if (detectsNonStandardCase(messageContent)) {
        console.log("[Webhook Z-API] 📋 Caso fora do padrão detectado - notificando Dr. Juliano...");
        // Enviar notificação de caso diferente de forma assíncrona
        notifyNonStandardCase(
          phone,
          result.newContext.leadData?.clienteNome,
          messageContent,
          "Direito do Consumidor ou outra área"
        ).catch(err => {
          console.error("[Webhook Z-API] Erro ao notificar caso fora do padrão:", err);
        });
      }
      
      // Verificar se deve enviar resumo para o Dr. Juliano
      const { shouldSendSummary, sendConversationSummaryToDrJuliano } = await import("../services/conversation-summary");
      if (shouldSendSummary(messageContent)) {
        console.log("[Webhook Z-API] 📊 Detectada despedida - enviando resumo...");
        // Enviar resumo de forma assíncrona (não bloqueia resposta)
        sendConversationSummaryToDrJuliano(phone, result.newContext.leadId).catch(err => {
          console.error("[Webhook Z-API] Erro ao enviar resumo:", err);
        });
      }
      try {
        const fs = await import("fs/promises");
        await fs.appendFile("/tmp/webhook-flow.log", `[${new Date().toISOString()}] ✅ SUCESSO! Resposta enviada: ${JSON.stringify(sendResult)}\n`);
      } catch (e) {}
      
      console.log(`[Webhook Z-API] 🎉 Fluxo completo finalizado para ${phone}`);
      
      res.json({ success: true, leadId: result.newContext.leadId });
    } catch (error) {
      console.error("[Webhook Z-API] Error:", error);
      try {
        const fs = await import("fs/promises");
        await fs.appendFile("/tmp/webhook-flow.log", `[${new Date().toISOString()}] ❌ ERRO: ${error}\n`);
      } catch (e) {}
      res.status(500).json({ success: false, error: String(error) });
    }
  });
  
  // Webhook para receber notificações do Jul.IA Intimações
  app.post("/api/webhooks/intimacoes", async (req, res) => {
    try {
      console.log("\n" + "=".repeat(80));
      console.log("[Webhook Intimações] 📥 NOTIFICAÇÃO RECEBIDA:");
      console.log(JSON.stringify(req.body, null, 2));
      console.log("=".repeat(80) + "\n");
      
      const { processarNotificacaoAudiencia, atualizarClienteDeIntimacoes } = await import("../services/julia-intimacoes-integration");
      
      const payload = req.body;
      const action = payload.action;
      
      if (action === "audiencia") {
        // Notificação de audiência
        console.log("[Webhook Intimações] 📅 Processando notificação de audiência...");
        await processarNotificacaoAudiencia(payload.data);
        console.log("[Webhook Intimações] ✅ Notificação de audiência processada");
      } else if (action === "update_cliente") {
        // Atualização de cliente vindo do Jul.IA Intimações
        console.log("[Webhook Intimações] 🔄 Atualizando cliente...");
        await atualizarClienteDeIntimacoes(payload.cliente);
        console.log("[Webhook Intimações] ✅ Cliente atualizado");
      } else {
        console.log("[Webhook Intimações] ⚠️ Ação desconhecida:", action);
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("[Webhook Intimações] Error:", error);
      res.status(500).json({ success: false, error: String(error) });
    }
  });
  
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    
    // Iniciar monitoramento de APIs
    import("../services/api-health-monitor").then(({ startHealthMonitoring }) => {
      startHealthMonitoring(5); // Verifica a cada 5 minutos
      console.log("[HealthMonitor] 🚨 Monitoramento de APIs iniciado");
    }).catch(err => {
      console.error("[HealthMonitor] ❌ Erro ao iniciar monitoramento:", err);
    });
    
    // Agendar follow-ups automáticos
    import("../services/follow-up-service").then(({ agendarFollowUpsAutomaticos }) => {
      agendarFollowUpsAutomaticos();
    });
    
    // Inicializar scheduler (relatório diário, etc)
    import("../services/scheduler").then(({ initializeScheduler }) => {
      initializeScheduler();
    });
  });
}

startServer().catch(console.error);
