# Credenciais GTI-API - Jul.IA

## Informações da Instância

**Nome da Instância:** `5511956759223`
**Instance ID:** `10516e44-72bb-4f9e-9f2d-32e9b7f4e5ef`
**API Key:** `15C1EE8A-34D4-4199-8A5E-489EB128C362`
**WhatsApp:** `5511956759223@s.whatsapp.net`

## Endpoints API

**Base URL:** `https://apivip.gti-api.com`

**Enviar Mensagem de Texto:**
```
POST https://apivip.gti-api.com/message/sendText/5511956759223
Headers:
  Content-Type: application/json
  apikey: 15C1EE8A-34D4-4199-8A5E-489EB128C362
Body:
{
  "number": "5511956759223",
  "text": "Mensagem aqui"
}
```

## Webhook

**URL do Webhook:**
```
https://3000-i9eazc49dkftpwcqj2k2o-d0327918.manusvm.computer/api/webhook/gti
```

**Eventos a Serem Notificados:**
- ✅ MESSAGES_UPSERT (Inserção de Mensagens) - **PRINCIPAL**
- ✅ SEND_MESSAGE (Envio de Mensagem)

## Status

- ✅ WhatsApp: Conectado
- ✅ API REST: Funcionando (teste realizado com sucesso)
- ⏳ Webhook: Aguardando configuração

## Teste Realizado

```bash
curl -X POST "https://apivip.gti-api.com/message/sendText/5511956759223" \
  -H "Content-Type: application/json" \
  -H "apikey: 15C1EE8A-34D4-4199-8A5E-489EB128C362" \
  -d '{"number": "5511956759223", "text": "🎉 Teste API GTI-API - Jul.IA funcionando!"}'
```

**Resposta:**
```json
{
  "key": {
    "remoteJid": "5511956759223@s.whatsapp.net",
    "fromMe": true,
    "id": "3EB0CBD666529E933496B8"
  },
  "status": "PENDING",
  "message": {
    "conversation": "🎉 Teste API GTI-API - Jul.IA funcionando!"
  },
  "messageType": "conversation",
  "instanceId": "10516e44-72bb-4f9e-9f2d-32e9b7f4e5ef"
}
```

✅ **Status:** SUCESSO!
