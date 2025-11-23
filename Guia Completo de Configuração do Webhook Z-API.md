# Guia Completo de Configuração do Webhook Z-API

Este documento fornece instruções detalhadas para configurar o webhook do Z-API e conectar o chatbot Jul.IA ao WhatsApp Business.

---

## Pré-requisitos

Antes de começar, certifique-se de que você possui:

1. **Conta ativa no Z-API** com uma instância de WhatsApp configurada
2. **Número de WhatsApp Business** conectado à instância
3. **Credenciais do Z-API:**
   - Instance ID (ID da Instância)
   - Token de acesso
4. **URL do webhook** do seu projeto (fornecida após o deploy)

---

## Passo 1: Acessar o Painel do Z-API

Acesse o painel de controle do Z-API através do link:

**https://api.z-api.io/**

Faça login com suas credenciais.

---

## Passo 2: Selecionar sua Instância

No painel principal, você verá uma lista de instâncias de WhatsApp configuradas. Clique na instância que deseja conectar ao chatbot Jul.IA.

A tela exibirá informações importantes:

- **Nome da Instância:** Identificação da sua instância
- **ID da Instância:** Código único (exemplo: `3E9D34376337516C1260CEE0FE05F6ED`)
- **Token:** Chave de autenticação (exemplo: `D6E8A4FB312F8FE76C3C6508`)
- **Status:** Deve estar "Conectado" (verde)

---

## Passo 3: Configurar o Webhook

Na página da instância, procure pela aba ou seção **"Webhooks e configurações gerais"** ou **"Configurações"**.

Clique em **"Configurar webhooks"** ou botão similar.

---

## Passo 4: Inserir a URL do Webhook

Na configuração de webhooks, você verá um campo para inserir a **URL do webhook**.

Insira a seguinte URL (substitua `seu-dominio.manus.space` pelo domínio real do seu projeto):

```
https://seu-dominio.manus.space/api/trpc/webhooks.zapi
```

**Exemplo real:**
```
https://juliawhatsapp-abc123.manus.space/api/trpc/webhooks.zapi
```

---

## Passo 5: Selecionar Eventos do Webhook

O Z-API permite que você escolha quais eventos devem acionar o webhook. Marque as seguintes opções:

✅ **Mensagens recebidas** (`message-received`)
✅ **Mensagens de texto** (`text`)
✅ **Mensagens de botão** (`button`)
✅ **Mensagens de lista** (`list`)

**NÃO marque:**
❌ Mensagens de grupos (o chatbot processa apenas conversas individuais)
❌ Status de leitura
❌ Presença online

---

## Passo 6: Salvar Configurações

Após inserir a URL e selecionar os eventos, clique em **"Salvar"** ou **"Atualizar webhook"**.

O sistema Z-API fará um teste de conexão enviando uma requisição para a URL do webhook. Se tudo estiver correto, você verá uma mensagem de sucesso:

✅ **"Webhook configurado com sucesso"**

---

## Passo 7: Verificar Conexão

Para garantir que o webhook está funcionando corretamente:

1. Envie uma mensagem de teste para o número de WhatsApp conectado à instância
2. Aguarde alguns segundos
3. Você deve receber uma resposta automática do chatbot Jul.IA

**Mensagem esperada:**
```
Olá! 👋 Sou a Jul.IA, assistente virtual do escritório de advocacia Juliano Garbuggio...
```

---

## Passo 8: Monitorar Logs (Opcional)

Para verificar se as mensagens estão sendo recebidas e processadas:

1. Acesse o dashboard do chatbot Jul.IA
2. Vá para a seção **"Logs de Webhooks"** ou **"Conversas"**
3. Verifique se as mensagens de teste aparecem nos logs

---

## Solução de Problemas

### Problema: Webhook não está recebendo mensagens

**Possíveis causas e soluções:**

1. **URL incorreta**
   - Verifique se a URL do webhook está correta
   - Certifique-se de que termina com `/api/trpc/webhooks.zapi`
   - Confirme que o domínio está ativo e acessível

