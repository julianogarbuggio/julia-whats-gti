import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { clientesRouter, documentosRouter } from "./routers-clientes";
import { securityRouter } from "./routers/security";
import { createBackup, listBackups, validateBackup } from "./services/backup";
import { getLookerStudioEmbedConfig, prepareMetricsForExport, generateGoogleSheetsCSV, getGoogleSheetsInstructions } from "./services/looker-studio";
import { 
  generateAIResponse, 
  recordInteraction, 
  addKnowledge, 
  addRestriction, 
  listKnowledge, 
  listRestrictions, 
  listLearningPatterns, 
  approveLearningPattern,
  seedInitialKnowledge 
} from "./services/ai-chatbot";
import {
  saveLearning,
  getApprovedLearnings,
  listAllLearnings,
  approveLearning,
  rejectLearning,
  deactivateLearning,
  getPendingLearnings,
  generateDailyLearningReport,
} from "./services/ai-learning-service";

export const appRouter = router({
  system: systemRouter,
  security: securityRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============================================
  // LEADS - Gerenciamento de leads
  // ============================================
  leads: router({
    // Listar todos os leads
    list: protectedProcedure
      .input(z.object({
        limit: z.number().optional().default(100),
        offset: z.number().optional().default(0),
      }))
      .query(async ({ input }) => {
        return await db.getAllLeads(input.limit, input.offset);
      }),

    // Buscar leads por nome, WhatsApp ou CPF
    search: protectedProcedure
      .input(z.object({
        query: z.string(),
      }))
      .query(async ({ input }) => {
        return await db.searchLeads(input.query);
      }),

    // Filtrar leads por status
    byStatus: protectedProcedure
      .input(z.object({
        status: z.enum(["novo", "qualificado", "agendado", "documentos_enviados", "convertido", "perdido", "atendimento_humano"]),
      }))
      .query(async ({ input }) => {
        return await db.getLeadsByStatus(input.status);
      }),

    // Obter lead por ID
    getById: protectedProcedure
      .input(z.object({
        id: z.number(),
      }))
      .query(async ({ input }) => {
        return await db.getLeadById(input.id);
      }),

    // Criar novo lead
    create: publicProcedure
      .input(z.object({
        clienteNome: z.string(),
        clienteEmail: z.string().email().optional(),
        clienteWhatsapp: z.string(),
        clienteCpf: z.string().optional(),
        bancoNome: z.string().optional(),
        tipoEmprestimo: z.string().optional(),
        statusEmprestimo: z.string().optional(),
        valorParcela: z.number().optional(),
        numeroParcelas: z.number().optional(),
        periodoContrato: z.string().optional(),
        numeroContrato: z.string().optional(),
        casoQualificado: z.boolean().optional(),
        tipoProblema: z.string().optional(),
        statusLead: z.enum(["novo", "qualificado", "agendado", "documentos_enviados", "convertido", "perdido", "atendimento_humano"]).optional(),
        preferenciaAgendamento: z.string().optional(),
        atendimentoHumanoSolicitado: z.boolean().optional(),
        consentimentoLgpd: z.boolean().optional(),
        consentimentoAnaliseContrato: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createLead(input);
      }),

    // Atualizar lead
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          clienteNome: z.string().optional(),
          clienteEmail: z.string().email().optional(),
          clienteWhatsapp: z.string().optional(),
          clienteCpf: z.string().optional(),
          bancoNome: z.string().optional(),
          tipoEmprestimo: z.string().optional(),
          statusEmprestimo: z.string().optional(),
          valorParcela: z.number().optional(),
          numeroParcelas: z.number().optional(),
          periodoContrato: z.string().optional(),
          numeroContrato: z.string().optional(),
          casoQualificado: z.boolean().optional(),
          tipoProblema: z.string().optional(),
          statusLead: z.enum(["novo", "qualificado", "agendado", "documentos_enviados", "convertido", "perdido", "atendimento_humano"]).optional(),
          preferenciaAgendamento: z.string().optional(),
          atendimentoHumanoSolicitado: z.boolean().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        return await db.updateLead(input.id, input.data);
      }),

    // Deletar lead
    delete: protectedProcedure
      .input(z.object({
        id: z.number(),
      }))
      .mutation(async ({ input }) => {
        return await db.deleteLead(input.id);
      }),

    // Deletar múltiplos leads
    deleteMultiple: protectedProcedure
      .input(z.object({
        ids: z.array(z.number()),
      }))
      .mutation(async ({ input }) => {
        return await db.deleteMultipleLeads(input.ids);
      }),

    // Obter lead por WhatsApp
    getByWhatsapp: publicProcedure
      .input(z.object({
        whatsapp: z.string(),
      }))
      .query(async ({ input }) => {
        return await db.getLeadByWhatsapp(input.whatsapp);
      }),
  }),

  // ============================================
  // CONVERSATIONS - Gerenciamento de conversas
  // ============================================
  conversations: router({
    // Criar nova mensagem na conversa
    create: publicProcedure
      .input(z.object({
        leadId: z.number(),
        messageId: z.string().optional(),
        phone: z.string(),
        fromMe: z.boolean(),
        messageType: z.string().optional().default("text"),
        messageContent: z.string(),
        stepId: z.string().optional(),
        stepName: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createConversation(input);
      }),

    // Obter conversas por lead ID
    byLeadId: protectedProcedure
      .input(z.object({
        leadId: z.number(),
      }))
      .query(async ({ input }) => {
        return await db.getConversationsByLeadId(input.leadId);
      }),

    // Obter conversas por telefone
    byPhone: protectedProcedure
      .input(z.object({
        phone: z.string(),
        limit: z.number().optional().default(50),
      }))
      .query(async ({ input }) => {
        return await db.getConversationsByPhone(input.phone, input.limit);
      }),
  }),

  // ============================================
  // CONFIG - Configurações do chatbot
  // ============================================
  config: router({
    // Obter todas as configurações
    getAll: protectedProcedure.query(async () => {
      return await db.getAllConfigs();
    }),

    // Obter configuração específica
    get: protectedProcedure
      .input(z.object({
        key: z.string(),
      }))
      .query(async ({ input }) => {
        return await db.getConfig(input.key);
      }),

    // Definir configuração
    set: protectedProcedure
      .input(z.object({
        configKey: z.string(),
        configValue: z.string(),
        configType: z.enum(["text", "json", "boolean", "number"]).optional().default("text"),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.setConfig(input);
      }),
  }),

  // ============================================
  // INTEGRATIONS - Gerenciamento de integrações
  // ============================================
  integrations: router({
    // Listar todas as integrações
    list: protectedProcedure.query(async () => {
      return await db.getAllIntegrations();
    }),

    // Obter integração específica
    get: protectedProcedure
      .input(z.object({
        name: z.string(),
      }))
      .query(async ({ input }) => {
        return await db.getIntegration(input.name);
      }),

    // Criar ou atualizar integração
    upsert: protectedProcedure
      .input(z.object({
        integrationName: z.string(),
        integrationDisplayName: z.string(),
        integrationStatus: z.enum(["active", "inactive", "error"]).optional().default("inactive"),
        configData: z.string().optional(), // JSON string
      }))
      .mutation(async ({ input }) => {
        return await db.upsertIntegration(input);
      }),
  }),

  // ============================================
  // WEBHOOKS - Endpoints públicos para receber webhooks
  // ============================================
  webhooks: router({
    // Webhook de teste simplificado
    test: publicProcedure
      .input(z.any())
      .mutation(async ({ input }) => {
        console.log("[Webhook Test] Received:", input);
        return { success: true, received: input };
      }),
    // Webhook Z-API (receber mensagens do WhatsApp)
    zapi: publicProcedure
      .input(z.any()) // Aceita qualquer payload
      .mutation(async ({ input }) => {
        try {
          // Log do webhook
          console.log("[Webhook Z-API] Received payload:", JSON.stringify(input, null, 2));
          
          try {
            await db.createWebhookLog({
              webhookSource: "zapi",
              webhookEvent: input.type || "message_received",
              requestPayload: JSON.stringify(input),
              responseStatus: 200,
              processed: false,
            });
          } catch (logError) {
            console.error("[Webhook Z-API] Failed to create webhook log:", logError);
          }

          // Processar mensagem recebida
          const phone = input.phone;
          const messageContent = input.text?.message || input.message || "";
          const messageId = input.messageId;

          console.log("[Webhook Z-API] Extracted - Phone:", phone, "Message:", messageContent);

          if (!phone || !messageContent) {
            console.log("[Webhook Z-API] Missing required fields");
            return { success: false, error: "Missing required fields" };
          }

          // Verificar se é mensagem do bot ou de grupo
          const fromMe = input.fromMe || false;
          const isGroup = input.isGroup || false;
          
          if (fromMe || isGroup) {
            console.log("[Webhook Z-API] Ignored: fromMe=", fromMe, "isGroup=", isGroup);
            return { success: true, message: "Ignored: bot message or group" };
          }

          // Processar mensagem com fluxo conversacional
          const { processMessage } = await import("./services/conversation-flow");
          const { sendTextMessage } = await import("./services/zapi");
          
          try {
            console.log("[Webhook Z-API] Calling processMessage with phone:", phone, "message:", messageContent);
            const result = await processMessage(phone, messageContent);
            console.log("[Webhook Z-API] processMessage returned:", result);
            
            // Enviar resposta
            console.log("[Webhook Z-API] Sending response to:", phone);
            await sendTextMessage({
              phone: phone,
              message: result.response,
            });
            
            console.log(`[Webhook Z-API] Processed and responded to ${phone}`);
            
            return { success: true, leadId: result.newContext.leadId };
          } catch (error) {
            console.error("[Webhook Z-API] Error processing message:", error);
            console.error("[Webhook Z-API] Error stack:", error instanceof Error ? error.stack : "No stack");
            return { success: false, error: String(error) };
          }
        } catch (error) {
          console.error("[Webhook Z-API] Error:", error);
          return { success: false, error: String(error) };
        }
      }),

    // Webhook ZapSign (notificações de assinatura)
    zapsign: publicProcedure
      .input(z.any()) // Aceita qualquer payload
      .mutation(async ({ input }) => {
        try {
          // Log do webhook
          await db.createWebhookLog({
            webhookSource: "zapsign",
            webhookEvent: input.event || "document_event",
            requestPayload: JSON.stringify(input),
            responseStatus: 200,
            processed: false,
          });

          // Processar evento de assinatura
          const event = input.event;
          const documentId = input.document_id;

          // Aqui você pode adicionar lógica específica para cada tipo de evento
          // Por exemplo: document_signed, document_viewed, etc.

          return { success: true, event, documentId };
        } catch (error) {
          console.error("[Webhook ZapSign] Error:", error);
          return { success: false, error: String(error) };
        }
      }),
  }),

  // ============================================
  // REPORTS - Relatórios e métricas
  // ============================================
  reports: router({
    // Estatísticas gerais do dashboard
    dashboard: protectedProcedure.query(async () => {
      const allLeads = await db.getAllLeads(1000);
      
      const totalLeads = allLeads.length;
      const leadsQualificados = allLeads.filter(l => l.casoQualificado).length;
      const leadsConvertidos = allLeads.filter(l => l.statusLead === "convertido").length;
      const leadsAtendimentoHumano = allLeads.filter(l => l.atendimentoHumanoSolicitado).length;
      const leadsAgendados = allLeads.filter(l => l.statusLead === "agendado").length;
      const leadsDocumentosEnviados = allLeads.filter(l => l.statusLead === "documentos_enviados").length;

      return {
        totalLeads,
        leadsQualificados,
        leadsConvertidos,
        leadsAtendimentoHumano,
        leadsAgendados,
        leadsDocumentosEnviados,
        taxaQualificacao: totalLeads > 0 ? (leadsQualificados / totalLeads * 100).toFixed(2) : "0",
        taxaConversao: totalLeads > 0 ? (leadsConvertidos / totalLeads * 100).toFixed(2) : "0",
      };
    }),

    // Exportar leads em formato CSV
    exportCsv: protectedProcedure
      .input(z.object({
        status: z.string().optional(),
      }))
      .query(async ({ input }) => {
        let leadsToExport = [];
        
        if (input.status) {
          leadsToExport = await db.getLeadsByStatus(input.status);
        } else {
          leadsToExport = await db.getAllLeads(10000);
        }

        // Gerar CSV
        const headers = [
          "ID",
          "Nome",
          "Email",
          "WhatsApp",
          "CPF",
          "Banco",
          "Tipo Empréstimo",
          "Status Empréstimo",
          "Valor Parcela",
          "Número Parcelas",
          "Período Contrato",
          "Número Contrato",
          "Caso Qualificado",
          "Status Lead",
          "Data Primeiro Contato",
        ];

        const rows = leadsToExport.map(lead => [
          lead.id,
          lead.clienteNome,
          lead.clienteEmail || "",
          lead.clienteWhatsapp,
          lead.clienteCpf || "",
          lead.bancoNome || "",
          lead.tipoEmprestimo || "",
          lead.statusEmprestimo || "",
          lead.valorParcela ? (lead.valorParcela / 100).toFixed(2) : "",
          lead.numeroParcelas || "",
          lead.periodoContrato || "",
          lead.numeroContrato || "",
          lead.casoQualificado ? "Sim" : "Não",
          lead.statusLead,
          lead.dataPrimeiroContato?.toISOString() || "",
        ]);

        const csvContent = [
          headers.join(","),
          ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
        ].join("\n");

        return {
          csv: csvContent,
          filename: `leads_export_${new Date().toISOString().split('T')[0]}.csv`,
        };
      }),
  }),

  // ============================================
  // CLIENTES - Gerenciamento de clientes
  // ============================================
  clientes: clientesRouter,

  // ============================================
  // DOCUMENTOS - Gerenciamento de documentos
  // ============================================
  documentos: documentosRouter,

  // ============================================
  // BACKUP - Sistema de backup
  // ============================================
  backup: router({
    create: protectedProcedure
      .input(z.object({
        compress: z.boolean().optional(),
        tables: z.array(z.string()).optional(),
      }).optional())
      .mutation(async ({ input }) => {
        return await createBackup(input || {});
      }),
    
    list: protectedProcedure
      .query(async () => {
        return await listBackups();
      }),
    
    validate: protectedProcedure
      .input(z.object({ filePath: z.string() }))
      .query(async ({ input }) => {
        return await validateBackup(input.filePath);
      }),
  }),

  // ============================================
  // LOOKER STUDIO - Integração com Google Looker Studio
  // ============================================
  lookerStudio: router({
    // Obter configuração de embed
    getEmbedConfig: protectedProcedure.query(() => {
      return getLookerStudioEmbedConfig();
    }),
    
    // Preparar métricas para exportação
    prepareMetrics: protectedProcedure.query(async () => {
      return await prepareMetricsForExport();
    }),
    
    // Gerar CSV para Google Sheets
    generateCSV: protectedProcedure.query(async () => {
      return await generateGoogleSheetsCSV();
    }),
    
    // Obter instruções de integração
    getInstructions: protectedProcedure.query(() => {
      return { instructions: getGoogleSheetsInstructions() };
    }),
  }),

  // ============================================
  // AI - Sistema de IA Treinável
  // ============================================
  ai: router({
    // Gerar resposta da IA
    generateResponse: publicProcedure
      .input(z.object({
        userMessage: z.string(),
        leadId: z.number().optional(),
        conversationHistory: z.array(z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string(),
        })).optional(),
        leadData: z.any().optional(),
      }))
      .mutation(async ({ input }) => {
        const response = await generateAIResponse(input.userMessage, {
          leadId: input.leadId,
          conversationHistory: input.conversationHistory || [],
          leadData: input.leadData,
        });
        
        // Registrar interação
        await recordInteraction(
          input.leadId,
          undefined,
          input.userMessage,
          response.response,
          { conversationHistory: input.conversationHistory },
          response.knowledgeUsed,
          response.shouldHandoff,
          response.handoffReason
        );
        
        return response;
      }),
    
    // Adicionar conhecimento
    addKnowledge: protectedProcedure
      .input(z.object({
        categoria: z.string(),
        topico: z.string(),
        conteudo: z.string(),
        palavrasChave: z.string().optional(),
        prioridade: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        return await addKnowledge(input);
      }),
    
    // Listar conhecimento
    listKnowledge: protectedProcedure
      .input(z.object({
        categoria: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await listKnowledge(input?.categoria);
      }),
    
    // Adicionar restrição
    addRestriction: protectedProcedure
      .input(z.object({
        tema: z.string(),
        descricao: z.string().optional(),
        palavrasGatilho: z.string().optional(),
        mensagemEncaminhamento: z.string(),
      }))
      .mutation(async ({ input }) => {
        return await addRestriction(input);
      }),
    
    // Listar restrições
    listRestrictions: protectedProcedure
      .query(async () => {
        return await listRestrictions();
      }),
    
    // Listar padrões de aprendizado
    listLearningPatterns: protectedProcedure
      .input(z.object({
        onlyApproved: z.boolean().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await listLearningPatterns(input?.onlyApproved);
      }),
    
    // Aprovar padrão de aprendizado
    approveLearningPattern: protectedProcedure
      .input(z.object({
        id: z.number(),
      }))
      .mutation(async ({ input }) => {
        return await approveLearningPattern(input.id);
      }),
    
    // Seed inicial de conhecimento
    seedKnowledge: protectedProcedure
      .mutation(async () => {
        await seedInitialKnowledge();
        return { success: true };
      }),
  }),

  // ============================================
  // LEARNINGS - Sistema de Aprendizado Universal
  // ============================================
  learnings: router({
    // Listar todos os aprendizados com filtros
    list: protectedProcedure
      .input(z.object({
        status: z.enum(["pending", "approved", "rejected"]).optional(),
        type: z.enum(["real", "simulated"]).optional(),
        ativo: z.boolean().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await listAllLearnings({
          status: input?.status,
          type: input?.type,
          ativo: input?.ativo,
        });
      }),

    // Listar aprendizados pendentes
    pending: protectedProcedure
      .query(async () => {
        return await getPendingLearnings();
      }),

    // Salvar novo aprendizado
    save: protectedProcedure
      .input(z.object({
        type: z.enum(["real", "simulated"]),
        context: z.string(),
        correctResponse: z.string(),
        avoidResponse: z.string().optional(),
        keywords: z.string().optional(), // JSON string
        priority: z.number().optional().default(5),
        phoneNumber: z.string().optional(),
        notes: z.string().optional(),
        trainedBy: z.string(), // WhatsApp do treinador
      }))
      .mutation(async ({ input, ctx }) => {
        return await saveLearning({
          ...input,
          trainedBy: ctx.user?.openId || input.trainedBy,
        });
      }),

    // Aprovar aprendizado
    approve: protectedProcedure
      .input(z.object({
        id: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        const userId = ctx.user?.id || 1; // Fallback para admin
        return await approveLearning(input.id, userId);
      }),

    // Rejeitar aprendizado
    reject: protectedProcedure
      .input(z.object({
        id: z.number(),
        motivo: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await rejectLearning(input.id, input.motivo || "Rejeitado pelo administrador");
      }),

    // Desativar aprendizado
    deactivate: protectedProcedure
      .input(z.object({
        id: z.number(),
      }))
      .mutation(async ({ input }) => {
        return await deactivateLearning(input.id);
      }),

    // Gerar relatório diário
    dailyReport: protectedProcedure
      .mutation(async () => {
        return await generateDailyLearningReport();
      }),
  }),
});

export type AppRouter = typeof appRouter;
