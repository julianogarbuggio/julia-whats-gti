# 🤖 Prompt para ChatGPT - Integração Jul.IA (Atualizado)

## 📦 O que você vai receber:

Vou te enviar um ZIP com **todas as mudanças** feitas no projeto Jul.IA após o último pacote. Preciso que você integre tudo no projeto existente.

---

## ✅ O que foi implementado (resumo):

### 1. **Lógica de Resposta Manus** (IA melhorada)
- 7 princípios de estruturação de resposta
- Analogias simples para juridiquês
- Antecipação de dúvidas
- Emojis estratégicos
- Exemplos práticos
- Confirmação de entendimento
- Resumo de próximos passos

### 2. **Detecção de Edifício Itápolis**
- Reconhecimento automático de 11 variações
- Divulgação do escritório
- Pergunta se é só sobre condomínio
- Notificação para (44) 99986-9223
- 8 testes automatizados (100% passando)

### 3. **Consulta de Andamento Processual via DataJud**
- Pede: nome + CPF + número do processo
- **Com número:** consulta direta
- **Sem número:** lista múltiplos processos e pergunta qual é
- **Não encontrou:** chama advogado imediatamente

### 4. **Relatório Diário Automático**
- Agendado para 23h (GMT-3)
- Envia resumo de aprendizados via WhatsApp
- Botão de teste manual no dashboard

### 5. **Filtros Avançados na Página Treinamentos**
- Filtro por data de criação (range)
- Filtro por prioridade (mín/máx)
- Filtro por número de aplicações
- Ordenação por data/prioridade/aplicações
- Botão limpar filtros

### 6. **Correções TypeScript**
- Página Treinamentos: 0 erros
- Correções em lastApplied, approvedBy, status

---

## 📋 Instruções de Integração:

### **Passo 1: Backup**
```bash
# Faça backup do projeto atual
git add .
git commit -m "Backup antes de integrar mudanças Manus"
```

### **Passo 2: Extrair ZIP**
Extraia o ZIP que vou te enviar. Você encontrará:
- `server/services/ai-chatbot.ts` (prompt melhorado)
- `server/teste-itapolis.test.ts` (testes)
- `client/src/pages/Home.tsx` (botão relatório)
- `client/src/pages/Treinamentos.tsx` (filtros avançados)
- `INSTRUCOES_DETALHADAS.md` (este arquivo)

### **Passo 3: Aplicar Mudanças**

#### **3.1. Atualizar Prompt da IA**
```bash
# Substituir arquivo
cp server/services/ai-chatbot.ts /caminho/do/projeto/server/services/
```

**O que mudou:**
- Adicionados 7 princípios de estruturação Manus
- Detecção de Edifício Itápolis
- Lógica de consulta processual DataJud

#### **3.2. Adicionar Testes**
```bash
# Copiar arquivo de testes
cp server/teste-itapolis.test.ts /caminho/do/projeto/server/
```

**Executar testes:**
```bash
cd /caminho/do/projeto
pnpm vitest run server/teste-itapolis.test.ts
```

**Resultado esperado:** 8/8 testes passando

#### **3.3. Atualizar Dashboard (Home.tsx)**
```bash
# Substituir arquivo
cp client/src/pages/Home.tsx /caminho/do/projeto/client/src/pages/
```

**O que mudou:**
- Adicionado botão "Gerar Relatório Diário (Teste)"
- Importado ícone `FileBarChart` do lucide-react

#### **3.4. Atualizar Página Treinamentos**
```bash
# Substituir arquivo
cp client/src/pages/Treinamentos.tsx /caminho/do/projeto/client/src/pages/
```

**O que mudou:**
- 8 novos filtros avançados
- Lógica de ordenação
- Botão limpar filtros
- Correções TypeScript (0 erros)

#### **3.5. Adicionar Treinamentos no Banco**

Execute este SQL no banco de dados:

