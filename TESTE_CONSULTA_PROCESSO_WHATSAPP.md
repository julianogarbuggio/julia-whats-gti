# 📱 Teste de Consulta de Processo via WhatsApp

## 🎯 Objetivo

Validar que Jul.IA consegue:
1. Receber mensagem com número de processo
2. Detectar automaticamente que é uma consulta
3. Tentar consultar via API DataJud
4. Enviar instruções de consulta manual quando API falhar (fallback)

## ⚠️ Pré-requisitos

✅ **ANTES DE TESTAR:**
1. Corrigir credenciais GTI-API (ver `CORRECAO_CREDENCIAIS_GTI.md`)
2. Reiniciar servidor após atualizar credenciais
3. Confirmar que webhook GTI-API está configurado

## 📋 Cenários de Teste

### Cenário 1: Consulta de Processo (SP)

**Número de processo:** `2235388-72.2025.8.26.0000`

**Mensagem para enviar:**
```
Quero consultar meu processo 2235388-72.2025.8.26.0000
```

**Resultado esperado:**

Como a API DataJud está com erro 500, Jul.IA deve enviar automaticamente:

```
❌ Sistema de consulta temporariamente indisponível.

Mas não se preocupe! Você pode consultar agora mesmo:

📱 COMO CONSULTAR SEU PROCESSO NO TJSP:

1️⃣ Entre no site: https://esaj.tjsp.jus.br/cpopg/open.do

2️⃣ Na tela que abrir, você vai ver um campo escrito "Número do Processo"

3️⃣ Digite o número do seu processo: 2235388-72.2025.8.26.0000

4️⃣ Clique no botão "Consultar"

5️⃣ Pronto! Vai aparecer todas as movimentações do seu processo

💡 Dica: Se aparecer alguma palavra difícil, pode me perguntar que eu te explico!
```

### Cenário 2: Consulta de Processo (PR)

**Número de processo:** `1234567-89.2024.8.16.0001`

**Mensagem para enviar:**
```
Como está meu processo 1234567-89.2024.8.16.0001?
```

**Resultado esperado:**

Instruções de consulta para TJPR (Tribunal de Justiça do Paraná)

### Cenário 3: Consulta de Processo (MG)

**Número de processo:** `1234567-89.2024.8.13.0024`

**Mensagem para enviar:**
```
Queria saber o andamento do processo 1234567-89.2024.8.13.0024
```

**Resultado esperado:**

Instruções de consulta para TJMG (Tribunal de Justiça de Minas Gerais)

### Cenário 4: Número de Processo Inválido

**Mensagem para enviar:**
```
Meu processo é 123456
```

**Resultado esperado:**

Jul.IA deve pedir o número completo no formato correto:
```
Para consultar seu processo, preciso do número completo no formato:
NNNNNNN-DD.AAAA.J.TR.OOOO

Exemplo: 1234567-89.2024.8.26.0100

Pode me enviar o número completo?
```

## 📊 Checklist de Validação

Após cada teste, verificar:

- [ ] Jul.IA recebeu a mensagem (logs do servidor)
- [ ] Jul.IA detectou que é consulta de processo
- [ ] Jul.IA tentou consultar API DataJud
- [ ] Jul.IA detectou erro 500 da API
- [ ] Jul.IA enviou instruções de consulta manual
- [ ] Instruções estão corretas para o tribunal identificado
- [ ] Links estão funcionando
- [ ] Linguagem está simples e acessível

## 🔍 Como Verificar Logs

### Via Dashboard Manus

1. Abra o projeto Jul.IA
2. Clique em **Code** → **Logs**
3. Procure por:
   - `[DataJud] 🔍 Consultando processo`
   - `[DataJud] ❌ Erro HTTP 500`
   - `[DataJud] 📖 Enviando instruções de consulta manual`

### Via Terminal (se tiver acesso)

```bash
# Ver logs em tempo real
tail -f /home/ubuntu/julia-whatsapp-assistant/logs/server.log

# Buscar logs de consulta DataJud
grep "DataJud" /home/ubuntu/julia-whatsapp-assistant/logs/server.log
```

## ✅ Critérios de Sucesso

O teste é considerado **APROVADO** se:

1. ✅ Jul.IA responde em até 5 segundos
2. ✅ Identifica corretamente o tribunal pelo número CNJ
3. ✅ Envia instruções de consulta manual quando API falhar
4. ✅ Instruções estão corretas e completas
5. ✅ Links funcionam corretamente
6. ✅ Linguagem é simples e acessível

## 🐛 Problemas Conhecidos

### Jul.IA não responde

**Causa:** Credenciais GTI-API erradas ou webhook não configurado

**Solução:** Ver `CORRECAO_CREDENCIAIS_GTI.md`

### Jul.IA responde mas não consulta processo

**Causa:** IA não detectou que é uma consulta de processo

**Solução:** Usar palavras-chave como "consultar processo", "andamento", "como está meu processo"

### API DataJud retorna erro 500

**Causa:** API no Railway está com problema (falta de credenciais ou código com bug)

**Solução:** Verificar logs no Railway (ver `VERIFICACAO_LOGS_RAILWAY.md`)

## 📝 Registro de Testes

| Data | Cenário | Resultado | Observações |
|------|---------|-----------|-------------|
| 23/11 | Cenário 1 (SP) | ⏳ Pendente | Aguardando correção credenciais |
| 23/11 | Cenário 2 (PR) | ⏳ Pendente | Aguardando correção credenciais |
| 23/11 | Cenário 3 (MG) | ⏳ Pendente | Aguardando correção credenciais |
| 23/11 | Cenário 4 (Inválido) | ⏳ Pendente | Aguardando correção credenciais |

---

**Atualizado em:** 23/11/2025
**Status:** 📋 Pronto para execução após correção das credenciais
