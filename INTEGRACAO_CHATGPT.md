# Integração Jul.IA com ChatGPT

Este documento explica como integrar a Jul.IA (Assistente Virtual WhatsApp) com o ChatGPT usando GPT Actions/Plugins.

---

## 📋 Visão Geral

A Jul.IA pode ser usada como uma "ferramenta" do ChatGPT, permitindo que o ChatGPT:

- Consulte informações sobre direito do consumidor
- Qualifique leads de revisão de empréstimo
- Envie mensagens via WhatsApp
- Acesse a base de conhecimento jurídico

**Importante:** Todos os filtros de segurança jurídica são aplicados automaticamente, garantindo que nenhuma consulta jurídica indevida seja fornecida.

---

## 🔌 Endpoints Disponíveis

### 1. POST `/api/chatgpt-webhook`
**Enviar mensagem para a Jul.IA e receber resposta**

**Request:**
```json
{
  "message": "Gostaria de saber sobre revisão de empréstimo consignado",
  "context": "Cliente já informou que tem empréstimo no Banco do Brasil",
  "userId": "user_12345"
}
```

**Response:**
```json
{
  "success": true,
  "response": "A revisão de empréstimo consignado é um procedimento...",
  "timestamp": "2025-11-11T22:00:00.000Z"
}
```

---

### 2. POST `/api/chatgpt-send`
**Enviar mensagem via WhatsApp**

**Request:**
```json
{
  "phone": "5511999999999",
  "message": "Olá! Seu caso foi qualificado com sucesso."
}
```

**Response:**
```json
{
  "success": true,
  "timestamp": "2025-11-11T22:00:00.000Z"
}
```

---

### 3. GET `/api/chatgpt-health`
**Verificar status do serviço**

**Response:**
```json
{
  "status": "ok",
  "service": "Jul.IA ChatGPT Integration",
  "timestamp": "2025-11-11T22:00:00.000Z"
}
```

---

## 🚀 Como Configurar no ChatGPT

### Passo 1: Acessar GPT Actions

1. Acesse https://chat.openai.com/
2. Clique em seu nome → "Settings" → "Beta features"
3. Ative "Plugins" ou "Actions"
4. Vá em "Create a GPT" ou "My GPTs"

### Passo 2: Criar Novo GPT

1. Clique em "Create a GPT"
2. Nome: **Jul.IA - Assistente Jurídico**
3. Descrição:
```
Assistente especializado em direito do consumidor, focado em revisão de empréstimos consignados. 
Fornece informações gerais sobre procedimentos jurídicos, sem dar consultas específicas.
```

### Passo 3: Configurar Actions

1. Vá na aba "Configure" → "Actions"
2. Clique em "Create new action"
3. Escolha "Import from URL" ou "Schema"

**Opção A: Import from URL**
```
https://seu-dominio.manus.space/openapi-chatgpt.yaml
```

**Opção B: Cole o Schema**
- Copie o conteúdo do arquivo `openapi-chatgpt.yaml`
- Cole no campo "Schema"

### Passo 4: Configurar Autenticação (Opcional)

Se você quiser adicionar autenticação:

1. Em "Authentication", escolha "API Key"
2. Auth Type: "Bearer"
3. API Key: `[Sua chave de API]`

### Passo 5: Testar a Integração

No campo de teste, experimente:

```
"Consulte a Jul.IA sobre revisão de empréstimo consignado"
```

O ChatGPT deve chamar o endpoint `/api/chatgpt-webhook` e retornar a resposta.

---

## 💡 Exemplos de Uso

### Exemplo 1: Consultar Informações

**Prompt para o ChatGPT:**
```
Usando a Jul.IA, me explique quando é cabível a revisão de empréstimo consignado
```

**O que acontece:**
1. ChatGPT chama `/api/chatgpt-webhook` com a mensagem
2. Jul.IA processa e aplica filtros de segurança
3. Retorna resposta informativa (sem consulta jurídica)
4. ChatGPT apresenta a resposta ao usuário

---

### Exemplo 2: Qualificar Lead

**Prompt para o ChatGPT:**
```
Usando a Jul.IA, qualifique um lead com os seguintes dados:
- Nome: João Silva
- Banco: Banco do Brasil
- Tipo: Empréstimo consignado
- Parcela: R$ 500
- Prazo: 60 meses
```

**O que acontece:**
1. ChatGPT envia dados estruturados para Jul.IA
2. Jul.IA analisa viabilidade do caso
3. Retorna se o caso é qualificado ou não
4. ChatGPT informa o resultado

---

### Exemplo 3: Enviar Mensagem WhatsApp

**Prompt para o ChatGPT:**
```
Usando a Jul.IA, envie uma mensagem para 5511999999999 dizendo:
"Olá! Recebemos sua solicitação e entraremos em contato em breve."
```

**O que acontece:**
1. ChatGPT chama `/api/chatgpt-send`
2. Jul.IA envia mensagem via Z-API
3. Confirma envio bem-sucedido

---

## 🛡️ Filtros de Segurança

A integração com ChatGPT mantém **todos os filtros de segurança jurídica** ativos:

✅ **Detecta e bloqueia:**
- Reconhecimento de culpa
- Orientação jurídica específica
- Garantias de resultado
- Análise de casos concretos

✅ **Substitui automaticamente por:**
- Respostas neutras e informativas
- Encaminhamento para advogado
- Disclaimer jurídico quando necessário

---

## 📊 Monitoramento

Todas as interações via ChatGPT são registradas em:

- **Logs de segurança** - `/seguranca/logs`
- **Histórico de conversas** - `/conversas`
- **Métricas de uso** - Dashboard principal

---

## 🔧 Troubleshooting

### Erro: "Failed to fetch schema"

**Solução:** Verifique se a URL do servidor está correta e acessível:
```
https://seu-dominio.manus.space/openapi-chatgpt.yaml
```

### Erro: "Authentication failed"

**Solução:** Verifique se a API Key está configurada corretamente no ChatGPT.

### Erro: "Internal server error"

**Solução:** Verifique os logs do servidor em `/seguranca/logs` para identificar o problema.

---

## 📞 Suporte

Para dúvidas ou problemas com a integração:

- **E-mail:** juliano@garbuggio.com.br
- **WhatsApp:** [Seu número]
- **Documentação:** Este arquivo

---

## 🔄 Atualizações

**Versão 1.0.0** (11/11/2025)
- Integração inicial com ChatGPT
- Endpoints `/chatgpt-webhook`, `/chatgpt-send`, `/chatgpt-health`
- Filtros de segurança jurídica integrados
- Schema OpenAPI completo

---

**Desenvolvido por:** Manus IA  
**Cliente:** Juliano Garbuggio Sociedade Individual de Advocacia  
**Projeto:** Jul.IA - Assistente Virtual WhatsApp
