/**
 * Serviço de API para Dashboard de Treinamento
 * 
 * INSTRUÇÕES PARA ATIVAÇÃO:
 * Descomentar rotas em server/routers.ts
 */

import { getDb } from "../db";
import { learningLogs } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";

/**
 * Busca logs pendentes de revisão
 */
export async function getPendingLearningLogs() {
  const db = await getDb();
  if (!db) return [];

  try {
    const logs = await db
      .select()
      .from(learningLogs)
      .where(eq(learningLogs.status, "pending"))
      .orderBy(desc(learningLogs.confidence), desc(learningLogs.createdAt))
      .limit(100);

    return logs;
  } catch (error) {
    console.error("[Training Dashboard] Erro ao buscar logs:", error);
    return [];
  }
}

/**
 * Aprova um aprendizado
 */
export async function approveLearningLog(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(learningLogs)
    .set({
      status: "approved",
      reviewedAt: new Date(),
    })
    .where(eq(learningLogs.id, id));

  return { success: true };
}

/**
 * Rejeita um item
 */
export async function rejectLearningLog(id: number, notes?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(learningLogs)
    .set({
      status: "rejected",
      reviewedAt: new Date(),
      reviewNotes: notes || null,
    })
    .where(eq(learningLogs.id, id));

  return { success: true };
}

/**
 * Aplica correção a uma falha
 */
export async function correctLearningLog(id: number, correction: string, notes?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Buscar o log para ver o contexto
  const [log] = await db.select().from(learningLogs).where(eq(learningLogs.id, id)).limit(1);

  if (!log) throw new Error("Log not found");

  // Salvar correção
  await db
    .update(learningLogs)
    .set({
      status: "corrected",
      reviewedAt: new Date(),
      reviewNotes: notes || null,
      correctionApplied: correction,
    })
    .where(eq(learningLogs.id, id));

  // TODO: Aplicar correção ao conhecimento da IA
  // Isso pode ser feito adicionando à tabela ai_knowledge ou ajustando prompts

  return { success: true };
}

/**
 * Busca estatísticas de treinamento
 */
export async function getTrainingStats() {
  const db = await getDb();
  if (!db) return null;

  try {
    const allLogs = await db.select().from(learningLogs);

    const stats = {
      total: allLogs.length,
      pending: allLogs.filter((log) => log.status === "pending").length,
      approved: allLogs.filter((log) => log.status === "approved").length,
      rejected: allLogs.filter((log) => log.status === "rejected").length,
      corrected: allLogs.filter((log) => log.status === "corrected").length,
      byType: {
        learning: allLogs.filter((log) => log.type === "learning").length,
        failure: allLogs.filter((log) => log.type === "failure").length,
        doubt: allLogs.filter((log) => log.type === "doubt").length,
      },
      byCategory: {} as Record<string, number>,
    };

    // Agrupar por categoria
    allLogs.forEach((log) => {
      const cat = log.category || "outros";
      stats.byCategory[cat] = (stats.byCategory[cat] || 0) + 1;
    });

    return stats;
  } catch (error) {
    console.error("[Training Stats] Erro:", error);
    return null;
  }
}
