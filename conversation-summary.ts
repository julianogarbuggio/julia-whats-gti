import { getDb } from "../db";
import { leads, conversations } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { invokeLLM } from "../_core/llm";
import { sendTextMessage } from "./zapi";

const DR_JULIANO_PHONE = "5511956759223"; // 11 95675-9223

/**
 * Gera resumo da conversa usando IA
 */
async function generateConversationSummary(
  leadData: any,
  messages: Array<{ role: "user" | "assistant"; content: string }>
): Promise<string> {
  const systemPrompt = `Você é um assistente que gera resumos de conversas de atendimento jurídico.

Crie um resumo CONCISO e ESTRUTURADO da conversa, incluindo:
- Nome do cliente (se identificado)
- Tipo de solicitação
- Principais informações coletadas
- Situação atual (novo lead / cliente existente / dúvida sobre processo)
- Próximos passos ou ações necessárias

Use emojis para deixar o resumo mais visual e fácil de ler.
Seja objetivo e direto.`;

  const conversationText = messages
    .map((msg) => `${msg.role === "user" ? "Cliente" : "Jul.IA"}: ${msg.content}`)
    .join("\n\n");

  const userPrompt = `Dados do lead:
${JSON.stringify(leadData, null, 2)}

Conversa:
${conversationText}

Gere um resumo estruturado desta conversa.`;

  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const summary =
      typeof response.choices[0]?.message?.content === "string"
        ? response.choices[0].message.content
        : "Erro ao gerar resumo";

    return summary;
  } catch (error) {
    console.error("[Summary] Erro ao gerar resumo:", error);
    return "Erro ao gerar resumo da conversa";
  }
}

/**
 * Envia resumo da conversa para o Dr. Juliano
 */
export async function sendConversationSummaryToDrJuliano(
  phone: string,
  leadId?: number
): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.error("[Summary] Database not available");
    return;
  }

  try {
    console.log("[Summary] 📊 Gerando resumo da conversa para:", phone);

    // Buscar dados do lead
    let leadData: any = { clienteWhatsapp: phone };
    if (leadId) {
      const leadResult = await db
        .select()
        .from(leads)
        .where(eq(leads.id, leadId))
        .limit(1);
      if (leadResult.length > 0) {
        leadData = leadResult[0];
      }
    } else {
      // Tentar buscar por telefone
      const leadResult = await db
        .select()
        .from(leads)
        .where(eq(leads.clienteWhatsapp, phone))
        .limit(1);
      if (leadResult.length > 0) {
        leadData = leadResult[0];
        leadId = leadResult[0].id;
      }
    }

    // Buscar histórico de mensagens
    const messages: Array<{ role: "user" | "assistant"; content: string }> = [];
    if (leadId) {
      const history = await db
        .select()
        .from(conversations)
        .where(eq(conversations.leadId, leadId))
        .orderBy(desc(conversations.createdAt))
        .limit(20);

      // Inverter ordem (mais antiga primeiro)
      messages.push(
        ...history.reverse().map((msg) => ({
          role: msg.fromMe ? ("assistant" as const) : ("user" as const),
          content: msg.messageContent,
        }))
      );
    }

    if (messages.length === 0) {
      console.log("[Summary] ⚠️ Nenhuma mensagem encontrada para resumir");
      return;
    }

    // Gerar resumo
    const summary = await generateConversationSummary(leadData, messages);

    // Montar mensagem para o Dr. Juliano
    const messageHeader = `📋 *RESUMO DE ATENDIMENTO*\n\n`;
    const clientInfo = `👤 *Cliente:* ${leadData.clienteNome || "Não identificado"}\n📱 *Telefone:* https://wa.me/${phone}\n\n`;
    const summaryText = `${summary}\n\n`;
    const footer = `---\n_Resumo gerado automaticamente pela Jul.IA_`;

    const fullMessage = messageHeader + clientInfo + summaryText + footer;

    // Enviar para o Dr. Juliano
    console.log("[Summary] 📤 Enviando resumo para Dr. Juliano...");
    await sendTextMessage({
      phone: DR_JULIANO_PHONE,
      message: fullMessage,
    });

    console.log("[Summary] ✅ Resumo enviado com sucesso!");
  } catch (error) {
    console.error("[Summary] ❌ Erro ao enviar resumo:", error);
  }
}

/**
 * Detecta se a conversa chegou ao fim (cliente se despediu ou não responde há tempo)
 */
export function shouldSendSummary(lastMessage: string): boolean {
  const despedidas = [
    "obrigad",
    "valeu",
    "ok",
    "beleza",
    "tchau",
    "até",
    "flw",
    "brigad",
    "agradeço",
    "grato",
    "grata",
    "tmj",
    "falou",
    "abs",
    "abraço",
    "boa noite",
    "bom dia",
    "boa tarde",
    "depois eu volto",
    "vou pensar",
    "vou ver",
    "qualquer coisa",
    "entendi",
    "certo",
    "perfeito",
    "combinado",
    "tá bom",
    "tudo bem",
  ];

  const messageLower = lastMessage.toLowerCase();
  return despedidas.some((palavra) => messageLower.includes(palavra));
}
