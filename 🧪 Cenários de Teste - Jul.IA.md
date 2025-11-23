# 🧪 Cenários de Teste - Jul.IA

Guia completo para testar todos os fluxos da Jul.IA e validar o funcionamento.

---

## 📋 Checklist Geral

Antes de começar os testes:
- [ ] Mensagens automáticas do WhatsApp Business desativadas
- [ ] Webhook Z-API configurado e ativo
- [ ] Servidor rodando sem erros
- [ ] Base de conhecimento completa (30+ tópicos)

---

## 🎯 Cenário 1: Novo Lead - Primeiro Contato

**Objetivo:** Validar atendimento inicial e qualificação de lead

### Passo a passo:
1. Envie do seu celular pessoal: **"Oi"**
2. **Resultado esperado:** Jul.IA responde com apresentação e pergunta sobre o tipo de problema

### O que validar:
- ✅ Tom de voz moderno ("você", não "senhor/senhora")
- ✅ Apresentação do Dr. Juliano com 3 OABs
- ✅ Especialização em consignados e RMC/RCC
- ✅ Pergunta sobre tipo de problema
- ✅ Zero juridiquês

### Notificações esperadas:
- ❌ Nenhuma (ainda não pediu atendimento humano)

---

## 🎯 Cenário 2: Cliente com Dúvida sobre Empréstimo

**Objetivo:** Validar conhecimento sobre consignados e RMC/RCC

### Passo a passo:
1. Envie: **"Tenho um desconto no meu INSS que não reconheço"**
2. **Resultado esperado:** Jul.IA mostra empatia e explica que é comum

### O que validar:
- ✅ Frase de empatia: "Isso que você está passando é muito comum..."
- ✅ Explicação sobre vícios de consentimento
- ✅ Pergunta sobre tipo de desconto (INSS/Prefeitura/Empresa)
- ✅ Oferece ajuda para organizar documentos
- ✅ Nunca promete vitória ("pode ter direito", não "tem direito")

### Notificações esperadas:
- ❌ Nenhuma (ainda não pediu atendimento humano)

---

## 🎯 Cenário 3: Pergunta sobre Custos

**Objetivo:** Validar informações sobre honorários e riscos

### Passo a passo:
1. Envie: **"Quanto custa?"**
2. **Resultado esperado:** Jul.IA explica que é gratuito e sem risco

### O que validar:
- ✅ Análise gratuita
- ✅ Sem custo inicial
- ✅ Sem risco se perder
- ✅ Honorários apenas se ganhar (35%/40%/45%)
- ✅ Explicação clara sobre Justiça Gratuita e Juizado

### Notificações esperadas:
- ❌ Nenhuma

---

## 🎯 Cenário 4: Pergunta sobre Chances de Vitória

**Objetivo:** Validar limites éticos (não prometer)

### Passo a passo:
1. Envie: **"Vou ganhar o processo?"**
2. **Resultado esperado:** Jul.IA NÃO promete, encaminha para análise

### O que validar:
- ✅ Nunca diz "você vai ganhar"
- ✅ Sempre diz "pode ter direito" ou "vamos analisar"
- ✅ Menciona estatísticas (70% têm irregularidades) sem prometer
- ✅ Encaminha para análise do Dr. Juliano
- ✅ Frase: "Vou organizar tudo e já encaminho pro Dr. Juliano analisar com calma"

### Notificações esperadas:
- ❌ Nenhuma (não é solicitação de atendimento humano, é dúvida)

---

## 🎯 Cenário 5: Solicitação de Atendimento Humano

**Objetivo:** Validar notificação imediata para o Dr. Juliano

### Passo a passo:
1. Envie: **"Quero falar com o advogado"**
2. **Resultado esperado:** Jul.IA confirma e notifica você

### O que validar:
- ✅ Jul.IA confirma que vai encaminhar
- ✅ Frase: "Vou organizar tudo e já encaminho pro Dr. Juliano analisar com calma"
- ✅ **NOTIFICAÇÃO IMEDIATA** no seu WhatsApp **(44) 99986-9223**
- ✅ Notificação contém: nome do cliente, telefone, motivo, última mensagem

### Notificações esperadas:
- ✅ **WhatsApp (44) 99986-9223** - Notificação imediata de atendimento humano

---

## 🎯 Cenário 6: Envio de Documentos

**Objetivo:** Validar recebimento e encaminhamento de arquivos

### Passo a passo:
1. Envie uma **foto ou PDF** (qualquer arquivo)
2. **Resultado esperado:** Jul.IA confirma recebimento e encaminha

### O que validar:
- ✅ Jul.IA confirma que recebeu
- ✅ Agradece pelo envio
- ✅ Diz que vai encaminhar para o Dr. Juliano
- ✅ **NOTIFICAÇÃO IMEDIATA** (envio de documento = atendimento humano)

### Notificações esperadas:
- ✅ **WhatsApp (44) 99986-9223** - Notificação de documento recebido

---

## 🎯 Cenário 7: Envio de Áudio

**Objetivo:** Validar resposta automática para áudios

### Passo a passo:
1. Envie um **áudio** (qualquer mensagem de voz)
2. **Resultado esperado:** Jul.IA responde que recebeu e pede texto se urgente

### O que validar:
- ✅ Resposta: "Recebi seu áudio e vou encaminhar para o Dr. Juliano. Se for algo urgente, peço que escreva por texto."
- ✅ Tom educado e prestativo
- ✅ Não tenta transcrever (apenas avisa)

### Notificações esperadas:
- ❌ Nenhuma (áudio não é atendimento humano automático)

---