```sql
-- Treinamento: Detecção de Edifício Itápolis
INSERT INTO ai_learning (
  type, context, correct_response, avoid_response, keywords,
  priority, notes, trained_by, status, ativo, created_at, updated_at
) VALUES (
  'simulated',
  'Cliente mencionando Edifício Itápolis ou condomínio',
  'Oi! Vi que você mencionou o Edifício Itápolis. 🏢

Aproveitando o contato: o escritório do Dr. Juliano Garbuggio atua em todas as áreas do Direito do Consumidor (empréstimos, cartões, negativação, problemas com empresas) e também em outras áreas do Direito.

Se você precisar de alguma orientação jurídica, estou à disposição! 😊

Mas se o seu caso for só sobre o condomínio Itápolis, me avise que eu já chamo ele pra te atender.',
  'NUNCA: Ignorar menção ao Itápolis, pular divulgação do escritório, não perguntar se é só sobre condomínio',
  '["itápolis", "edifício itápolis", "condomínio itápolis", "síndico", "prédio itápolis", "condominio", "edificio"]',
  10,
  'Detectar automaticamente menções ao Edifício Itápolis. Dr. Juliano é síndico. Se caso for APENAS sobre condomínio, notificar (44) 99986-9223.',
  '5544999869223',
  'approved',
  1,
  NOW(),
  NOW()
);

-- Treinamento: Consulta de Andamento Processual
INSERT INTO ai_learning (
  type, context, correct_response, avoid_response, keywords,
  priority, notes, trained_by, status, ativo, created_at, updated_at
) VALUES (
  'simulated',
  'Cliente perguntando sobre andamento de processo',
  'Quando cliente perguntar sobre andamento processual:

1️⃣ Pedir NOME COMPLETO
2️⃣ Pedir CPF (formato: 123.456.789-00)
3️⃣ Pedir NÚMERO DO PROCESSO

LÓGICA DE CONSULTA:

📌 SE TIVER NÚMERO DO PROCESSO:
- Consultar diretamente no DataJud
- Mostrar resultado único
- Pronto!

📌 SE NÃO TIVER NÚMERO (só nome + CPF):
- Consultar por nome/CPF no DataJud
- ATENÇÃO: Podem aparecer VÁRIOS processos
- Listar todos os processos encontrados
- Perguntar: "Qual desses processos é do Dr. Juliano que você quer saber?"
- Cliente escolhe → mostrar detalhes

📌 SE NÃO ENCONTRAR NADA:
- Chamar advogado IMEDIATAMENTE
- Notificar (44) 99986-9223
- Mensagem: "Não encontrei seu processo no sistema. Vou chamar o Dr. Juliano para te ajudar!"

Exemplo de resposta quando encontrar múltiplos:
"Encontrei 3 processos com seus dados:

1️⃣ Processo 0001234-56.2023.8.16.0001 - Ação de Cobrança
2️⃣ Processo 0007890-12.2024.8.16.0002 - Revisional de Contrato
3️⃣ Processo 0003456-78.2024.8.16.0003 - Indenização

Qual desses é o processo do Dr. Juliano que você quer saber?"',
  'NUNCA: Inventar andamento, prometer vitória, dar consulta sem pedir dados, questionar ano antes de consultar',
  '["andamento", "processo", "ação", "consultar processo", "como está meu processo", "movimentação processual", "tribunal"]',
  9,
  'Integração DataJud já implementada. Sistema consulta automaticamente quando detecta número CNJ. Fallback para instruções manuais se API falhar.',
  '5544999869223',
  'approved',
  1,
  NOW(),
  NOW()
);
```

#### **3.6. Configurar Agendamento do Relatório**

O relatório diário já está agendado no sistema Manus para rodar às 23h (GMT-3).

**Verificar agendamento:**
- Nome: `relatorio_diario_jul_ia`
- Cron: `0 0 23 * * *`
- Função: `generateDailyLearningReport()`

**Testar manualmente:**
- Acesse o dashboard
- Clique em "Gerar Relatório Diário (Teste)"
- Confirme o popup
- Verifique WhatsApp (44) 99986-9223

---

## 🧪 Testes de Validação:

### **1. Testar Detecção de Itápolis**
```bash
pnpm vitest run server/teste-itapolis.test.ts
```
**Esperado:** 8/8 testes passando

### **2. Testar Filtros Avançados**
- Acesse `/treinamentos`
- Teste cada filtro (data, prioridade, aplicações)
- Teste ordenação
- Teste botão "Limpar Filtros"

### **3. Testar Relatório Diário**
- Acesse dashboard (`/`)
- Clique em "Gerar Relatório Diário (Teste)"
- Confirme
- Verifique WhatsApp

### **4. Testar Consulta Processual**
- Envie mensagem via WhatsApp: "Quero saber andamento do meu processo"
- Jul.IA deve pedir: nome + CPF + número
- Teste com e sem número do processo

---

## 📊 Resultado Esperado:

✅ Prompt da IA melhorado (7 princípios Manus)  
✅ Detecção de Itápolis funcionando  
✅ Consulta processual DataJud funcionando  
✅ Relatório diário agendado (23h)  
✅ Filtros avançados na página Treinamentos  
✅ 0 erros TypeScript em Treinamentos.tsx  
✅ 8/8 testes passando  

---

## ⚠️ Problemas Conhecidos:

**1. Training.tsx (não Treinamentos.tsx)**
- 10 erros TypeScript relacionados a `any` em parâmetros de log
- **Não afeta funcionalidade**
- Pode ser ignorado ou corrigido depois

**2. Dependências**
- Recharts instalado para futuros gráficos
- Warnings de peer dependencies podem ser ignorados

---

## 🆘 Se algo der errado:

1. **Erro ao executar testes:**
```bash
# Instalar dependências
pnpm install
```

2. **Erro no banco de dados:**
```bash
# Rodar migração
pnpm db:push
```

3. **Erro no frontend:**
```bash
# Limpar cache e reconstruir
rm -rf node_modules/.vite
pnpm dev
```

4. **Erro no agendamento:**
- Verifique se o sistema Manus está ativo
- Teste manualmente pelo botão no dashboard

---

## 📞 Contato:

Se tiver dúvidas ou problemas, me avise!

**Próximos passos sugeridos:**
1. Criar página de estatísticas com gráficos
2. Adicionar mais treinamentos específicos
3. Melhorar UI/UX da página Treinamentos

---

**Versão:** 23/11/2025 - 16:45  
**Checkpoint:** 4d268c46  
**Status:** Pronto para integração
