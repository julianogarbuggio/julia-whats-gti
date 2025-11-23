# 🤖 Prompt para ChatGPT - Integração dos Pacotes Jul.IA

## 📋 Contexto

Você receberá 2 arquivos ZIP com melhorias para o sistema Jul.IA (assistente de WhatsApp do Dr. Juliano Garbuggio):

- **Pacote 1:** Sistema de Treinamento (já implementado)
- **Pacote 2:** Detecção de Edifício Itápolis + Testes

Sua missão é integrar ambos os pacotes no projeto existente.

---

## 🎯 Objetivo

Integrar completamente os Pacotes 1 e 2 no projeto Jul.IA, garantindo:

1. ✅ Sistema de treinamento funcionando
2. ✅ Detecção automática de Edifício Itápolis
3. ✅ Testes automatizados passando
4. ✅ Código sem erros TypeScript
5. ✅ Relatório diário automático às 23h

---

## 📦 PACOTE 1 - Sistema de Treinamento

### Arquivos incluídos:

1. `drizzle/schema.ts` - Tabela `aiLearning`
2. `server/services/ai-learning-service.ts` - Funções de aprendizado
3. `server/routers/learnings.ts` - Rotas tRPC
4. Documentação completa

### Tarefas do Pacote 1:

#### 1. Garantir tabela `aiLearning` no schema

**Arquivo:** `drizzle/schema.ts`

Adicione (se não existir):

```typescript
export const aiLearning = mysqlTable("ai_learning", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").references(() => conversations.id),
  type: mysqlEnum("type", ["real", "simulated"]).notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  ativo: boolean("ativo").default(true).notNull(),
  context: text("context").notNull(),
  correctResponse: text("correctResponse").notNull(),
  incorrectResponse: text("incorrectResponse"),
  avoidResponse: text("avoidResponse"),
  notes: text("notes"),
  keywords: text("keywords"),
  category: varchar("category", { length: 100 }),
  priority: int("priority").default(5),
  usageCount: int("usageCount").default(0),
  lastAppliedAt: timestamp("lastAppliedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  trainedAt: timestamp("trainedAt").defaultNow().notNull(),
});
```

**Depois, rode a migração:**

```bash
pnpm db:push
```

---

#### 2. Substituir/mesclar `ai-learning-service.ts`

**Arquivo:** `server/services/ai-learning-service.ts`

Copie o arquivo do Pacote 1. Ele contém:

- `saveLearning()` - Salva novo aprendizado
- `getApprovedLearnings()` - Busca aprendizados aprovados com palavras-chave
- `incrementLearningUsage()` - Incrementa contador de uso

---

#### 3. Adicionar router `learnings`

**Arquivo:** `server/routers/learnings.ts`

Copie o arquivo do Pacote 1. Ele contém 7 rotas tRPC:

- `list` - Lista todos os aprendizados
- `pending` - Lista aprendizados pendentes
- `save` - Salva novo aprendizado
- `approve` - Aprova aprendizado
- `reject` - Rejeita aprendizado
- `deactivate` - Desativa aprendizado
- `dailyReport` - Gera relatório diário

**Depois, registre no `server/routers.ts`:**

```typescript
import { learningsRouter } from './routers/learnings';

export const appRouter = router({
  // ... outras rotas
  learnings: learningsRouter,
});
```

---

#### 4. (Opcional) Estender UI do `Treinamentos.tsx`

Se quiser interface web para gerenciar aprendizados:

**Arquivo:** `client/src/pages/Treinamentos.tsx`

⚠️ **ATENÇÃO:** Este arquivo tem erros TypeScript! Correções necessárias:

- Linha 379: `lastApplied` → `lastAppliedAt`
- Linha 389 e 398: Remover `approvedBy`
- Linha 407: `status === "active"` → `status === "approved"`

---

#### 5. Criar cron para relatório diário às 23h

Use o sistema de agendamento da Manus ou crie um cron job:

**Opção A: Usar `schedule` tool da Manus**

```typescript
// No seu código
schedule({
  type: "cron",
  cron: "0 0 23 * * *", // 23h todos os dias
  repeat: true,
  name: "Relatório Diário de Aprendizados",
  prompt: "Chamar trpc.learnings.dailyReport e enviar resultado para (44) 99986-9223"
});
```

**Opção B: Criar endpoint e usar cron externo**

