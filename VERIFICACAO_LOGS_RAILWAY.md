# 🚂 Verificação de Logs da API DataJud no Railway

## 🎯 Objetivo

Identificar a causa do erro 500 (Internal Server Error) na API DataJud hospedada no Railway.

## 📋 Informações da API

**URL:** https://julia-datajud-production.up.railway.app
**Documentação:** https://julia-datajud-production.up.railway.app/docs
**Status Atual:** ⚠️ Online mas retornando erro 500

## 🔍 Como Acessar os Logs

### Passo 1: Acessar Railway Dashboard

1. Acesse: https://railway.app
2. Faça login com sua conta
3. Procure o projeto: **julia-datajud-production**
4. Clique no projeto para abrir

### Passo 2: Visualizar Deployments

1. No dashboard do projeto, procure a aba **Deployments** no menu lateral
2. Clique em **Deployments**
3. Você verá uma lista de deploys realizados
4. O deploy mais recente estará no topo

### Passo 3: Ver Logs do Deploy Ativo

1. Clique no deploy mais recente (geralmente marcado com ✅ ou 🟢)
2. Procure a aba **Logs** ou **View Logs**
3. Os logs aparecerão em tempo real

### Passo 4: Filtrar Erros

Na tela de logs, procure por:

- ❌ **ERROR** - Erros críticos
- ⚠️ **WARNING** - Avisos
- 🔴 **500** - Erros de servidor
- 🔴 **Exception** - Exceções não tratadas
- 🔴 **Traceback** - Stack trace de erros Python

## 🐛 Erros Comuns e Soluções

### Erro 1: Variáveis de Ambiente Faltando

**Sintoma nos logs:**
```
KeyError: 'DATAJUD_API_KEY'
EnvironmentError: DATAJUD_API_KEY not found
```

**Causa:** Credenciais da API DataJud não configuradas

**Solução:**
1. No Railway, vá em **Variables** (menu lateral)
2. Adicione as variáveis necessárias:
   - `DATAJUD_API_KEY`
   - `DATAJUD_USERNAME`
   - `DATAJUD_PASSWORD`
3. Clique em **Deploy** para reiniciar com novas variáveis

### Erro 2: Dependências Não Instaladas

**Sintoma nos logs:**
```
ModuleNotFoundError: No module named 'requests'
ImportError: cannot import name 'FastAPI'
```

**Causa:** Arquivo `requirements.txt` incompleto ou build falhou

**Solução:**
1. Verificar se `requirements.txt` está no repositório
2. Verificar se todas as dependências estão listadas
3. Fazer novo deploy

### Erro 3: Timeout na API DataJud Oficial

**Sintoma nos logs:**
```
requests.exceptions.Timeout: HTTPSConnectionPool
ReadTimeout: The read operation timed out
```

**Causa:** API oficial do DataJud está lenta ou offline

**Solução:**
1. Aumentar timeout nas requisições (ex: 30 segundos)
2. Implementar retry automático
3. Usar fallback (já implementado na Jul.IA)

### Erro 4: Credenciais Inválidas

**Sintoma nos logs:**
```
401 Unauthorized
403 Forbidden
Authentication failed
```

**Causa:** Credenciais da API DataJud expiradas ou inválidas

**Solução:**
1. Verificar credenciais no portal DataJud
2. Renovar token de acesso
3. Atualizar variáveis no Railway

### Erro 5: Rate Limit Excedido

**Sintoma nos logs:**
```
429 Too Many Requests
Rate limit exceeded
```

**Causa:** Muitas requisições em curto período

**Solução:**
1. Implementar cache de consultas
2. Adicionar delay entre requisições
3. Usar fallback quando rate limit for atingido

## 📊 Informações Importantes para Copiar

Ao visualizar os logs, copie:

1. ✅ **Últimas 50 linhas de erro** (para análise completa)
2. ✅ **Stack trace completo** (se houver)
3. ✅ **Timestamp do erro** (para correlacionar com testes)
4. ✅ **Variáveis de ambiente listadas** (sem valores sensíveis)

## 🔧 Como Compartilhar Logs

### Opção 1: Screenshot

1. Tire print da tela de logs
2. Certifique-se de capturar:
   - Timestamp
   - Tipo de erro
   - Mensagem completa
   - Stack trace (se houver)

### Opção 2: Copiar Texto

1. Selecione os logs relevantes
2. Copie (Ctrl+C / Cmd+C)
3. Cole em um arquivo de texto
4. Envie o arquivo

### Opção 3: Export Logs (se disponível)

1. Procure botão **Export** ou **Download**
2. Baixe o arquivo de logs
3. Envie o arquivo completo

## ✅ Checklist de Verificação

Ao analisar os logs, verifique:

- [ ] Aplicação iniciou corretamente?
- [ ] Todas as variáveis de ambiente estão configuradas?
- [ ] Dependências foram instaladas com sucesso?
- [ ] Há erros de conexão com API externa?
- [ ] Há erros de autenticação?
- [ ] Há timeouts?
- [ ] Há erros de código (bugs)?

## 🎯 Próximos Passos Após Ver Logs

Dependendo do erro encontrado:

### Se faltam variáveis de ambiente:
1. Configurar variáveis no Railway
2. Fazer redeploy
3. Testar novamente

### Se há erro de código:
1. Corrigir código localmente
2. Fazer commit e push
3. Railway fará deploy automático

### Se API DataJud oficial está offline:
1. Nada a fazer no Railway
2. Fallback da Jul.IA já está funcionando
3. Monitorar status da API oficial

## 📝 Template de Relatório

Ao compartilhar os logs, use este template:

```
# Logs da API DataJud - Railway

**Data:** [data/hora]
**Deploy ID:** [ID do deploy]
**Status:** [running/crashed/building]

## Erro Principal

[Copiar mensagem de erro principal aqui]

## Stack Trace

[Copiar stack trace completo aqui]

## Variáveis Configuradas

- DATAJUD_API_KEY: [configurada? sim/não]
- DATAJUD_USERNAME: [configurada? sim/não]
- DATAJUD_PASSWORD: [configurada? sim/não]

## Observações

[Qualquer observação adicional]
```

## 🔗 Links Úteis

- Railway Dashboard: https://railway.app
- Documentação Railway: https://docs.railway.app
- API DataJud Docs: https://julia-datajud-production.up.railway.app/docs
- Suporte Railway: https://railway.app/help

---

**Atualizado em:** 23/11/2025
**Status:** 📋 Aguardando verificação pelo usuário
