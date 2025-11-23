# 🤝 HANDOFF - Transferência de Projeto para ChatGPT

**Data**: 23 de novembro de 2025  
**Projeto**: Jul.IA - Assistente Inteligente de WhatsApp  
**Cliente**: Dr. Juliano Garbuggio  
**Desenvolvedor Anterior**: Manus AI  
**Novo Desenvolvedor**: ChatGPT

---

## 📋 CONTEXTO DO PROJETO

### O que é Jul.IA?

Jul.IA é uma assistente virtual avançada que automatiza o atendimento jurídico via WhatsApp do Dr. Juliano Garbuggio, especialista em Direito do Consumidor (empréstimos consignados, RMC, RCC).

### Objetivo Principal

Qualificar leads, coletar informações, consultar processos e encaminhar para o advogado no momento certo, mantendo um tom coloquial, empático e próximo (como se fosse o próprio Dr. Juliano conversando).

### Diferenciais

- ✅ **Aprendizado Contínuo**: A IA aprende com cada conversa
- ✅ **Consulta Automática de Processos**: Integração com DataJud CNJ
- ✅ **Tom Humanizado**: Fala como o Dr. Juliano (coloquial, empático)
- ✅ **Gestão Inteligente**: Qualifica leads automaticamente
- ✅ **Segurança Jurídica**: Filtros para evitar consultas indevidas

---

## 🏗️ ARQUITETURA TÉCNICA

### Stack

**Backend:**
- Node.js 22.x + TypeScript
- Express 4.x
- tRPC 11.x (type-safe API)
- Drizzle ORM
- MySQL/TiDB

**Frontend:**
- React 19.x
- Vite 6.x
- Tailwind CSS 4.x
- shadcn/ui

**IA:**
- OpenAI GPT-4
- Sistema de aprendizado customizado

**Integrações:**
- **GTI-API**: WhatsApp Business API (principal)
- **Z-API**: WhatsApp Business API (backup)
- **DataJud CNJ**: Consulta de processos judiciais
- **ZapSign**: Assinatura digital

### Fluxo de Funcionamento

```
Cliente (WhatsApp)
    ↓
GTI-API (webhook)
    ↓
/api/webhook/gti (server/_core/index.ts)
    ↓
conversation-flow.ts (processMessage)
    ↓
ai-chatbot.ts (generateResponse)
    ↓
OpenAI GPT-4
    ↓
Filtros de segurança
    ↓
Resposta enviada via GTI-API
```

### Arquivos Principais

```
server/
├── _core/
│   ├── index.ts          # Servidor Express + webhooks
│   ├── trpc.ts           # Configuração tRPC
│   └── llm.ts            # Cliente OpenAI
├── services/
│   ├── ai-chatbot.ts     # IA conversacional (PROMPT PRINCIPAL)
│   ├── conversation-flow.ts  # Fluxo de conversa
│   ├── gti-api.ts        # Integração GTI-API
│   ├── zapi.ts           # Integração Z-API
│   ├── datajud-cnj-integration.ts  # Consulta processos
│   └── andamento-processual-service.ts  # Lógica de consulta
├── db.ts                 # Queries do banco
└── routers.ts            # Rotas tRPC

drizzle/
└── schema.ts             # Schema do banco de dados

client/
└── src/
    ├── pages/            # Páginas React
    └── components/       # Componentes
```

---

## ✅ FUNCIONALIDADES IMPLEMENTADAS

### 1. Conversação Inteligente
- ✅ Tom coloquial e empático (como Dr. Juliano)
- ✅ Qualificação automática de leads
- ✅ Detecção de golpes (alertas automáticos)
- ✅ Encaminhamento inteligente para humano
- ✅ Memória de contexto (histórico de conversa)

### 2. Consulta de Processos
- ✅ Integração com DataJud CNJ (TJSP, TJPR, TJMG)
- ✅ Extração automática de número CNJ
- ✅ Consulta automática quando cliente envia número
- ✅ Instruções de consulta manual (se não encontrar)

