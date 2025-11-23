# 🔧 Instruções de Integração - Sistema de Treinamento

**Objetivo:** Integrar o sistema de treinamento da Jul.IA no projeto existente.

---

## 📋 Pré-requisitos

- Projeto Next.js com TypeScript
- Prisma ORM configurado
- tRPC configurado
- Banco de dados MySQL/PostgreSQL

---

## 🗄️ 1. Banco de Dados

### 1.1. Adicionar tabela `ai_learning` no schema

Abra o arquivo `drizzle/schema.ts` e adicione:

```typescript
export const aiLearning = mysqlTable("ai_learning", {
  id: int("id").autoincrement().primaryKey(),
  
  // Tipo de aprendizado
  type: mysqlEnum("type", ["REAL", "SIMULATED"]).notNull(),
  
  // Contexto do aprendizado
  context: text("context").notNull(), // Situação/pergunta do cliente
  correctResponse: text("correct_response").notNull(), // Como responder
  whatToAvoid: text("what_to_avoid"), // O que evitar
  
  // Palavras-chave para busca
  keywords: text("keywords").notNull(), // JSON array de palavras-chave
  
  // Prioridade (1-10)
  priority: int("priority").default(5).notNull(),
  
  // Status
  status: mysqlEnum("status", ["pending", "approved", "rejected", "active", "inactive"]).default("pending").notNull(),
  
  // Caso REAL: referência à conversa original
  originalPhoneNumber: varchar("original_phone_number", { length: 20 }),
  originalLeadId: int("original_lead_id"),
  
  // Métricas de uso
  timesApplied: int("times_applied").default(0).notNull(),
  lastApplied: timestamp("last_applied"),
  
  // Metadados
  createdBy: varchar("created_by", { length: 20 }).notNull(), // Telefone de quem criou
  createdAt: timestamp("created_at").defaultNow().notNull(),
  approvedBy: varchar("approved_by", { length: 20 }),
  approvedAt: timestamp("approved_at"),
  
  // Notas internas
  notes: text("notes"),
});

export type AiLearning = typeof aiLearning.$inferSelect;
export type InsertAiLearning = typeof aiLearning.$inferInsert;
```

### 1.2. Executar migração

```bash
pnpm db:push
```

---

## 📝 2. Serviço de Aprendizado

### 2.1. Criar arquivo `server/services/ai-learning-service.ts`

Copie o arquivo `arquivos/ai-learning-service.ts` para o seu projeto.

Este arquivo contém 9 funções principais:

1. **saveLearning()** - Salvar novo aprendizado
2. **queryLearnings()** - Buscar aprendizados relevantes por palavras-chave
3. **approveLearning()** - Aprovar aprendizado pendente
4. **rejectLearning()** - Rejeitar aprendizado
5. **deactivateLearning()** - Desativar aprendizado ativo
6. **incrementUsage()** - Incrementar contador de uso
7. **listLearnings()** - Listar com filtros
8. **getPendingLearnings()** - Listar pendentes
9. **getDailyReport()** - Gerar relatório diário

---

## 🤖 3. Integração no Chatbot

### 3.1. Atualizar `server/services/ai-chatbot.ts`

Adicione no início do arquivo:

```typescript
import { queryLearnings, incrementUsage } from './ai-learning-service';
```

### 3.2. Adicionar busca de aprendizados no prompt

Na função `generateAIResponse()`, antes de chamar a IA, adicione:

```typescript
// Buscar aprendizados relevantes
const learnings = await queryLearnings(userMessage);

// Adicionar aprendizados ao contexto
if (learnings.length > 0) {
  const learningsContext = learnings.map((l, i) => `
APRENDIZADO ${i + 1} (Prioridade ${l.priority}):
- Contexto: ${l.context}
- Resposta correta: ${l.correctResponse}
${l.whatToAvoid ? `- Evitar: ${l.whatToAvoid}` : ''}
- Usado ${l.timesApplied} vezes
  `).join('\n');

  systemPrompt += `\n\n📚 APRENDIZADOS RELEVANTES:\n${learningsContext}`;
  
  // Incrementar uso de cada aprendizado
  for (const learning of learnings) {
    await incrementUsage(learning.id);
  }
}
```

---

## 🎯 4. Detecção de Comando de Treinamento

### 4.1. Atualizar `server/services/ai-chatbot.ts`

Adicione no início da função `generateAIResponse()`:

```typescript
// Detectar comando de treinamento
if (
  userMessage.includes('🔧 MODO TREINAMENTO ATIVADO') &&
  context.leadData.clienteTelefone === '5544999869223'
) {
  return {
    response: `🔧 **MODO TREINAMENTO ATIVADO**\n\nVocê quer:\n\nA) Corrigir um erro que a Jul.IA cometeu? (caso REAL)\nB) Ensinar um cenário novo? (caso SIMULADO)\n\nResponda A ou B.`,
    shouldQualify: false,
    shouldSendToHuman: false,
  };
}
```

