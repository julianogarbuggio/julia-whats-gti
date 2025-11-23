# 🎓 Dashboard de Treinamento da Jul.IA

## 📋 O que é?

O Dashboard de Treinamento permite revisar e corrigir os aprendizados, falhas e dúvidas detectados automaticamente pela Jul.IA.

**Funcionalidades:**
- ✅ Ver aprendizados pendentes de aprovação
- ❌ Revisar falhas e aplicar correções
- ❓ Responder dúvidas da IA
- 📊 Estatísticas de evolução
- 📝 Adicionar notas e observações

---

## 🚀 Como Ativar

O código do dashboard já está pronto, mas **não está ativado** para não interferir no deploy inicial.

### Passo 1: Descomentar Rotas de API

Edite `server/routers.ts` e adicione:

```typescript
import { z } from "zod";
import {
  getPendingLearningLogs,
  approveLearningLog,
  rejectLearningLog,
  correctLearningLog,
  getTrainingStats,
} from "./services/training-dashboard-service";

// Adicionar ao appRouter:
export const appRouter = router({
  // ... rotas existentes ...
  
  // DESCOMENTAR ESTA SEÇÃO:
  training: router({
    // Buscar logs pendentes
    getPendingLogs: protectedProcedure.query(async () => {
      return await getPendingLearningLogs();
    }),

    // Aprovar aprendizado
    approveLog: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await approveLearningLog(input.id);
      }),

    // Rejeitar item
    rejectLog: protectedProcedure
      .input(z.object({ 
        id: z.number(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await rejectLearningLog(input.id, input.notes);
      }),

    // Aplicar correção
    correctLog: protectedProcedure
      .input(z.object({
        id: z.number(),
        correction: z.string(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await correctLearningLog(input.id, input.correction, input.notes);
      }),

    // Estatísticas
    getStats: protectedProcedure.query(async () => {
      return await getTrainingStats();
    }),
  }),
});
```

### Passo 2: Adicionar Rota no Frontend

Edite `client/src/App.tsx` e adicione:

```typescript
import Training from "./pages/Training";

// Adicionar dentro de <Switch>:
<Route path="/training" component={Training} />
```

### Passo 3: Adicionar Link no Menu

Se você tiver um menu/sidebar, adicione:

```tsx
<Link href="/training">
  🎓 Treinamento
</Link>
```

### Passo 4: Testar

1. Reinicie o servidor: `pnpm dev`
2. Acesse: `http://localhost:3000/training`
3. Você verá os aprendizados/falhas detectados automaticamente

---

## 📊 Como Funciona

### Detecção Automática

A cada conversa, a IA analisa:
- ✅ **Aprendizados**: Novos padrões, casos bem resolvidos
- ❌ **Falhas**: Respostas inadequadas, erros
- ❓ **Dúvidas**: Situações que não soube lidar

Tudo é salvo automaticamente no banco (`learning_logs` table).

### Relatório Diário

**Todos os dias às 23h**, você recebe via WhatsApp:
- Top 5 aprendizados
- Top 5 falhas
- Top 5 dúvidas
- Plano de crescimento

### Dashboard Interativo

No dashboard você pode:
1. **Aprovar** aprendizados corretos
2. **Rejeitar** itens incorretos
3. **Corrigir** falhas (ensinar resposta certa)
4. **Adicionar notas** para contexto

---

## 🎯 Fluxo de Treinamento Recomendado

**Diário (23h):**
1. Receber relatório via WhatsApp
2. Identificar itens críticos

**Semanal:**
1. Acessar dashboard
2. Revisar todos os itens pendentes
3. Aprovar/corrigir em lote

**Mensal:**
1. Ver estatísticas de evolução
2. Identificar padrões de falhas
3. Ajustar prompts/conhecimento

---

## 🔧 Personalização

### Alterar Horário do Relatório

Edite `server/services/scheduler.ts`:

```typescript
// Mudar de 23h para outro horário
cron.schedule('0 21 * * *', async () => { // 21h
  await sendDailyReport();
});
```

### Adicionar Categorias

Edite `server/services/learning-detection.ts` e adicione categorias personalizadas.

### Integrar com Conhecimento da IA

Quando você corrige uma falha, pode automaticamente atualizar o prompt da IA:

```typescript
// Em training-dashboard-service.ts
export async function correctLearningLog(id, correction, notes) {
  // ... código existente ...
  
  // Adicionar ao conhecimento da IA
  await updateAIKnowledge({
    category: log.category,
    correctResponse: correction,
    context: log.userMessage,
  });
}
```

---

## 📝 Comandos Úteis para ChatGPT

Quando for pedir ao ChatGPT para ativar o dashboard:

```
ChatGPT, ative o Dashboard de Treinamento da Jul.IA seguindo as instruções em TRAINING-DASHBOARD.md
```

Ou para fazer ajustes:

```
ChatGPT, adicione uma nova categoria de aprendizado chamada "negociação" no sistema de treinamento
```

---

## ⚠️ Avisos Importantes

1. **Autenticação**: O dashboard usa `protectedProcedure`, então só quem estiver logado pode acessar
2. **Performance**: Com muitos logs, pode ficar lento. Considere paginação
3. **Backup**: Logs são salvos no banco, faça backup regularmente

---

## 🎓 Próximos Passos

Após ativar o dashboard, você pode:

1. **Adicionar filtros** (por data, categoria, tipo)
2. **Implementar busca** para encontrar logs específicos
3. **Criar gráficos** de evolução ao longo do tempo
4. **Exportar relatórios** em PDF/Excel
5. **Notificações** quando falhas críticas forem detectadas

---

**Dúvidas?** Consulte HANDOFF.md para contexto completo do projeto.
