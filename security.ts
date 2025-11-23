import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { aiSecurityLogs } from "../../drizzle/schema";
import { desc } from "drizzle-orm";

// Lista de palavras proibidas em memória (pode ser movida para banco de dados)
const prohibitedWordsMap = new Map<string, string | undefined>();

export const securityRouter = router({
  // Listar logs de segurança
  listLogs: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    
    const logs = await db
      .select()
      .from(aiSecurityLogs)
      .orderBy(desc(aiSecurityLogs.createdAt))
      .limit(100);
    
    return logs;
  }),

  // Listar palavras proibidas
  listProhibitedWords: protectedProcedure.query(async () => {
    const words = Array.from(prohibitedWordsMap.entries()).map(([word, replacement]) => ({
      word,
      replacement: replacement || null,
    }));
    return words;
  }),

  // Adicionar palavra proibida
  addProhibitedWord: protectedProcedure
    .input(z.object({
      word: z.string(),
      replacement: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      prohibitedWordsMap.set(input.word.toLowerCase(), input.replacement);
      return { success: true };
    }),

  // Remover palavra proibida
  removeProhibitedWord: protectedProcedure
    .input(z.object({
      word: z.string(),
    }))
    .mutation(async ({ input }) => {
      prohibitedWordsMap.delete(input.word.toLowerCase());
      return { success: true };
    }),
});
