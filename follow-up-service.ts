 * Serviço de Follow-up Automático
 * 
 * Envia mensagens automáticas a cada 2 dias para leads que:
 * - Forneceram todos os dados
 * - Foram qualificados
 * - Mas não voltaram/não assinaram procuração
 */

import { getDb } from "../db";
import { leads, conversations } from "../../drizzle/schema";
import { eq, and, lt, desc, sql } from "drizzle-orm";
import { sendTextMessage } from "./zapi";

/**
 * Detecta leads inativos que precisam de follow-up
 */
export async function detectarLeadsInativos(): Promise<any[]> {
  const db = await getDb();
  if (!db) {
    console.error("[Follow-up] Database não disponível");
    return [];
  }

  try {
    // Data de 2 dias atrás
    const doisDiasAtras = new Date();
    doisDiasAtras.setDate(doisDiasAtras.getDate() - 2);

    // Buscar leads qualificados que não interagem há 2+ dias
    const leadsInativos = await db
      .select()
      .from(leads)
      .where(
        and(
          eq(leads.casoQualificado, true), // Lead foi qualificado
          lt(leads.dataUltimaInteracao, doisDiasAtras), // Última interação há 2+ dias
          eq(leads.statusLead, "qualificado") // Status ainda é "qualificado" (não convertido)
        )
      )
      .limit(50); // Processar no máximo 50 por vez

    console.log(`[Follow-up] 📊 Encontrados ${leadsInativos.length} leads inativos`);
    
    return leadsInativos;
  } catch (error) {
    console.error("[Follow-up] Erro ao detectar leads inativos:", error);
    return [];
  }
}