```typescript
// server/routers.ts
export const appRouter = router({
  // ...
  cron: router({
    dailyReport: publicProcedure.mutation(async () => {
      const report = await trpc.learnings.dailyReport();
      // Enviar notificação
      await notifyOwner({
        title: "📊 Relatório Diário de Aprendizados",
        content: report
      });
      return { success: true };
    }),
  }),
});
```

---

## 📦 PACOTE 2 - Detecção de Itápolis + Testes

### Arquivos incluídos:

1. `server/services/ai-chatbot.ts` - Prompt atualizado
2. `server/tests/teste-itapolis.test.ts` - 8 testes automatizados
3. `client/src/pages/Treinamentos.tsx` - Dashboard (com erros)
4. Documentação completa

### Tarefas do Pacote 2:

#### 1. Atualizar prompt com detecção de Itápolis

**Arquivo:** `server/services/ai-chatbot.ts`

Localize o bloco `4️⃣ **EMPRÉSTIMO CONSIGNADO/RMC/RCC:**` e adicione DEPOIS dele:

```typescript
5️⃣ **EDIFÍCIO ITÁPOLIS (CONDOMÍNIO):**
   Palavras: itápolis, edifício itápolis, condomínio itápolis, síndico, prédio itápolis
   
   ✅ **RESPOSTA IMEDIATA:**
   "Oi! Vi que você mencionou o Edifício Itápolis. 🏢
   
   Aproveitando o contato: o escritório do Dr. Juliano Garbuggio atua em todas as áreas do Direito do Consumidor (empréstimos, cartões, negativação, problemas com empresas) e também em outras áreas do Direito.
   
   Se você precisar de alguma orientação jurídica, estou à disposição! 😊
   
   Mas se o seu caso for só sobre o condomínio Itápolis, me avise que eu já chamo ele pra te atender."
   
   ⚠️ **AGUARDAR RESPOSTA DO CLIENTE:**
   - Se cliente confirmar que é APENAS sobre condomínio → NOTIFICAR DR. JULIANO IMEDIATAMENTE
   - Se cliente mencionar outro assunto → continuar atendimento normal
```

---

#### 2. Adicionar testes automatizados

**Arquivo:** `server/tests/teste-itapolis.test.ts`

Copie o arquivo do Pacote 2 para `server/tests/`.

**Execute os testes:**

```bash
pnpm vitest run server/tests/teste-itapolis.test.ts
```

**Resultado esperado:** 8/8 testes passando ✅

---

## 🚀 Ordem de Execução Recomendada

### Passo 1: Integrar Pacote 1 (Sistema de Treinamento)

```bash
# 1. Adicionar tabela ao schema
# Editar drizzle/schema.ts

# 2. Rodar migração
pnpm db:push

# 3. Copiar arquivos do Pacote 1
cp pacote1-treinamento/server/services/ai-learning-service.ts server/services/
cp pacote1-treinamento/server/routers/learnings.ts server/routers/

# 4. Registrar router
# Editar server/routers.ts

# 5. Testar
pnpm dev
```

---

### Passo 2: Integrar Pacote 2 (Detecção de Itápolis)

```bash
# 1. Atualizar prompt
# Editar server/services/ai-chatbot.ts

# 2. Adicionar testes
mkdir -p server/tests
cp pacote2-mudancas-pos-pacote1/server/tests/teste-itapolis.test.ts server/tests/

# 3. Executar testes
pnpm vitest run server/tests/teste-itapolis.test.ts

# 4. Testar via WhatsApp
# Enviar mensagem: "Oi, sou moradora do Edifício Itápolis"
```

---

### Passo 3: Implementar Relatório Diário

**Opção mais simples: Usar tRPC mutation + cron externo**