### 3. Gestão de Leads
- ✅ Cadastro automático de leads
- ✅ Histórico de conversas
- ✅ Categorização por tipo de caso
- ✅ Dashboard web (React)

### 4. Notificações
- ✅ Resumos de atendimento (enviados para Dr. Juliano)
- ✅ Alertas de urgência (cliente cobrando andamento)
- ✅ Telefone clicável nos resumos (wa.me)

### 5. Segurança Jurídica
- ✅ Filtros anti-consulta jurídica
- ✅ Disclaimers automáticos
- ✅ Validação de respostas

---

## 🐛 BUGS CONHECIDOS E CORREÇÕES RECENTES

### ✅ CORRIGIDO: Telefone não clicável nos resumos
**Problema**: Telefone aparecia como texto simples, não abria WhatsApp  
**Solução**: Alterado para formato `https://wa.me/5544999869223`  
**Arquivos**: `conversation-summary.ts`, `human-handoff-notification.ts`

### ✅ CORRIGIDO: IA questionando ano 2025
**Problema**: IA dizia "ano 2025 ainda não chegou" em vez de consultar  
**Solução**: Reforçado no prompt para SEMPRE tentar consultar primeiro  
**Arquivo**: `ai-chatbot.ts` (linhas 421-437)

### ✅ CORRIGIDO: IA rejeitando mensagens pessoais
**Problema**: Clínica mandou mensagem e IA disse "número errado"  
**Solução**: Agora pergunta "Você quer falar com Dr. Juliano sobre assunto pessoal?" antes de rejeitar  
**Arquivo**: `ai-chatbot.ts` (linhas 339-357)

### ✅ IMPLEMENTADO: Telefone de treinamento
**Funcionalidade**: (44) 99986-9223 = telefone do Dr. Juliano para testes  
**Comportamento**: IA responde normalmente mas sabe que é treinamento  
**Arquivo**: `ai-chatbot.ts` (linhas 359-372)

### ⚠️ PENDENTE: Instância GTI-API offline
**Problema**: Instância `69205AC00B88` retorna 404 (não existe)  
**Causa**: Instância foi deletada/desativada ou ID incorreto  
**Solução Necessária**: Verificar ID correto no painel GTI-API  
**Impacto**: Jul.IA não recebe/envia mensagens até resolver

### ⚠️ PENDENTE: API DataJud no Railway offline
**Problema**: URL `https://julia-datajud-production.up.railway.app` retorna 404  
**Causa**: Projeto no Railway foi deletado ou está pausado  
**Solução Necessária**: Reativar projeto ou criar novo  
**Impacto**: Consulta de processos não funciona

---

## 🚀 DEPLOY NO RAILWAY - PASSO A PASSO

### Pré-requisitos

1. Conta no Railway (railway.app)
2. Repositório no GitHub com o código
3. Todas as credenciais (OpenAI, GTI-API, etc)

### Passo 1: Preparar Repositório

```bash
# 1. Inicializar Git (se ainda não tiver)
git init

# 2. Adicionar todos os arquivos
git add .

# 3. Commit
git commit -m "Initial commit - Jul.IA WhatsApp Assistant"

# 4. Criar repositório no GitHub
# (via interface web do GitHub)

# 5. Adicionar remote
git remote add origin https://github.com/seu-usuario/julia-whatsapp-assistant.git

# 6. Push
git push -u origin main
```

### Passo 2: Criar Projeto no Railway

1. Acesse https://railway.app
2. Clique em "New Project"
3. Escolha "Deploy from GitHub repo"
4. Selecione `julia-whatsapp-assistant`
5. Railway detectará automaticamente Node.js

### Passo 3: Adicionar Banco de Dados

1. No projeto Railway, clique em "New" → "Database" → "MySQL"
2. Aguarde provisionar
3. Copie a `DATABASE_URL` gerada
4. Cole em "Variables" do seu serviço principal

