# 🚀 Guia Completo de Deploy - Jul.IA

Este guia detalha o processo completo de deploy da Jul.IA no Railway, desde a preparação do código até os testes finais.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter:

- [ ] Conta no GitHub
- [ ] Conta no Railway (railway.app)
- [ ] Credenciais OpenAI (API Key)
- [ ] Credenciais GTI-API (Instance ID + API Key)
- [ ] (Opcional) Credenciais Z-API
- [ ] (Opcional) Credenciais ZapSign
- [ ] Git instalado localmente

---

## 🎯 PARTE 1: Preparar Código para GitHub

### Passo 1: Verificar .gitignore

Certifique-se de que o arquivo `.gitignore` contém:

```gitignore
# Dependencies
node_modules/
.pnpm-store/

# Environment
.env
.env.local
.env.*.local

# Build
dist/
build/
.vite/

# Logs
*.log
npm-debug.log*
pnpm-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Temp
tmp/
temp/
*.tmp

# Database
*.db
*.sqlite

# Uploads
uploads/
```

### Passo 2: Criar Repositório no GitHub

1. Acesse https://github.com
2. Clique em "New repository"
3. Nome: `julia-whatsapp-assistant`
4. Descrição: "Jul.IA - Assistente Inteligente de WhatsApp para Advocacia"
5. Visibilidade: **Private** (recomendado)
6. **NÃO** inicialize com README (já temos)
7. Clique em "Create repository"

### Passo 3: Fazer Push para GitHub

```bash
# 1. Inicializar Git (se ainda não tiver)
cd /caminho/para/julia-whatsapp-assistant
git init

# 2. Adicionar remote do GitHub
git remote add origin https://github.com/SEU-USUARIO/julia-whatsapp-assistant.git

# 3. Adicionar todos os arquivos
git add .

# 4. Fazer commit inicial
git commit -m "Initial commit - Jul.IA WhatsApp Assistant"

# 5. Renomear branch para main (se necessário)
git branch -M main

# 6. Push para GitHub
git push -u origin main
```

### Passo 4: Verificar no GitHub

Acesse `https://github.com/SEU-USUARIO/julia-whatsapp-assistant` e confirme que todos os arquivos foram enviados.

**⚠️ IMPORTANTE**: Verifique se o arquivo `.env` **NÃO** está no repositório!

---

## 🚂 PARTE 2: Deploy no Railway

### Passo 1: Criar Projeto

1. Acesse https://railway.app
2. Faça login (pode usar GitHub)
3. Clique em "New Project"
4. Escolha "Deploy from GitHub repo"
5. Autorize acesso ao GitHub (se solicitado)
6. Selecione o repositório `julia-whatsapp-assistant`
7. Clique em "Deploy Now"

### Passo 2: Adicionar Banco de Dados MySQL

1. No dashboard do projeto, clique em "New"
2. Escolha "Database"
3. Selecione "MySQL"
4. Aguarde o provisionamento (1-2 minutos)
5. Clique no serviço MySQL criado
6. Vá na aba "Variables"
7. **Copie o valor de `DATABASE_URL`** (você vai precisar)

### Passo 3: Configurar Variáveis de Ambiente

1. Clique no serviço principal (julia-whatsapp-assistant)
2. Vá na aba "Variables"
3. Clique em "Raw Editor"
4. Cole as variáveis abaixo (substituindo os valores):

```env
# Banco de Dados (copiar do MySQL criado no Railway)
DATABASE_URL=mysql://root:senha@host:porta/railway

# OpenAI (OBRIGATÓRIO)
OPENAI_API_KEY=sk-proj-...

# GTI-API (OBRIGATÓRIO - verificar ID correto no painel GTI)
GTI_BASE_URL=https://apivip.gti-api.com
GTI_INSTANCE_ID=SUA-INSTANCIA-ID
GTI_API_KEY=SUA-API-KEY

# Z-API (OPCIONAL - backup)
ZAPI_BASE_URL=https://api.z-api.io
ZAPI_INSTANCE_ID=sua-instancia-id
ZAPI_TOKEN=seu-token
ZAPI_CLIENT_TOKEN=seu-client-token

# ZapSign (OPCIONAL)
ZAPSIGN_BASE_URL=https://api.zapsign.com.br
ZAPSIGN_API_TOKEN=seu-token

# Sistema
OWNER_NAME=Dr. Juliano Garbuggio
JWT_SECRET=GERAR_CHAVE_ALEATORIA_AQUI
VITE_APP_TITLE=Jul.IA - Assistente de WhatsApp
VITE_APP_LOGO=/logo.svg
```