```typescript
// server/routers/learnings.ts
dailyReport: protectedProcedure.mutation(async () => {
  const db = await getDb();
  if (!db) return { success: false, message: "Database not available" };
  
  // Buscar aprendizados do dia
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  
  const aprendizadosHoje = await db
    .select()
    .from(aiLearning)
    .where(
      and(
        gte(aiLearning.createdAt, hoje),
        eq(aiLearning.status, "pending")
      )
    );
  
  // Gerar relatório
  const relatorio = `📊 Relatório Diário de Aprendizados - ${new Date().toLocaleDateString('pt-BR')}
  
  📝 Novos aprendizados: ${aprendizadosHoje.length}
  ⏳ Aguardando aprovação: ${aprendizadosHoje.filter(a => a.status === "pending").length}
  ✅ Aprovados hoje: ${aprendizadosHoje.filter(a => a.status === "approved").length}
  ❌ Rejeitados hoje: ${aprendizadosHoje.filter(a => a.status === "rejected").length}
  
  Acesse o dashboard para revisar: https://seu-dominio.manus.space/treinamentos`;
  
  // Enviar notificação
  await notifyOwner({
    title: "📊 Relatório Diário de Aprendizados",
    content: relatorio
  });
  
  return { success: true, relatorio };
}),
```

**Agendar com cron (23h):**

Use o painel da Manus ou crie um webhook externo que chama essa mutation às 23h.

---

## ✅ Checklist Final

Após integrar tudo, valide:

### Sistema de Treinamento (Pacote 1)

- [ ] Tabela `aiLearning` existe no banco
- [ ] Arquivo `ai-learning-service.ts` copiado
- [ ] Arquivo `learnings.ts` (router) copiado
- [ ] Router registrado em `server/routers.ts`
- [ ] Comando `🔧 MODO TREINAMENTO ATIVADO` funciona via WhatsApp
- [ ] Fluxo REAL (corrigir erro) funciona
- [ ] Fluxo SIMULADO (novo cenário) funciona

### Detecção de Itápolis (Pacote 2)

- [ ] Prompt atualizado com bloco de Itápolis
- [ ] Testes copiados para `server/tests/`
- [ ] Testes executados: 8/8 passando
- [ ] Teste via WhatsApp: mensagem com "Itápolis" detectada
- [ ] Teste via WhatsApp: divulgação do escritório enviada
- [ ] Teste via WhatsApp: pergunta sobre condomínio enviada
- [ ] Teste via WhatsApp: confirmação gera notificação

### Relatório Diário

- [ ] Mutation `dailyReport` implementada
- [ ] Cron configurado para 23h
- [ ] Notificação para (44) 99986-9223 funciona

---

## 🐛 Problemas Conhecidos

### 1. Erros TypeScript em `Treinamentos.tsx`

**Correções necessárias:**

```typescript
// Linha 379: Substituir
learning.lastApplied
// Por
learning.lastAppliedAt

// Linhas 389 e 398: Remover
approvedBy: ctx.user.id

// Linha 407: Substituir
status === "active"
// Por
status === "approved"
```

---

### 2. Tabela `aiLearning` não existe

**Solução:**

```bash
# Verificar se schema foi atualizado
grep -n "aiLearning" drizzle/schema.ts

# Rodar migração
pnpm db:push
```

---

### 3. Testes não executam

**Solução:**

```bash
# Instalar dependências
pnpm install

# Executar testes
pnpm vitest run server/tests/teste-itapolis.test.ts
```

---

## 📞 Próximos Passos

Após integrar os pacotes:

1. **Testar em produção** via WhatsApp
2. **Monitorar notificações** de Itápolis
3. **Revisar aprendizados** no dashboard
4. **Validar relatório diário** às 23h

---

## 🎯 Prompt Resumido para ChatGPT

```
Olá ChatGPT! Preciso que você integre 2 pacotes ZIP no projeto Jul.IA (assistente de WhatsApp).

PACOTE 1 - Sistema de Treinamento:
1. Adicionar tabela aiLearning no drizzle/schema.ts
2. Copiar ai-learning-service.ts
3. Copiar learnings.ts (router)
4. Registrar router em server/routers.ts
5. Rodar: pnpm db:push

PACOTE 2 - Detecção de Itápolis:
1. Atualizar server/services/ai-chatbot.ts com bloco de detecção de Itápolis
2. Copiar teste-itapolis.test.ts para server/tests/
3. Executar testes: pnpm vitest run server/tests/teste-itapolis.test.ts

RELATÓRIO DIÁRIO:
1. Implementar mutation dailyReport em learnings.ts
2. Configurar cron para 23h chamando essa mutation
3. Notificar (44) 99986-9223 com resumo do dia

CORREÇÕES:
- Em Treinamentos.tsx: lastApplied → lastAppliedAt, remover approvedBy, status "active" → "approved"

Siga a ordem: Pacote 1 → Pacote 2 → Relatório → Testes.

Confirme cada etapa antes de prosseguir!
```

---

**Desenvolvido por:** Manus AI  
**Data:** 23/11/2025  
**Versão:** Pacotes 1 + 2 Integrados
