# 🤖 Jul.IA - Assistente Inteligente de WhatsApp para Advocacia

**Jul.IA** é uma assistente virtual avançada desenvolvida para automatizar e otimizar o atendimento jurídico via WhatsApp do Dr. Juliano Garbuggio, especialista em Direito do Consumidor.

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Deploy no Railway](#deploy-no-railway)
- [Uso](#uso)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

---

## 🎯 Sobre o Projeto

Jul.IA é uma assistente virtual que combina inteligência artificial, automação de processos e integração com múltiplas APIs para oferecer atendimento jurídico de alta qualidade via WhatsApp.

### Diferenciais

- ✅ **Aprendizado Contínuo**: A IA aprende diariamente com as conversas e melhora suas respostas
- ✅ **Consulta Automática de Processos**: Integração com DataJud CNJ para consultar andamentos processuais
- ✅ **Gestão Inteligente de Leads**: Qualificação automática e encaminhamento estratégico
- ✅ **Assinatura Digital**: Integração com ZapSign para contratos e documentos
- ✅ **Notificações Inteligentes**: Sistema de alertas para o advogado sobre situações urgentes
- ✅ **Segurança Jurídica**: Filtros automáticos para evitar consultas jurídicas indevidas

---

## ⚡ Funcionalidades

### 🤖 Inteligência Artificial

- **Conversação Natural**: Tom coloquial e empático, adaptado ao público-alvo
- **Contexto Persistente**: Memória de conversas anteriores
- **Aprendizado Automático**: Sistema de feedback e melhoria contínua
- **Detecção de Golpes**: Alertas automáticos sobre possíveis fraudes
- **Encaminhamento Inteligente**: Sabe quando transferir para atendimento humano

### 📊 Gestão de Leads

- **Qualificação Automática**: Coleta dados relevantes durante a conversa
- **Categorização**: Classifica leads por tipo de caso e urgência
- **Pipeline de Vendas**: Acompanhamento do funil de conversão
- **Relatórios**: Análise de desempenho e conversão

### ⚖️ Funcionalidades Jurídicas

- **Consulta de Andamento Processual**: Integração com DataJud CNJ (TJSP, TJPR, TJMG)
- **Formulários Inteligentes**: Coleta estruturada de informações
- **Gestão de Documentos**: Upload e organização de arquivos
- **Assinatura Digital**: Integração com ZapSign para contratos

### 📱 Integrações

- **GTI-API**: WhatsApp Business API principal
- **Z-API**: WhatsApp Business API secundária (backup)
- **DataJud CNJ**: Consulta de processos judiciais
- **ZapSign**: Assinatura digital de documentos
- **OpenAI**: Modelo de linguagem GPT-4

### 🔔 Notificações e Alertas

- **Resumos Automáticos**: Relatórios diários de atendimentos
- **Alertas de Urgência**: Notificações para casos prioritários
- **Cobrança de Andamento**: Lembretes para clientes sem resposta
- **Relatórios de Aprendizado**: Análise diária de falhas e melhorias

---

## 🛠️ Tecnologias

### Backend

- **Node.js** 22.x
- **TypeScript** 5.x
- **Express** 4.x
- **tRPC** 11.x - Type-safe API
- **Drizzle ORM** - Database ORM
- **MySQL/TiDB** - Database

### Frontend

- **React** 19.x
- **Vite** 6.x
- **Tailwind CSS** 4.x
- **shadcn/ui** - Component library
- **Wouter** - Routing

### Inteligência Artificial

- **OpenAI GPT-4** - Modelo de linguagem
- **Custom Training System** - Sistema de aprendizado contínuo

### Integrações

- **GTI-API** - WhatsApp Business API
- **Z-API** - WhatsApp Business API (backup)
- **DataJud CNJ** - Consulta processual
- **ZapSign** - Assinatura digital

---

## 🏗️ Arquitetura

```
┌─────────────────┐
│   WhatsApp      │
│   (Cliente)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   GTI-API       │◄──── Webhook
│   (Primary)     │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│         Jul.IA Backend              │
│  ┌──────────────────────────────┐   │
│  │  Conversation Flow Manager   │   │
│  └──────────┬───────────────────┘   │
│             │                        │
│  ┌──────────▼───────────────────┐   │
│  │   AI Chatbot Service         │   │
│  │   - OpenAI GPT-4             │   │
│  │   - Learning System          │   │
│  │   - Security Filters         │   │
│  └──────────┬───────────────────┘   │
│             │                        │
│  ┌──────────▼───────────────────┐   │
│  │   Integrations               │   │
│  │   - DataJud CNJ              │   │
│  │   - ZapSign                  │   │
│  │   - GTI/Z-API                │   │
│  └──────────┬───────────────────┘   │
│             │                        │
│  ┌──────────▼───────────────────┐   │
│  │   Database (MySQL/TiDB)      │   │
│  │   - Leads                    │   │
│  │   - Conversations            │   │
│  │   - AI Knowledge             │   │
│  │   - Learning Patterns        │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────┐
│   Dashboard     │
│   (React SPA)   │
└─────────────────┘
```

---

## 📥 Instalação

### Pré-requisitos

- Node.js 22.x ou superior
- pnpm 9.x ou superior
- MySQL 8.x ou TiDB
- Conta OpenAI com API Key
- Conta GTI-API ou Z-API
- (Opcional) Conta ZapSign
- (Opcional) Acesso DataJud CNJ

### Passo a Passo

1. **Clone o repositório**

```bash
git clone https://github.com/seu-usuario/julia-whatsapp-assistant.git
cd julia-whatsapp-assistant
```

2. **Instale as dependências**

```bash
pnpm install
```

3. **Configure as variáveis de ambiente**

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais (veja seção [Configuração](#configuração))

4. **Configure o banco de dados**

```bash
pnpm db:push
```

5. **Inicie o servidor de desenvolvimento**

```bash
pnpm dev
```

O servidor estará rodando em `http://localhost:3000`

---

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

#### Banco de Dados

```env
DATABASE_URL=mysql://user:password@host:port/database
```

#### OpenAI (Obrigatório)

```env
OPENAI_API_KEY=sk-...
```

#### GTI-API (WhatsApp - Opção 1)

```env
GTI_BASE_URL=https://apivip.gti-api.com
GTI_INSTANCE_ID=sua-instancia-id
GTI_API_KEY=sua-api-key
```

#### Z-API (WhatsApp - Opção 2 / Backup)

```env
ZAPI_BASE_URL=https://api.z-api.io
ZAPI_INSTANCE_ID=sua-instancia-id
ZAPI_TOKEN=seu-token
ZAPI_CLIENT_TOKEN=seu-client-token
```

#### ZapSign (Assinatura Digital - Opcional)

```env
ZAPSIGN_BASE_URL=https://api.zapsign.com.br
ZAPSIGN_API_TOKEN=seu-token
```

#### DataJud CNJ (Consulta Processual - Opcional)

```env
DATAJUD_BASE_URL=https://sua-api-datajud.railway.app
```

#### Configurações do Sistema

```env
# Proprietário do sistema
OWNER_NAME="Dr. Juliano Garbuggio"
OWNER_OPEN_ID=seu-open-id

# JWT para autenticação
JWT_SECRET=sua-chave-secreta-aleatoria

# OAuth (se usar Manus Auth)
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://auth.manus.im
VITE_APP_ID=seu-app-id

# Aplicação
VITE_APP_TITLE="Jul.IA - Assistente de WhatsApp"
VITE_APP_LOGO=/logo.svg
```

### Configuração de Webhooks

#### GTI-API

1. Acesse o painel GTI-API
2. Vá em "Webhooks"
3. Configure:
   - **URL**: `https://seu-dominio.com/api/webhook/gti`
   - **Eventos**: `messages.upsert`, `messages.update`

#### Z-API

1. Acesse o painel Z-API
2. Vá em "Webhooks"
3. Configure:
   - **URL**: `https://seu-dominio.com/api/webhook/zapi`
   - **Eventos**: Todos relacionados a mensagens

---

## 🚀 Deploy no Railway

### Passo 1: Preparar o Repositório

1. **Commit todas as alterações**

```bash
git add .
git commit -m "Preparar para deploy"
git push origin main
```

2. **Verifique se `.gitignore` está correto**

Certifique-se de que `.env`, `node_modules` e outros arquivos sensíveis estão no `.gitignore`

### Passo 2: Criar Projeto no Railway

1. Acesse [railway.app](https://railway.app)
2. Clique em "New Project"
3. Escolha "Deploy from GitHub repo"
4. Selecione o repositório `julia-whatsapp-assistant`

### Passo 3: Configurar Variáveis de Ambiente

No painel do Railway, vá em "Variables" e adicione todas as variáveis do arquivo `.env.example`

### Passo 4: Configurar Banco de Dados

1. No Railway, clique em "New" → "Database" → "MySQL"
2. Copie a `DATABASE_URL` gerada
3. Cole em "Variables" do seu projeto

### Passo 5: Deploy

1. O Railway fará o deploy automaticamente
2. Aguarde o build completar
3. Acesse a URL gerada (ex: `https://julia-whatsapp-assistant-production.up.railway.app`)

### Passo 6: Configurar Webhooks

Atualize as URLs dos webhooks no GTI-API e Z-API para a URL do Railway:

- GTI: `https://sua-url.railway.app/api/webhook/gti`
- Z-API: `https://sua-url.railway.app/api/webhook/zapi`

### Passo 7: Testar

Envie uma mensagem para o WhatsApp da Jul.IA e verifique se ela responde!

---

## 💡 Uso

### Dashboard Web

Acesse `https://sua-url.com` para ver:

- **Leads**: Lista de todos os contatos
- **Conversas**: Histórico de mensagens
- **Conhecimento**: Base de dados da IA
- **Relatórios**: Análises e métricas
- **Configurações**: Ajustes do sistema

### WhatsApp

Os clientes podem interagir diretamente via WhatsApp. A Jul.IA irá:

1. Cumprimentar e qualificar o lead
2. Coletar informações relevantes
3. Consultar processos (se solicitado)
4. Encaminhar para o advogado quando necessário
5. Enviar formulários e links úteis

---

## 📁 Estrutura do Projeto

```
julia-whatsapp-assistant/
├── client/                    # Frontend React
│   ├── public/               # Assets estáticos
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   ├── pages/           # Páginas
│   │   ├── lib/             # Utilitários
│   │   └── App.tsx          # App principal
│   └── index.html
├── server/                    # Backend Node.js
│   ├── _core/               # Infraestrutura
│   │   ├── index.ts         # Servidor Express
│   │   ├── trpc.ts          # Configuração tRPC
│   │   └── llm.ts           # Cliente OpenAI
│   ├── services/            # Serviços de negócio
│   │   ├── ai-chatbot.ts    # IA conversacional
│   │   ├── conversation-flow.ts  # Fluxo de conversa
│   │   ├── gti-api.ts       # Integração GTI
│   │   ├── zapi.ts          # Integração Z-API
│   │   ├── datajud-cnj-integration.ts  # DataJud
│   │   └── zapsign.ts       # ZapSign
│   ├── db.ts                # Queries do banco
│   └── routers.ts           # Rotas tRPC
├── drizzle/                  # Schema do banco
│   └── schema.ts
├── shared/                   # Código compartilhado
│   └── const.ts
├── .env.example             # Template de variáveis
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é proprietário e confidencial. Todos os direitos reservados.

© 2025 Dr. Juliano Garbuggio - Advocacia

---

## 📞 Suporte

Para dúvidas ou suporte:

- **WhatsApp**: (11) 95675-9223
- **Email**: contato@julianogarbuggio.adv.br
- **Website**: https://julianogarbuggio.adv.br

---

## 🎯 Roadmap

- [ ] Integração com mais tribunais (DataJud)
- [ ] Suporte a áudio (transcrição automática)
- [ ] Dashboard de analytics avançado
- [ ] Integração com CRM jurídico
- [ ] API pública para parceiros
- [ ] App mobile nativo

---

**Desenvolvido com ❤️ para advocacia moderna**