### Passo 4: Configurar Variáveis de Ambiente

No painel "Variables" do Railway, adicione:

```env
# Obrigatórias
DATABASE_URL=<copiado do MySQL do Railway>
OPENAI_API_KEY=sk-proj-...
GTI_BASE_URL=https://apivip.gti-api.com
GTI_INSTANCE_ID=<verificar no painel GTI>
GTI_API_KEY=<verificar no painel GTI>

# Opcionais
ZAPI_BASE_URL=https://api.z-api.io
ZAPI_INSTANCE_ID=...
ZAPI_TOKEN=...
ZAPI_CLIENT_TOKEN=...
ZAPSIGN_BASE_URL=https://api.zapsign.com.br
ZAPSIGN_API_TOKEN=...

# Sistema
OWNER_NAME="Dr. Juliano Garbuggio"
JWT_SECRET=<gerar com: openssl rand -base64 32>
VITE_APP_TITLE="Jul.IA - Assistente de WhatsApp"
```

### Passo 5: Deploy

1. Railway fará deploy automaticamente
2. Aguarde build completar (3-5 minutos)
3. Acesse a URL gerada (ex: `https://julia-whatsapp-assistant-production.up.railway.app`)

### Passo 6: Configurar Webhooks

**GTI-API:**
1. Acesse painel GTI-API
2. Vá em "Webhooks"
3. Configure URL: `https://sua-url.railway.app/api/webhook/gti`
4. Eventos: `messages.upsert`, `messages.update`

**Z-API (backup):**
1. Acesse painel Z-API
2. Vá em "Webhooks"
3. Configure URL: `https://sua-url.railway.app/api/webhook/zapi`

### Passo 7: Testar

Envie mensagem para o WhatsApp da Jul.IA: **(11) 95675-9223**

---

## 🛠️ COMANDOS ÚTEIS

### Desenvolvimento Local

```bash
# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Iniciar produção
pnpm start

# Atualizar schema do banco
pnpm db:push

# Gerar migrations
pnpm db:generate
```

### Git

```bash
# Status
git status

# Adicionar alterações
git add .

# Commit
git commit -m "Descrição da mudança"

# Push
git push origin main

# Pull
git pull origin main
```

### Railway CLI

```bash
# Instalar CLI
npm install -g @railway/cli

# Login
railway login

# Link projeto
railway link

# Ver logs
railway logs

# Abrir dashboard
railway open
```

---

## 📝 PROMPTS PRONTOS PARA CHATGPT

### Deploy no Railway

```
ChatGPT, preciso fazer deploy da Jul.IA no Railway.

Contexto: Leia o arquivo HANDOFF.md para entender o projeto.

Tarefa:
1. Verificar se todos os arquivos necessários estão prontos
2. Criar railway.json se necessário
3. Me guiar passo a passo no deploy
4. Configurar variáveis de ambiente
5. Configurar webhooks
6. Testar se está funcionando

Use as instruções da seção "DEPLOY NO RAILWAY" do HANDOFF.md
```

### Corrigir Bug

```
ChatGPT, encontrei um bug na Jul.IA.

Contexto: Leia o arquivo HANDOFF.md para entender o projeto.

Bug: [descreva o problema]

Tarefa:
1. Identificar a causa raiz
2. Propor solução
3. Implementar correção
4. Testar
5. Fazer commit e push

Arquivos principais: server/services/ai-chatbot.ts, server/services/conversation-flow.ts
```

### Adicionar Feature

```
ChatGPT, preciso adicionar uma nova funcionalidade na Jul.IA.

Contexto: Leia o arquivo HANDOFF.md para entender o projeto.

Feature: [descreva a funcionalidade]

Tarefa:
1. Analisar impacto no código existente
2. Propor arquitetura
3. Implementar
4. Atualizar documentação
5. Testar
6. Fazer commit e push

Siga os padrões de código existentes no projeto.
```

### Atualizar Prompt da IA

