# 🔧 Correção Urgente: Credenciais GTI-API

## 🔴 Problema Identificado

As credenciais GTI-API configuradas no sistema estão **ERRADAS**, impedindo que Jul.IA funcione via WhatsApp.

## ❌ Credenciais Atuais (ERRADAS)

```
GTI_INSTANCE_ID=69205AC00B888
GTI_API_KEY=6920588040029
```

**Resultado:** API retorna 404 - Instância não encontrada

## ✅ Credenciais Corretas

```
GTI_INSTANCE_ID=10516e44-72bb-4f9e-9f2d-32e9b7f4e5ef
GTI_API_KEY=15C1EE8A-34D4-4199-8A5E-489EB128C362
GTI_BASE_URL=https://apivip.gti-api.com
```

**Teste realizado:** ✅ HTTP 201 - Mensagem enviada com sucesso!

## 📋 Como Corrigir (Manus Dashboard)

### Passo 1: Acessar Settings → Secrets

1. Abra o dashboard do projeto Jul.IA no Manus
2. Clique no ícone de engrenagem (⚙️) no canto superior direito
3. Vá em **Settings** → **Secrets**

### Passo 2: Atualizar GTI_INSTANCE_ID

1. Localize a variável `GTI_INSTANCE_ID`
2. Clique em **Edit** (✏️)
3. Substitua o valor por: `10516e44-72bb-4f9e-9f2d-32e9b7f4e5ef`
4. Clique em **Save**

### Passo 3: Atualizar GTI_API_KEY

1. Localize a variável `GTI_API_KEY`
2. Clique em **Edit** (✏️)
3. Substitua o valor por: `15C1EE8A-34D4-4199-8A5E-489EB128C362`
4. Clique em **Save**

### Passo 4: Reiniciar Servidor

1. Após salvar as duas variáveis
2. Clique em **Restart Server** no dashboard
3. Aguarde 30 segundos para o servidor reiniciar

## ✅ Validação

Após reiniciar, teste enviando uma mensagem para Jul.IA via WhatsApp:

**Número:** (11) 95675-9223

**Mensagem de teste:** "Olá"

**Resultado esperado:** Jul.IA deve responder automaticamente

## 🔍 Verificação Técnica

Para confirmar que as credenciais estão corretas, execute:

```bash
curl -X POST "https://apivip.gti-api.com/message/sendText/5511956759223" \
  -H "Content-Type: application/json" \
  -H "apikey: 15C1EE8A-34D4-4199-8A5E-489EB128C362" \
  -d '{"number": "5544999869223", "text": "Teste"}'
```

**Resposta esperada:** HTTP 201 com `"status": "PENDING"`

## 📝 Notas

- As credenciais corretas estão documentadas em `GTI_API_CREDENTIALS.md`
- Instance Name: `5511956759223`
- WhatsApp conectado: ✅
- Webhook configurado: ⏳ (aguardando correção das credenciais)

---

**Data:** 23/11/2025
**Status:** 🔴 URGENTE - Bloqueando funcionamento do WhatsApp