---

## 🚨 5. Detecção de ATENDIMENTO HUMANO

### 5.1. Atualizar `server/_core/index.ts`

No webhook GTI, adicione antes de processar mensagem:

```typescript
// Detectar solicitação de atendimento humano
if (
  messageText.toUpperCase().includes('ATENDIMENTO HUMANO') ||
  messageText.toUpperCase().includes('FALAR COM HUMANO')
) {
  // Notificar Dr. Juliano
  await sendWhatsAppMessage(
    '5544999869223',
    `🚨 ATENDIMENTO HUMANO SOLICITADO\n\nCliente: ${chatName}\nTelefone: ${phoneNumber}\n\nÚltima mensagem: ${messageText}`
  );
  
  // Responder ao cliente
  await sendWhatsAppMessage(
    phoneNumber,
    `✅ Entendi! Estou avisando o Dr. Juliano agora mesmo.\n\nEle vai entrar em contato com você o mais rápido possível. 📱`
  );
  
  return res.status(200).json({ success: true });
}
```

---

## 🔗 6. Rotas tRPC

### 6.1. Adicionar router de learnings em `server/routers.ts`

```typescript
import { z } from 'zod';
import {
  saveLearning,
  listLearnings,
  getPendingLearnings,
  approveLearning,
  rejectLearning,
  deactivateLearning,
  getDailyReport,
} from './services/ai-learning-service';

export const appRouter = router({
  // ... rotas existentes ...
  
  learnings: router({
    list: protectedProcedure
      .input(z.object({
        status: z.enum(['pending', 'approved', 'rejected', 'active', 'inactive']).optional(),
        type: z.enum(['REAL', 'SIMULATED']).optional(),
        keyword: z.string().optional(),
      }))
      .query(async ({ input }) => {
        return await listLearnings(input);
      }),
    
    pending: protectedProcedure.query(async () => {
      return await getPendingLearnings();
    }),
    
    save: protectedProcedure
      .input(z.object({
        type: z.enum(['REAL', 'SIMULATED']),
        context: z.string(),
        correctResponse: z.string(),
        whatToAvoid: z.string().optional(),
        keywords: z.array(z.string()),
        priority: z.number().min(1).max(10).default(5),
        originalPhoneNumber: z.string().optional(),
        originalLeadId: z.number().optional(),
        createdBy: z.string(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await saveLearning(input);
      }),
    
    approve: protectedProcedure
      .input(z.object({
        id: z.number(),
        approvedBy: z.string(),
      }))
      .mutation(async ({ input }) => {
        return await approveLearning(input.id, input.approvedBy);
      }),
    
    reject: protectedProcedure
      .input(z.object({
        id: z.number(),
        approvedBy: z.string(),
      }))
      .mutation(async ({ input }) => {
        return await rejectLearning(input.id, input.approvedBy);
      }),
    
    deactivate: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deactivateLearning(input.id);
      }),
    
    dailyReport: protectedProcedure.query(async () => {
      return await getDailyReport();
    }),
  }),
});
```

---

## ⚠️ 7. Aviso de IA em Desenvolvimento

### 7.1. Atualizar `server/services/human-touches.ts`

Adicione no início da primeira mensagem:

```typescript
export function getGreeting(clienteNome?: string | null, isFirstMessage: boolean = false): string {
  const hour = new Date().getHours();
  let greeting = '';
  
  if (hour >= 5 && hour < 12) greeting = 'Bom dia';
  else if (hour >= 12 && hour < 18) greeting = 'Boa tarde';
  else greeting = 'Boa noite';
  
  const name = clienteNome || 'você';
  
  if (isFirstMessage) {
    return `${greeting}! Sou a Jul.IA, assistente virtual do Dr. Juliano Garbuggio. 🤖\n\n⚠️ **Aviso:** Estou em fase de aprendizado! Posso cometer erros. Se preferir, escreva "ATENDIMENTO HUMANO" a qualquer momento.\n\nComo posso te ajudar hoje?`;
  }
  
  return `${greeting}, ${name}! Que bom te ver de novo! 😊`;
}
```

---

## ✅ 8. Checklist de Integração

- [ ] Tabela `ai_learning` criada no banco
- [ ] Arquivo `ai-learning-service.ts` copiado
- [ ] Integração no `ai-chatbot.ts` (busca de aprendizados)
- [ ] Detecção de comando de treinamento
- [ ] Detecção de ATENDIMENTO HUMANO
- [ ] Rotas tRPC adicionadas
- [ ] Aviso de IA em desenvolvimento
- [ ] Migração executada (`pnpm db:push`)
- [ ] Servidor reiniciado

---

## 🧪 9. Testes

Após integração, execute os testes em `EXEMPLOS_TESTE.md`.

---

## 📞 Suporte

Qualquer dúvida durante a integração, consulte os arquivos de exemplo ou a documentação completa.
