# Evolution API - Descobertas

**Fonte:** https://doc.evolution-api.com/v1/api-reference/

## ✅ Confirmações

1. **GTI-API usa Evolution API** como base
2. **URL Base:** `https://apivip.gti-api.com/`
3. **Autenticação:** Header `apikey` com o token

## 📋 Endpoints Encontrados na Documentação

### Instâncias
- `GET /` - Get Information
- `POST /instance/create` - Create Instance Basic
- `GET /instance/fetchInstances` - Fetch Instances
- `GET /instance/connect/{instance}` - Instance Connect
- `PUT /instance/restart/{instance}` - Restart Instance
- `GET /instance/connectionState/{instance}` - Connection State ✅
- `DELETE /instance/logout/{instance}` - Logout Instance
- `DELETE /instance/delete/{instance}` - Delete Instance

### Webhook
- `POST /webhook/set/{instance}` - Set Webhook
- `GET /webhook/find/{instance}` - Find Webhook

### Settings
- `POST /settings/set/{instance}` - Set Settings
- `GET /settings/find/{instance}` - Find Settings

### Mensagens (preciso encontrar)
- `POST /message/sendText/{instance}` - Send Text (provável)
- `POST /message/sendTemplate/{instance}` - Send Template

## 🔍 Próximos Passos

1. Encontrar endpoint correto de envio de mensagem (sendText)
2. Verificar formato do payload
3. Testar com curl
4. Atualizar serviço gti-api.ts