```
ChatGPT, preciso ajustar o comportamento da Jul.IA.

Contexto: Leia o arquivo HANDOFF.md e server/services/ai-chatbot.ts

Mudança desejada: [descreva o comportamento]

Tarefa:
1. Localizar seção relevante do prompt (linhas 225-482 de ai-chatbot.ts)
2. Propor alteração
3. Implementar
4. Reiniciar servidor
5. Testar com exemplos
6. Fazer commit e push

IMPORTANTE: Mantenha o tom coloquial e empático do Dr. Juliano!
```

---

## ⚠️ AVISOS IMPORTANTES

### 1. Variáveis de Ambiente

**NUNCA commite `.env` no Git!**

Sempre use `.env.example` como template e configure variáveis no Railway.

### 2. Prompt da IA

O arquivo `server/services/ai-chatbot.ts` contém o **PROMPT PRINCIPAL** da Jul.IA (linhas 225-482).

**Cuidados ao editar:**
- ✅ Mantenha o tom coloquial e empático
- ✅ Preserve regras de segurança jurídica
- ✅ Teste extensivamente após mudanças
- ❌ Não remova filtros de segurança
- ❌ Não prometa vitórias ou resultados

### 3. Webhooks

Se mudar a URL do servidor (ex: novo deploy no Railway), **SEMPRE atualize os webhooks** no GTI-API e Z-API!

### 4. Banco de Dados

**SEMPRE faça backup antes de rodar migrations!**

```bash
# Gerar migration
pnpm db:generate

# Aplicar (CUIDADO!)
pnpm db:push
```

### 5. Telefone de Treinamento

**(44) 99986-9223** é o telefone do Dr. Juliano para testes.

A IA sabe disso e responde normalmente, mas registra como treinamento.

### 6. Instância GTI-API

**PROBLEMA ATUAL**: Instância `69205AC00B88` não existe!

**ANTES de fazer deploy**, verificar ID correto no painel GTI-API.

---

## 📞 CONTATOS

**Cliente**: Dr. Juliano Garbuggio  
**WhatsApp**: (11) 95675-9223  
**WhatsApp Pessoal**: (44) 99986-9223

**Desenvolvedor Anterior**: Manus AI  
**Novo Desenvolvedor**: ChatGPT (você!)

---

## 🎯 PRÓXIMOS PASSOS

### Urgente (Fazer Primeiro)

1. ✅ **Verificar instância GTI-API** (ID correto)
2. ✅ **Fazer deploy no Railway**
3. ✅ **Configurar webhooks**
4. ✅ **Testar envio/recebimento de mensagens**

### Importante (Fazer Depois)

5. ⚠️ **Reativar API DataJud** (consulta de processos)
6. ⚠️ **Implementar relatório diário de aprendizado**
7. ⚠️ **Criar página de Integrações no dashboard**

### Nice to Have (Backlog)

8. 📊 Dashboard de analytics avançado
9. 🎙️ Suporte a áudio (transcrição automática)
10. 📱 Integração com mais tribunais

---

## 📚 DOCUMENTAÇÃO ADICIONAL

- **README.md**: Visão geral do projeto
- **DEPLOY.md**: Guia detalhado de deploy (será criado)
- **todo.md**: Lista de tarefas e bugs

---

## ✅ CHECKLIST DE TRANSFERÊNCIA

- [x] Código completo no repositório
- [x] README.md criado
- [x] HANDOFF.md criado
- [ ] DEPLOY.md criado
- [ ] railway.json criado
- [ ] .gitignore configurado
- [ ] Deploy no Railway testado
- [ ] Webhooks configurados
- [ ] Jul.IA respondendo mensagens

---

**BOA SORTE, CHATGPT! 🚀**

**Qualquer dúvida, consulte este documento ou pergunte ao Dr. Juliano.**

---

_Documento criado em: 23/11/2025_  
_Última atualização: 23/11/2025_  
_Versão: 1.0_
