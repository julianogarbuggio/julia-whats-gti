/**
 * Serviço de Detecção Automática de Aprendizados e Falhas
 * Analisa conversas e identifica oportunidades de melhoria
 */

import { invokeLLM } from "../_core/llm";
import { getDb } from "../db";
import { learningLogs, conversations, leads } from "../../drizzle/schema";
import { desc, eq, and, gte } from "drizzle-orm";

export interface LearningDetectionResult {
  type: "learning" | "failure" | "doubt";
  title: string;
  description: string;
  category: string;
  confidence: number;
  context?: any;
}

/**
 * Analisa uma conversa e detecta aprendizados, falhas e dúvidas
 */
export async function detectLearningFromConversation(
  leadId: number,
  conversationId: number
): Promise<LearningDetectionResult[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    // Buscar contexto da conversa
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1);

    if (!conversation) return [];

    const [lead] = await db
      .select()
      .from(leads)
      .where(eq(leads.id, leadId))
      .limit(1);

    // Buscar últimas 10 mensagens da conversa para contexto
    const recentMessages = await db
      .select()
      .from(conversations)
      .where(eq(conversations.leadId, leadId))
      .orderBy(desc(conversations.timestamp))
      .limit(10);

    // Montar contexto para análise
    const conversationContext = recentMessages
      .reverse()
      .map((msg) => `${msg.fromMe ? "Jul.IA" : "Cliente"}: ${msg.messageContent}`)
      .join("\n");

    // Usar LLM para detectar aprendizados/falhas
    const analysis = await analyzeLearningOpportunities(
      conversationContext,
      conversation,
      lead
    );

    return analysis;
  } catch (error) {
    console.error("[Learning Detection] Erro ao detectar aprendizados:", error);
    return [];
  }
}

/**
 * Usa LLM para analisar conversa e identificar oportunidades de aprendizado
 */
async function analyzeLearningOpportunities(
  conversationContext: string,
  conversation: any,
  lead: any
): Promise<LearningDetectionResult[]> {
  try {
    const prompt = `Você é um sistema de análise de qualidade de atendimento jurídico via WhatsApp.

Analise a seguinte conversa e identifique:

1. **APRENDIZADOS** (learning): Situações onde a IA respondeu bem, identificou padrões úteis, ou demonstrou conhecimento que deve ser reforçado
2. **FALHAS** (failure): Situações onde a IA respondeu inadequadamente, cometeu erros, ou não soube lidar com a situação
3. **DÚVIDAS** (doubt): Situações ambíguas onde a IA não tinha certeza da melhor resposta

**CONTEXTO DA CONVERSA:**
${conversationContext}

**INFORMAÇÕES DO LEAD:**
- Nome: ${lead?.clienteNome || "Não informado"}
- Status: ${lead?.statusLead || "Não informado"}
- Caso qualificado: ${lead?.casoQualificado ? "Sim" : "Não"}

**INSTRUÇÕES:**
- Seja crítico e honesto
- Identifique padrões que podem ser generalizados
- Foque em situações que impactam a qualidade do atendimento
- Classifique por categoria (tipo_caso, tom_conversa, procedimento, conhecimento_juridico, etc)
- Atribua confiança de 0-100 baseado na clareza da situação

Retorne um JSON array com os achados:
[
  {
    "type": "learning" | "failure" | "doubt",
    "title": "Título resumido (max 100 chars)",
    "description": "Descrição detalhada do que aconteceu e por quê",
    "category": "categoria",
    "confidence": 85
  }
]

Se não houver achados relevantes, retorne array vazio: []`;

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content:
            "Você é um analista de qualidade especializado em atendimento jurídico automatizado. Retorne APENAS JSON válido, sem markdown.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "learning_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              findings: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: {
                      type: "string",
                      enum: ["learning", "failure", "doubt"],
                    },
                    title: { type: "string" },
                    description: { type: "string" },
                    category: { type: "string" },
                    confidence: { type: "number" },
                  },
                  required: ["type", "title", "description", "category", "confidence"],
                  additionalProperties: false,
                },
              },
            },
            required: ["findings"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0]?.message?.content;
    if (!content || typeof content !== 'string') return [];

    const parsed = JSON.parse(content);
    return parsed.findings || [];
  } catch (error) {
    console.error("[Learning Analysis] Erro ao analisar:", error);
    return [];
  }
}

/**
 * Salva aprendizados detectados no banco
 */
export async function saveLearningLogs(
  leadId: number,
  conversationId: number,
  learnings: LearningDetectionResult[]
): Promise<void> {
  const db = await getDb();
  if (!db || learnings.length === 0) return;

  try {
    // Buscar mensagens para contexto
    const messages = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1);

    const conversation = messages[0];

    for (const learning of learnings) {
      await db.insert(learningLogs).values({
        type: learning.type,
        leadId: leadId,
        conversationId: conversationId,
        title: learning.title,
        description: learning.description,
        category: learning.category,
        confidence: learning.confidence,
        context: JSON.stringify(learning.context || {}),
        aiResponse: conversation?.fromMe ? conversation.messageContent : null,
        userMessage: !conversation?.fromMe ? conversation.messageContent : null,
        status: "pending",
      });
    }

    console.log(
      `[Learning Detection] Salvos ${learnings.length} aprendizados para lead ${leadId}`
    );
  } catch (error) {
    console.error("[Learning Detection] Erro ao salvar:", error);
  }
}

/**
 * Detecta e salva aprendizados automaticamente após cada conversa
 */
export async function autoDetectAndSave(
  leadId: number,
  conversationId: number
): Promise<void> {
  try {
    const learnings = await detectLearningFromConversation(leadId, conversationId);
    if (learnings.length > 0) {
      await saveLearningLogs(leadId, conversationId, learnings);
    }
  } catch (error) {
    console.error("[Auto Detection] Erro:", error);
  }
}

/**
 * Busca aprendizados pendentes de revisão
 */
export async function getPendingLearnings(): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const pending = await db
      .select()
      .from(learningLogs)
      .where(eq(learningLogs.status, "pending"))
      .orderBy(desc(learningLogs.createdAt))
      .limit(100);

    return pending;
  } catch (error) {
    console.error("[Get Pending] Erro:", error);
    return [];
  }
}

/**
 * Busca aprendizados do dia para relatório
 */
export async function getTodayLearnings(): Promise<{
  learnings: any[];
  failures: any[];
  doubts: any[];
}> {
  const db = await getDb();
  if (!db) return { learnings: [], failures: [], doubts: [] };

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayLogs = await db
      .select()
      .from(learningLogs)
      .where(gte(learningLogs.createdAt, today))
      .orderBy(desc(learningLogs.confidence));

    return {
      learnings: todayLogs.filter((log) => log.type === "learning"),
      failures: todayLogs.filter((log) => log.type === "failure"),
      doubts: todayLogs.filter((log) => log.type === "doubt"),
    };
  } catch (error) {
    console.error("[Today Learnings] Erro:", error);
    return { learnings: [], failures: [], doubts: [] };
  }
}
