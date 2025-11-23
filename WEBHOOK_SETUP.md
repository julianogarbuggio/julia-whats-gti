# Configuração do Webhook - Jul.IA Intimações

Este documento explica como configurar o webhook no Jul.IA Intimações para receber notificações automáticas de audiências e sincronizar processos.

## 📋 Informações do Webhook

**URL do Webhook:**
```
https://juliawa-u52rgndc.manus.space/api/webhooks/intimacoes
```

**Método:** `POST`

**Content-Type:** `application/json`

## 🔧 Passo a Passo da Configuração

### 1. Acesse o Jul.IA Intimações

Entre em: https://juliaiga-intimacoes.manus.space/

### 2. Vá para Integrações

No menu lateral, clique em **"Integrações"**

### 3. Adicione o Webhook

1. Clique em **"Adicionar Webhook"** ou **"Nova Integração"**
2. Cole a URL do webhook: `https://juliawa-u52rgndc.manus.space/api/webhooks/intimacoes`
3. Selecione os eventos que deseja receber:
   - ✅ **Audiências agendadas**
   - ✅ **Novas movimentações processuais**
   - ✅ **Atualizações de clientes**

### 4. Configure Autenticação (Opcional)

Se o Jul.IA Intimações suportar autenticação por token:

**Header:** `Authorization`
**Valor:** `Bearer [TOKEN]` (será fornecido pelo sistema)

### 5. Teste o Webhook

1. Clique em **"Testar Webhook"** ou **"Enviar Teste"**
2. Verifique se o status retorna **200 OK**
3. Confirme que a mensagem de teste foi recebida

## 📨 Formato dos Dados Recebidos

### Notificação de Audiência

```json
{
  "tipo": "audiencia",
  "cliente": {
    "nome": "João Silva",
    "cpf": "123.456.789-00",
    "telefone": "11999999999"
  },
  "processo": {
    "numero": "0000000-00.0000.8.26.0000",
    "tribunal": "TJSP"
  },
  "audiencia": {
    "data": "2024-06-15",
    "hora": "14:00",
    "tipo": "Audiência de Conciliação",
    "local": "Fórum Central - Sala 301"
  }
}
```

### Movimentação Processual

```json
{
  "tipo": "movimentacao",
  "cliente": {
    "nome": "Maria Santos",
    "cpf": "987.654.321-00",
    "telefone": "11988888888"
  },
  "processo": {
    "numero": "0000000-00.0000.8.26.0000",
    "tribunal": "TJSP"
  },
  "movimentacao": {
    "data": "2024-05-20",
    "descricao": "Sentença publicada",
    "conteudo": "Julgado procedente o pedido..."
  }
}
```

## 🔄 O que Acontece Automaticamente

Quando o webhook recebe uma notificação:

### 1. Audiência Agendada
- ✅ Jul.IA envia WhatsApp automático para o cliente
- ✅ Mensagem inclui: data, hora, local, tipo de audiência
- ✅ Cliente é orientado sobre o que levar

### 2. Nova Movimentação
- ✅ Jul.IA analisa a movimentação
- ✅ Se for importante (sentença, decisão), notifica o cliente
- ✅ Explica em linguagem simples o que significa

### 3. Atualização de Cliente
- ✅ Dados são sincronizados automaticamente
- ✅ Mantém cadastro atualizado nos 2 sistemas

## 🧪 Como Testar

### Teste Manual

1. No Jul.IA Intimações, cadastre uma audiência de teste
2. Verifique se o cliente recebeu WhatsApp automático
3. Confira se os dados estão corretos

### Teste de Conexão

Use o `curl` para testar o endpoint:

```bash
curl -X POST https://juliawa-u52rgndc.manus.space/api/webhooks/intimacoes \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "teste",
    "mensagem": "Teste de conexão do webhook"
  }'
```

Resposta esperada: `200 OK`

## 🐛 Solução de Problemas

### Webhook não está funcionando

1. **Verifique a URL:** Certifique-se de que está usando `https://` (não `http://`)
2. **Teste a conexão:** Use o curl acima para verificar se o endpoint está acessível
3. **Verifique os logs:** No painel do Jul.IA WhatsApp, vá em "Integrações" para ver logs de webhooks recebidos

### Notificações não estão sendo enviadas

1. **Verifique o telefone:** Certifique-se de que o número está no formato correto (5511999999999)
2. **Verifique o Z-API:** Confirme que a instância do Z-API está ativa
3. **Verifique os logs:** Procure por erros no console do servidor

### Cliente não recebeu WhatsApp

1. **Número correto?** Verifique se o número está com DDD e código do país (55)
2. **WhatsApp ativo?** Confirme que o número tem WhatsApp ativo
3. **Instância Z-API conectada?** Verifique status no painel Z-API

## 📞 Suporte

Se precisar de ajuda com a configuração:

- **Email:** juliano@garbuggio.adv.br
- **WhatsApp:** (44) 99986-9223

## 🔒 Segurança

- ✅ Todas as comunicações usam HTTPS
- ✅ Dados são criptografados em trânsito
- ✅ Apenas eventos configurados são recebidos
- ✅ Webhook valida origem das requisições

## 📝 Notas Importantes

1. **Mantenha a URL atualizada:** Se o domínio mudar, atualize no Jul.IA Intimações
2. **Monitore os logs:** Verifique regularmente se os webhooks estão sendo recebidos
3. **Teste após mudanças:** Sempre teste após atualizar configurações

---

**Última atualização:** 20/05/2024
**Versão do sistema:** 5c5e1d2d