2. **Instância desconectada**
   - Verifique se o status da instância está "Conectado" (verde)
   - Se estiver desconectado, reconecte o WhatsApp escaneando o QR Code

3. **Eventos não selecionados**
   - Certifique-se de que os eventos corretos estão marcados
   - Salve as configurações novamente

4. **Firewall ou bloqueio**
   - Verifique se não há firewall bloqueando requisições do Z-API
   - Confirme que o servidor está aceitando requisições HTTPS

### Problema: Chatbot não responde

**Possíveis causas e soluções:**

1. **Servidor offline**
   - Verifique se o servidor do chatbot está rodando
   - Acesse o dashboard para confirmar o status

2. **Erro na base de conhecimento**
   - Execute o script de seed da base de conhecimento:
   ```bash
   npx tsx seed-knowledge.ts
   ```

3. **Credenciais incorretas**
   - Verifique se as variáveis de ambiente estão configuradas:
     - `ZAPI_INSTANCE_ID`
     - `ZAPI_TOKEN`
     - `ZAPI_BASE_URL`

### Problema: Mensagens duplicadas

**Causa:** O webhook pode estar configurado em múltiplos lugares.

**Solução:**
1. Acesse as configurações do Z-API
2. Verifique se há apenas uma URL de webhook configurada
3. Remova URLs duplicadas

---

## Configurações Avançadas

### Autenticação de Dois Fatores

Se você ativou autenticação de dois fatores no Z-API, certifique-se de que:

1. O token de acesso está atualizado
2. As credenciais estão corretas nas variáveis de ambiente

### Múltiplas Instâncias

Se você possui múltiplas instâncias de WhatsApp:

1. Configure o webhook separadamente para cada instância
2. Use a mesma URL do webhook para todas
3. O sistema identificará automaticamente qual instância enviou a mensagem

### Teste de Carga

Para testar se o sistema suporta alto volume de mensagens:

1. Envie várias mensagens em sequência
2. Monitore os logs do servidor
3. Verifique se todas as mensagens foram processadas

---

## Manutenção

### Atualizar URL do Webhook

Se você mudar o domínio do projeto:

1. Acesse o painel do Z-API
2. Atualize a URL do webhook com o novo domínio
3. Salve as configurações
4. Teste o envio de uma mensagem

### Renovar Token

Se o token do Z-API expirar:

1. Acesse o painel do Z-API
2. Gere um novo token
3. Atualize a variável de ambiente `ZAPI_TOKEN`
4. Reinicie o servidor do chatbot

### Backup de Configurações

Recomendamos manter um registro das configurações:

- **Instance ID:** `[seu-instance-id]`
- **Token:** `[seu-token]` (mantenha seguro!)
- **URL do Webhook:** `[sua-url-webhook]`
- **Data de configuração:** `[data]`

---

## Suporte

Se você encontrar problemas não listados neste guia:

1. **Documentação oficial do Z-API:** https://developer.z-api.io/
2. **Suporte Z-API:** Através do painel de controle
3. **Logs do chatbot:** Acesse o dashboard para ver logs detalhados

---

## Checklist de Configuração

Use este checklist para garantir que tudo está configurado corretamente:

- [ ] Conta Z-API criada e ativa
- [ ] Instância de WhatsApp conectada (status verde)
- [ ] Instance ID e Token copiados
- [ ] Variáveis de ambiente configuradas no projeto
- [ ] URL do webhook inserida no painel Z-API
- [ ] Eventos corretos selecionados
- [ ] Configurações salvas no Z-API
- [ ] Mensagem de teste enviada
- [ ] Resposta automática recebida
- [ ] Logs verificados no dashboard
- [ ] Base de conhecimento populada

---

## Próximos Passos

Após configurar o webhook com sucesso:

1. **Teste o fluxo completo** de qualificação de leads
2. **Adicione mais conhecimento** à base de dados da IA
3. **Configure integrações** com outros sistemas Jul.IA
4. **Monitore métricas** no dashboard
5. **Ajuste respostas** da IA conforme necessário

---

**Documentação criada por:** Manus AI  
**Última atualização:** 2025-01-09  
**Versão:** 1.0