## 🎯 Cenário 8: Despedida e Resumo Automático

**Objetivo:** Validar envio de resumo ao final da conversa

### Passo a passo:
1. Após conversar, envie: **"Obrigado, vou enviar os documentos"**
2. **Resultado esperado:** Jul.IA se despede e envia resumo para você

### O que validar:
- ✅ Jul.IA se despede de forma natural
- ✅ **RESUMO AUTOMÁTICO** enviado para **(11) 95675-9223**
- ✅ Resumo contém: nome, telefone, tipo de solicitação, informações coletadas, próximos passos

### Notificações esperadas:
- ✅ **WhatsApp (11) 95675-9223** - Resumo completo da conversa

---

## 🎯 Cenário 9: Pergunta sobre Cartão RMC/RCC

**Objetivo:** Validar conhecimento específico sobre principal fraude

### Passo a passo:
1. Envie: **"Minha margem está travada por um cartão RMC"**
2. **Resultado esperado:** Jul.IA explica o problema e oferece solução

### O que validar:
- ✅ Explica o que é RMC/RCC
- ✅ Menciona que é a "principal fraude dos últimos anos"
- ✅ Explica que trava margem sem uso
- ✅ Oferece análise para anulação
- ✅ Menciona casos de sucesso (sem prometer)

### Notificações esperadas:
- ❌ Nenhuma

---

## 🎯 Cenário 10: Pergunta Fora do Escopo

**Objetivo:** Validar que Jul.IA sabe seus limites

### Passo a passo:
1. Envie: **"Você faz divórcio?"**
2. **Resultado esperado:** Jul.IA explica que não atende e sugere especialista

### O que validar:
- ✅ Educadamente explica que não atende
- ✅ Reforça especialização (Direito do Consumidor, consignados)
- ✅ Oferece ajuda se for relacionado a empréstimos
- ✅ Não tenta "vender" serviço que não oferece

### Notificações esperadas:
- ❌ Nenhuma

---

## 🎯 Cenário 11: Múltiplas Conversas Simultâneas

**Objetivo:** Validar que Jul.IA mantém contexto separado por cliente

### Passo a passo:
1. Envie mensagem do **celular A**: "Oi, sou João"
2. Envie mensagem do **celular B**: "Oi, sou Maria"
3. Continue conversas alternadas
4. **Resultado esperado:** Jul.IA não confunde os clientes

### O que validar:
- ✅ Contexto separado por telefone
- ✅ Não mistura informações entre clientes
- ✅ Histórico mantido corretamente

### Notificações esperadas:
- Depende das conversas

---

## 🎯 Cenário 12: Cliente Existente Perguntando sobre Processo

**Objetivo:** Validar diferenciação entre "deixou documentos" e "processo protocolado"

### Passo a passo:
1. Envie: **"Como está meu processo?"**
2. **Resultado esperado:** Jul.IA pergunta se já deixou documentos ou se já foi protocolado

### O que validar:
- ✅ Pergunta clara: "Você já deixou os documentos com o Dr. Juliano ou já foi dada entrada no processo?"
- ✅ Explica diferença entre as etapas
- ✅ Menciona prazo de 30-45 dias úteis para protocolo
- ✅ Encaminha para o Dr. Juliano para informações específicas

### Notificações esperadas:
- ✅ **WhatsApp (44) 99986-9223** - Cliente pedindo informações sobre processo

---

## 📊 Resumo de Validação

Após executar todos os cenários, valide:

### Funcionalidades Técnicas:
- [ ] Webhook recebendo mensagens
- [ ] IA respondendo com contexto
- [ ] Histórico mantido entre mensagens
- [ ] Notificações chegando corretamente
- [ ] Resumos enviados ao final
- [ ] Áudios detectados e respondidos

### Personalidade e Tom:
- [ ] Tom moderno ("você", não "senhor/senhora")
- [ ] Frases características do Dr. Juliano
- [ ] Zero juridiquês
- [ ] Empatia e acolhimento
- [ ] Nunca promete vitória

### Conhecimento:
- [ ] Sabe sobre RMC/RCC
- [ ] Explica vícios de consentimento
- [ ] Honorários corretos (35%/40%/45%)
- [ ] Documentos necessários
- [ ] Prazos realistas
- [ ] Limites éticos respeitados

### Conversão:
- [ ] Mostra benefícios concretos
- [ ] Reduz objeções
- [ ] Facilita próximo passo
- [ ] Usa prova social (casos de sucesso)
- [ ] Cria senso de urgência (10 anos)

---

## 🚨 Problemas Comuns e Soluções

### Jul.IA não responde:
- Verificar se webhook Z-API está ativo
- Verificar se servidor está rodando
- Verificar logs em `/tmp/webhook-flow.log`

### Responde sempre a mesma coisa:
- Verificar se base de conhecimento foi carregada
- Verificar se prompt do sistema está correto
- Reiniciar servidor

### Notificações não chegam:
- Verificar números de telefone no código
- Verificar se Z-API tem permissão para enviar
- Testar envio manual via Z-API

### Resumo não é enviado:
- Verificar palavras de despedida
- Adicionar mais variações se necessário
- Verificar logs de detecção

---

## ✅ Checklist Final

Antes de liberar para clientes:
- [ ] Todos os 12 cenários testados
- [ ] Notificações funcionando
- [ ] Resumos chegando
- [ ] Tom de voz aprovado
- [ ] Conhecimento completo
- [ ] Limites éticos respeitados
- [ ] Mensagens automáticas do WhatsApp desativadas
- [ ] Webhook Z-API ativo

**Pronto! Jul.IA está pronta para atender! 🚀**
