# Correção do Webhook Z-API

## Problema Identificado

O webhook está recebendo mensagens, mas o código tem um erro ao processar o payload:
```
TypeError: Cannot read properties of undefined (reading 'type')
```

## Formato Correto do Payload Z-API

Segundo a documentação oficial, o Z-API envia:

```json
{
  "isStatusReply": false,
  "senderLid": "81896604192873@lid",
  "connectedPhone": "554499999999",
  "waitingMessage": false,
  "isEdit": false,
  "isGroup": false,
  "isNewsletter": false,
  "instanceId": "A20DA9C0183A2D35A260F53F5D2B9244",
  "messageId": "A20DA9C0183A2D35A260F53F5D2B9244",
  "phone": "5544999999999",
  "fromMe": false,
  "momment": 1632228638000,
  "status": "RECEIVED",
  "chatName": "name",
  "senderPhoto": "https://",
  "senderName": "name",
  "participantPhone": null,
  "participantLid": null,
  "photo": "https://",
  "broadcast": false,
  "type": "ReceivedCallback",
  "text": {
    "message": "teste"
  }
}
```

## Campos Importantes

- `type`: **"ReceivedCallback"** (não é `input.type`, é `input.type` diretamente)
- `phone`: Número do remetente
- `text.message`: Conteúdo da mensagem
- `fromMe`: Se foi enviada pelo bot (ignorar se `true`)
- `isGroup`: Se é mensagem de grupo (ignorar se `true`)

## Correção Necessária

No arquivo `server/routers.ts`, linha 274, o código está tentando acessar `input.type` mas deveria usar o campo `type` diretamente do payload.