**Como gerar JWT_SECRET:**

```bash
# No terminal (Mac/Linux)
openssl rand -base64 32

# Ou use um gerador online
# https://generate-secret.vercel.app/32
```

4. Clique em "Save" ou pressione Ctrl+S

### Passo 4: Aguardar Deploy

1. Vá na aba "Deployments"
2. Aguarde o build completar (3-5 minutos)
3. Status deve ficar "SUCCESS" (verde)

**Se der erro:**
- Verifique os logs na aba "Logs"
- Verifique se todas as variáveis estão corretas
- Verifique se `DATABASE_URL` está correta

### Passo 5: Obter URL Pública

1. Vá na aba "Settings"
2. Seção "Networking"
3. Clique em "Generate Domain"
4. Copie a URL gerada (ex: `https://julia-whatsapp-assistant-production.up.railway.app`)

---

## 🔗 PARTE 3: Configurar Webhooks

### GTI-API

1. Acesse o painel GTI-API (https://apivip.gti-api.com ou link fornecido)
2. Faça login
3. Selecione sua instância
4. Vá em "Webhooks" ou "Configurações"
5. Configure:
   - **URL**: `https://SUA-URL.railway.app/api/webhook/gti`
   - **Eventos**: Selecione:
     - `messages.upsert`
     - `messages.update`
   - **Método**: POST
6. Salve

### Z-API (Se estiver usando)

1. Acesse o painel Z-API
2. Faça login
3. Selecione sua instância
4. Vá em "Webhooks"
5. Configure:
   - **URL de Recebimento**: `https://SUA-URL.railway.app/api/webhook/zapi`
   - **Eventos**: Marque todos relacionados a mensagens
6. Salve

---

## ✅ PARTE 4: Testar

### Teste 1: Verificar se Servidor Está Online

Acesse no navegador:
```
https://SUA-URL.railway.app
```

Deve aparecer a interface da Jul.IA.

### Teste 2: Verificar Logs

No Railway:
1. Vá na aba "Logs"
2. Deve aparecer:
   ```
   Server running on http://localhost:3000/
   [OAuth] Initialized with baseURL: ...
   ```

### Teste 3: Enviar Mensagem de Teste

**IMPORTANTE**: Antes de testar, verifique se:
- ✅ Instância GTI-API está conectada
- ✅ Webhook está configurado corretamente
- ✅ Número (11) 95675-9223 está ativo

**Como testar:**

1. Abra WhatsApp no seu celular
2. Envie mensagem para: **(11) 95675-9223**
3. Mensagem de teste: "Oi"

**Resultado esperado:**
- Jul.IA deve responder em até 5 segundos
- Resposta deve ser algo como: "Oi! Tudo bem com você? Sou a Jul.IA..."

**Se não responder:**
1. Verifique logs no Railway (aba "Logs")
2. Procure por erros relacionados a GTI-API
3. Verifique se webhook está recebendo (deve aparecer log `[Webhook GTI-API]`)

### Teste 4: Verificar Dashboard

1. Acesse `https://SUA-URL.railway.app`
2. Faça login (se necessário)
3. Vá em "Leads"
4. Deve aparecer o lead criado pelo teste

---

## 🐛 TROUBLESHOOTING

### Problema: Deploy falha com erro de build

**Solução:**
```bash
# Localmente, teste o build
pnpm install
pnpm build

# Se funcionar local, verifique variáveis no Railway
```

### Problema: Erro "DATABASE_URL not found"

**Solução:**
1. Verifique se MySQL foi criado no Railway
2. Copie `DATABASE_URL` do MySQL
3. Cole em Variables do serviço principal

### Problema: Jul.IA não responde mensagens

**Possíveis causas:**

1. **Webhook não configurado**
   - Verifique URL no painel GTI-API
   - Deve ser: `https://SUA-URL.railway.app/api/webhook/gti`

2. **Instância GTI desconectada**
   - Verifique status no painel GTI-API
   - Reconecte se necessário

3. **Instância GTI não existe**
   - Erro 404: "instance does not exist"
   - Verifique `GTI_INSTANCE_ID` no Railway
   - Confirme ID correto no painel GTI

4. **OpenAI API Key inválida**
   - Verifique `OPENAI_API_KEY` no Railway
   - Teste a key em: https://platform.openai.com/api-keys

**Como debugar:**

1. Acesse logs no Railway (aba "Logs")
2. Envie mensagem de teste
3. Procure por:
   - `[Webhook GTI-API] 📥 MENSAGEM RECEBIDA:` (webhook funcionando)
   - Erros de API (GTI, OpenAI, etc)

### Problema: Erro 500 ao acessar dashboard

**Solução:**
1. Verifique logs no Railway
2. Procure por erros de banco de dados
3. Execute migrations:
   ```bash
   # Localmente
   pnpm db:push
   ```

### Problema: Consulta de processo não funciona

**Causa**: API DataJud não configurada ou offline

**Solução:**
1. Verifique se `DATAJUD_BASE_URL` está configurada
2. Teste a URL manualmente
3. Se não tiver, a Jul.IA vai ensinar consulta manual

---

## 🔄 PARTE 5: Atualizações Futuras

### Como Fazer Update

```bash
# 1. Fazer alterações no código local
# 2. Commit
git add .
git commit -m "Descrição da mudança"

# 3. Push para GitHub
git push origin main

# 4. Railway detecta automaticamente e faz redeploy
```

### Rollback (Voltar Versão Anterior)

1. No Railway, vá na aba "Deployments"
2. Encontre o deploy anterior que funcionava
3. Clique nos 3 pontinhos (...)
4. Escolha "Redeploy"

---

## 📊 PARTE 6: Monitoramento

### Logs em Tempo Real

No Railway:
1. Aba "Logs"
2. Ative "Auto-scroll"
3. Envie mensagem de teste
4. Acompanhe processamento

### Métricas

No Railway:
1. Aba "Metrics"
2. Veja:
   - CPU usage
   - Memory usage
   - Network (requests)

### Alertas

Configure alertas no Railway:
1. Settings → Notifications
2. Adicione email ou webhook
3. Escolha eventos (deploy failed, etc)

---

## 💰 PARTE 7: Custos

### Railway Pricing

- **Plano Free**: $5 de crédito/mês
- **Plano Pro**: $20/mês (recomendado para produção)

**Estimativa de custo mensal:**
- Servidor (1 instância): ~$10-15
- MySQL (1 database): ~$5-10
- **Total**: ~$15-25/mês

### OpenAI Pricing

- GPT-4: ~$0.03 por 1K tokens (input) + $0.06 por 1K tokens (output)
- **Estimativa**: 1000 conversas/mês = ~$50-100

**Total geral estimado**: ~$65-125/mês

---

## ✅ CHECKLIST FINAL

Antes de considerar o deploy completo, verifique:

- [ ] Código no GitHub (repositório privado)
- [ ] Deploy no Railway (status SUCCESS)
- [ ] Banco de dados MySQL criado e conectado
- [ ] Todas as variáveis de ambiente configuradas
- [ ] URL pública gerada
- [ ] Webhook GTI-API configurado
- [ ] Webhook Z-API configurado (se usar)
- [ ] Teste de mensagem funcionando
- [ ] Dashboard acessível
- [ ] Logs sem erros críticos

---

## 📞 SUPORTE

**Problemas com:**

- **Railway**: https://railway.app/help
- **GTI-API**: Suporte GTI-API
- **OpenAI**: https://help.openai.com

**Desenvolvedor**: ChatGPT (via HANDOFF.md)

---

**🎉 PARABÉNS! Jul.IA está no ar!**

---

_Última atualização: 23/11/2025_
