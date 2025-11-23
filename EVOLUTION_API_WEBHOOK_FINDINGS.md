# Evolution API Webhook - Descobertas

## Problema Atual
O webhook GTI-API está recebendo payload vazio `{}` quando mensagens são enviadas.

## Eventos Disponíveis
- `QRCODE_UPDATED`
- `MESSAGES_UPSERT` ← **Este é o evento de mensagens recebidas**
- `MESSAGES_UPDATE`
- `MESSAGES_DELETE`
- `SEND_MESSAGE`
- `CONNECTION_UPDATE`
- `TYPEBOT_START`
- `TYPEBOT_CHANGE_STATUS`

## Configuração do Webhook
```json
{
  "url": "{{webhookUrl}}",
  "webhook_by_events": false,
  "webhook_base64": false,
  "events": ["MESSAGES_UPSERT"]
}
```

## Próximo Passo
Preciso encontrar o formato exato do payload JSON que o Evolution API envia no evento `MESSAGES_UPSERT`.

## Fonte
https://doc.evolution-api.com/v1/en/configuration/webhooks
