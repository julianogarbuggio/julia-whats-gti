# Integrações de APIs - Jul.IA Assistente de WhatsApp

## APIs Disponíveis

### 1. Z-API (WhatsApp Business API)
**Finalidade:** Integração com WhatsApp Business para automação de conversas

**Funcionalidades principais:**
- Envio e recebimento de mensagens via WhatsApp
- Webhooks para receber mensagens dos usuários
- Envio de mensagens de texto, imagens, documentos
- Gerenciamento de conversas ativas
- Status de leitura e entrega
- Botões interativos e listas de opções

**Endpoints principais:**
- `POST /send-text` - Enviar mensagem de texto
- `POST /send-button` - Enviar mensagem com botões
- `POST /send-list` - Enviar mensagem com lista de opções
- `POST /send-document` - Enviar documentos
- `GET /chats` - Listar conversas
- Webhook para receber mensagens

**Uso no chatbot:**
- Receber mensagens dos clientes potenciais
- Enviar perguntas de qualificação
- Enviar informações sobre serviços
- Enviar links para formulários
- Notificar sobre agendamentos
- Encaminhar para atendimento humano

---

### 2. ZapSign (Assinatura Digital)
**Finalidade:** Gestão de assinaturas digitais de documentos jurídicos

**Funcionalidades principais:**
- Criar documentos para assinatura
- Enviar documentos via WhatsApp/Email
- Rastrear status de assinaturas
- Webhook para notificações de assinatura
- Download de documentos assinados
- Gestão de signatários

**Endpoints principais:**
- `POST /api/v1/documents` - Criar documento para assinatura
- `GET /api/v1/documents/{id}` - Consultar status do documento
- `POST /api/v1/documents/{id}/send` - Enviar documento para assinatura
- `GET /api/v1/documents/{id}/download` - Baixar documento assinado
- Webhook para notificações de eventos

**Uso no chatbot:**
- Enviar procurações para assinatura após qualificação
- Enviar contratos de honorários
- Notificar cliente sobre documentos pendentes
- Confirmar recebimento de assinaturas
- Integrar com sistema Jul.IA Procurações

---

## Fluxo de Integração no Chatbot

### Cenário 1: Lead Qualificado → Envio de Documentos
1. Cliente conversa com chatbot via WhatsApp (Z-API)
2. Chatbot qualifica o lead com perguntas
3. Sistema identifica caso positivo para revisão
4. Sistema gera procuração e contrato (integração com Jul.IA Procurações)
5. Documentos são enviados via ZapSign para assinatura
6. Cliente recebe link de assinatura via WhatsApp (Z-API)
7. Após assinatura, webhook do ZapSign notifica o sistema
8. Sistema confirma recebimento e agenda atendimento

### Cenário 2: Atendimento Automatizado → Humano
1. Cliente inicia conversa via WhatsApp (Z-API)
2. Chatbot não consegue qualificar ou caso está fora do escopo
3. Sistema marca conversa para atendimento humano
4. Advogado/assistente recebe notificação
5. Histórico completo da conversa é disponibilizado

### Cenário 3: Acompanhamento de Documentos
1. Cliente pergunta sobre status de documentos
2. Chatbot consulta API do ZapSign
3. Informa status: "Aguardando assinatura", "Assinado", "Processando"
4. Oferece reenvio de link se necessário

---

## Estrutura de Dados para Integração

### Webhook Z-API (Receber Mensagens)
```json
{
  "instanceId": "string",
  "messageId": "string",
  "phone": "5511999999999",
  "fromMe": false,
  "momment": 1699999999,
  "status": "RECEIVED",
  "chatName": "Nome do Cliente",
  "senderName": "Nome do Cliente",
  "photo": "url_foto",
  "broadcast": false,
  "type": "text",
  "text": {
    "message": "Mensagem do cliente"
  }
}
```

### Envio de Mensagem Z-API
```json
{
  "phone": "5511999999999",
  "message": "Olá! Sou a Jul.IA, assistente virtual do escritório..."
}
```

### Envio de Botões Z-API
```json
{
  "phone": "5511999999999",
  "message": "Seu empréstimo é consignado?",
  "buttonText": "Escolha uma opção",
  "buttons": [
    {"id": "sim", "label": "Sim"},
    {"id": "nao", "label": "Não"},
    {"id": "nao_sei", "label": "Não sei"}
  ]
}
```

### Criar Documento ZapSign
```json
{
  "name": "Procuração - Nome do Cliente",
  "url_pdf": "https://url-do-documento.pdf",
  "signers": [
    {
      "name": "Nome do Cliente",
      "email": "cliente@email.com",
      "phone": "5511999999999",
      "send_whatsapp": true
    }
  ],
  "webhook_url": "https://julia-whatsapp.manus.space/api/webhooks/zapsign"
}
```

### Webhook ZapSign (Notificação de Assinatura)
```json
{
  "event": "document_signed",
  "document_id": "abc123",
  "signer_name": "Nome do Cliente",
  "signed_at": "2025-11-09T10:30:00Z",
  "status": "signed"
}
```

---

## Configuração de Variáveis de Ambiente

```env
# Z-API Configuration
ZAPI_INSTANCE_ID=sua_instancia
ZAPI_TOKEN=seu_token
ZAPI_CLIENT_TOKEN=seu_client_token
ZAPI_WEBHOOK_URL=https://julia-whatsapp.manus.space/api/webhooks/zapi

# ZapSign Configuration
ZAPSIGN_API_KEY=sua_api_key
ZAPSIGN_WEBHOOK_URL=https://julia-whatsapp.manus.space/api/webhooks/zapsign

# Jul.IA Integration
JULIA_PETICOES_API_URL=https://juliapetio-2fqnzfje.manus.space/api
JULIA_PROCURACOES_API_URL=https://julia-auto-cp2yvyjm.manus.space/api
JULIA_AGENDA_API_URL=https://juliaenvio-2ytv5ceh.manus.space/api
```

---

## Endpoints do Sistema Jul.IA WhatsApp

### Webhooks
- `POST /api/webhooks/zapi` - Receber mensagens do WhatsApp
- `POST /api/webhooks/zapsign` - Receber notificações de assinaturas

### API Interna
- `POST /api/leads` - Criar novo lead
- `GET /api/leads/:id` - Consultar lead
- `PUT /api/leads/:id` - Atualizar lead
- `POST /api/conversations` - Registrar conversa
- `GET /api/reports/leads` - Relatório de leads
- `GET /api/reports/conversions` - Relatório de conversões
- `POST /api/export/csv` - Exportar dados em CSV

### Integração com Outros Sistemas Jul.IA
- `POST /api/integration/import-client` - Importar cliente de outro sistema
- `POST /api/integration/export-client` - Exportar cliente para outro sistema
- `GET /api/integration/sync-status` - Status de sincronização
