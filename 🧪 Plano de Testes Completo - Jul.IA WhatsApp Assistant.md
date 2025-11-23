# 🧪 Plano de Testes Completo - Jul.IA WhatsApp Assistant

**Objetivo:** Validar 100% da funcionalidade do sistema antes da viagem do Dr. Juliano

**Data:** 22/11/2025  
**Status:** Em execução  
**WhatsApp de Teste:** 11 95675-9223 (GTI-API conectado)

---

## 📋 Checklist de Testes

### 1️⃣ FLUXO CONVERSACIONAL BÁSICO

#### Teste 1.1: Primeira Mensagem (Novo Lead)
- [ ] Enviar "Oi" de número desconhecido
- [ ] Verificar se Jul.IA responde com saudação contextual (bom dia/tarde/noite)
- [ ] Verificar se aviso legal aparece APENAS na primeira mensagem
- [ ] Verificar se resposta tem máximo 5 linhas
- [ ] Verificar se lead é criado no banco de dados
- [ ] Verificar se nome do contato é buscado automaticamente (se salvo no WhatsApp)

**Resultado esperado:**
```
Bom dia! 😊

Sou a Jul.IA, assistente do Dr. Juliano Garbuggio. Como vai seu dia?

Você tem algum empréstimo consignado que está pesando no bolso?

⚖️ *Aviso:* Sou assistente virtual. Informações gerais, não consultoria jurídica.
```

---

#### Teste 1.2: Coleta de Dados do Empréstimo
- [ ] Responder "Sim, tenho um consignado"
- [ ] Verificar se Jul.IA pergunta sobre banco
- [ ] Informar banco (ex: "Banco Pan")
- [ ] Verificar se pergunta sobre valor da parcela
- [ ] Informar valor (ex: "R$ 450")
- [ ] Verificar se pergunta sobre número de parcelas
- [ ] Informar parcelas (ex: "96 vezes")
- [ ] Verificar se todas as respostas são curtas e objetivas

**Resultado esperado:**
- Perguntas diretas, uma por vez
- Sem juridiquês
- Tom coloquial e empático
- Máximo 5 linhas por resposta

---

#### Teste 1.3: Qualificação Automática
- [ ] Após fornecer: tipo (consignado) + banco + dados do empréstimo
- [ ] Verificar se lead é marcado como "qualificado" no banco
- [ ] Verificar se Jul.IA envia link do formulário automaticamente
- [ ] Verificar se link é: http://formulario.julianogarbuggio.adv.br/
- [ ] Verificar se orienta preencher "Opção 1 – Revisão de Empréstimos Consignados"

**Resultado esperado:**
```
Ótimo! Vou te passar o link do formulário pra gente agilizar:

📝 http://formulario.julianogarbuggio.adv.br/

Preenche a *Opção 1 – Revisão de Empréstimos Consignados*, tá?

É rapidinho! 😊
```

---

### 2️⃣ FUNCIONALIDADES ESPECIAIS

#### Teste 2.1: Envio de Áudio
- [ ] Enviar mensagem de áudio pelo WhatsApp
- [ ] Verificar se Jul.IA detecta automaticamente
- [ ] Verificar se responde explicando que não pode ouvir
- [ ] Verificar se oferece avisar Dr. Juliano OU pede para escrever

**Resultado esperado:**
```
Recebi seu áudio! 🎤

Infelizmente não consigo ouvir áudios ainda. Você pode:

1️⃣ Escrever aqui que eu te ajudo
2️⃣ Ou posso avisar o Dr. Juliano pra ele te retornar

O que prefere?
```

---

#### Teste 2.2: Envio de Imagem/Documento SEM Legenda
- [ ] Enviar foto de contrato SEM escrever nada
- [ ] Verificar se Jul.IA responde (NÃO pode ficar em silêncio!)
- [ ] Verificar se agradece pelo documento
- [ ] Verificar se lead é qualificado automaticamente

**Resultado esperado:**
```
Recebi seu documento! 📄

Obrigada! Vou encaminhar pro Dr. Juliano analisar.

Você já preencheu o formulário? Se não, te mando o link!
```

---

#### Teste 2.3: Envio de Imagem/Documento COM Legenda
- [ ] Enviar foto de contrato com texto "Aqui está o contrato"
- [ ] Verificar se Jul.IA responde considerando a legenda
- [ ] Verificar se lead é qualificado automaticamente

---

#### Teste 2.4: Cliente Pergunta Sobre Endereço
- [ ] Perguntar "Onde fica o escritório?"
- [ ] Verificar se informa: São Paulo - SP (completo com estado)
- [ ] Verificar se menciona atendimento 100% online em todo o Brasil
- [ ] Verificar se NÃO pergunta "Você está perto de São Paulo?" (pergunta desnecessária)
- [ ] Verificar se mantém foco em qualificar o lead

**Resultado esperado:**
```
Nosso escritório fica em São Paulo - SP, mas atendemos 100% online em todo o Brasil! 🇧🇷

Você tem empréstimo consignado? Posso te ajudar!
```

---

#### Teste 2.5: Cliente Pergunta Sobre Custos
- [ ] Perguntar "Quanto custa?"
- [ ] Verificar se explica honorários: 35%, 40% ou 45% sobre o que recuperar
- [ ] Verificar se reforça: "Se não ganhar nada, não cobro nada"
- [ ] Verificar se explica diferença entre Vara Cível (gratuidade) e JEC

**Resultado esperado:**
```
Você NÃO paga NADA adiantado! 💰

Só cobro se você ganhar:
• 35%, 40% ou 45% do que recuperar

Se não ganhar nada, não cobro nada!

Sobre custos processuais: se você ganha até 3 salários mínimos, é gratuito (Vara Cível). Se ganha mais, vai pro JEC (sem custos, sem risco de pagar honorários pro banco).
```

---

### 3️⃣ INTEGRAÇÃO COM APIS EXTERNAS

#### Teste 3.1: Monitoramento de APIs
- [ ] Verificar logs de monitoramento no servidor
- [ ] Confirmar que health checks estão rodando a cada 5 minutos
- [ ] Verificar status das 4 APIs:
  - GTI-API: https://gti-api.com
  - Z-API: https://api.z-api.io
  - ZapSign: https://api.zapsign.com.br
  - DataJud: https://julia-datajud-production.up.railway.app

**Comando para verificar logs:**
```bash
# Ver logs de monitoramento
grep "API Monitor" /home/ubuntu/julia-whatsapp-assistant/logs/*.log
```

---

#### Teste 3.2: Consulta de Processo (DataJud API)
- [ ] Cliente pergunta: "Como está meu processo?"
- [ ] Verificar se Jul.IA tenta consultar automaticamente no DataJud
- [ ] Se NÃO encontrou: verificar se oferece 2 opções
  - Opção A: "Quer que o Dr. Juliano consulte pra você?"
  - Opção B: "Ou você pode consultar agora mesmo!" (pede número do processo)
- [ ] Cliente fornece número do processo (ex: 0000000-00.0000.8.26.0000)
- [ ] Verificar se identifica tribunal automaticamente (ESAJ-SP)
- [ ] Verificar se envia instruções passo a passo de consulta

**Resultado esperado:**
```
Vou consultar pra você! ⏳

[Se não encontrou]

Não encontrei seu processo cadastrado aqui. Você pode:

A) Quero que o Dr. Juliano consulte pra mim
B) Vou consultar eu mesmo

O que prefere?

[Se cliente escolher B e fornecer número]

📱 *COMO CONSULTAR SEU PROCESSO NO TJSP:*

1️⃣ Entre no site: https://esaj.tjsp.jus.br/cpopg/open.do

2️⃣ Digite o número: 0000000-00.0000.8.26.0000

3️⃣ Clique em "Consultar"

4️⃣ Vai aparecer todas as movimentações

💡 *Dica:* Se aparecer alguma palavra difícil, pode me perguntar!
```

---

#### Teste 3.3: Integração Jul.IA Intimações (Webhook)
- [ ] Verificar se webhook está configurado: https://juliawa-u52rgndc.manus.space/api/webhooks/intimacoes
- [ ] Simular envio de notificação de audiência (via curl)
- [ ] Verificar se Jul.IA envia mensagem automática para o cliente

**Comando de teste:**
```bash
curl -X POST https://juliawa-u52rgndc.manus.space/api/webhooks/intimacoes \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "audiencia",
    "numeroProcesso": "0000000-00.0000.8.26.0000",
    "data": "2025-12-15",
    "horario": "14:00",
    "whatsapp": "5511946003506"
  }'
```

**Resultado esperado:**
Cliente recebe mensagem automática:
```
📅 *AUDIÊNCIA AGENDADA*

Processo: 0000000-00.0000.8.26.0000
Data: 15/12/2025
Horário: 14:00

O Dr. Juliano vai te avisar com antecedência! 😊
```

---

### 4️⃣ CENÁRIOS CRÍTICOS

#### Teste 4.1: Proteção Contra Golpes
- [ ] Cliente menciona: "Recebi ligação de um advogado com sobrenome português"
- [ ] Verificar se Jul.IA alerta sobre golpe do falso advogado
- [ ] Verificar se fornece números oficiais: (11) 95675-9223 e (44) 99986-9223
- [ ] Verificar se fornece CNPJ: 35.142.789/0001-08
- [ ] Verificar se fornece links OAB/SP, OAB/PR, OAB/MG
- [ ] Verificar se notifica Dr. Juliano imediatamente

**Resultado esperado:**
```
⚠️ *ATENÇÃO - GOLPE!*

Se alguém te ligou dizendo ser advogado com sobrenome português (Silva, Santos, etc), é GOLPE! 🚨

Nossos contatos OFICIAIS:
📱 (11) 95675-9223
📱 (44) 99986-9223
🏢 CNPJ: 35.142.789/0001-08

Confira na OAB:
🔗 OAB/SP: [link]
🔗 OAB/PR: [link]
🔗 OAB/MG: [link]

Já avisei o Dr. Juliano! Ele vai te ligar.

Você tem empréstimo consignado? Posso te ajudar de verdade!
```

---

#### Teste 4.2: Empatia Contextual (Cliente Final vs Parceiro)
- [ ] **Cenário A - Cliente Final:** "Estou com dívida de R$ 10.000"
  - Verificar se Jul.IA usa empatia: "Puxa, que chato isso!"
- [ ] **Cenário B - Parceiro Comercial:** "Sou do Jusbrasil, quero discutir parceria"
  - Verificar se Jul.IA responde profissionalmente SEM empatia exagerada

**Resultado esperado A:**
```
Puxa, que chato isso! 😔

Imagino como deve ser difícil ter esse desconto todo mês né?

O Dr. Juliano é especialista nisso! Vamos ver se consegue te ajudar.

Me conta: é empréstimo consignado?
```

**Resultado esperado B:**
```
Olá! Obrigada pelo contato.

Para parcerias comerciais, o ideal é falar direto com o Dr. Juliano:
📱 (11) 95675-9223
📧 juliano@garbuggio.com.br

Posso avisar ele que você entrou em contato!
```

---

#### Teste 4.3: Cliente em Atendimento (Já Enviou Documentos)
- [ ] Cliente que já enviou documentos pergunta: "Quando vai ser atendido?"
- [ ] Verificar se Jul.IA reconhece: "Vi aqui que você já enviou os documentos!"
- [ ] Verificar se pergunta: "Você já enviou TODOS os documentos?"
- [ ] Verificar se apresenta checklist de fases do processo
- [ ] Verificar se explica prazo de 45 dias úteis com carinho
- [ ] Verificar se tranquiliza: "O Dr. Juliano está analisando com muito cuidado"

**Resultado esperado:**
```
Oi [Nome]! Vi aqui que você já enviou os documentos. Que bom! ✅

Você já enviou *todos* os documentos? Contratos, extratos, comprovante de renda?

Seu processo está assim:

📄 Documentos enviados ✅
🔄 Análise em andamento *(você está aqui!)*
⏳ Elaboração da petição
⏳ Protocolo da ação
⏳ Acompanhamento processual

O prazo é até 45 dias úteis. O Dr. Juliano está analisando com muito cuidado pra fazer tudo certinho! 😊
```

---

#### Teste 4.4: Despedida e Resumo Automático
- [ ] Cliente se despede: "Obrigado, valeu!"
- [ ] Verificar se Jul.IA detecta despedida
- [ ] Verificar se gera resumo estruturado da conversa
- [ ] Verificar se envia resumo para Dr. Juliano (44) 99986-9223 automaticamente
- [ ] Verificar se aviso legal aparece NOVAMENTE na despedida

**Resultado esperado para cliente:**
```
Por nada! 😊

Qualquer dúvida, é só chamar!

⚖️ *Aviso:* Sou assistente virtual. Informações gerais, não consultoria jurídica.
```

**Resultado esperado para Dr. Juliano (resumo):**
```
📋 *RESUMO DE ATENDIMENTO*

👤 *João Silva*
📱 https://wa.me/5511946003506

💰 *CASO:*
Consignado - Banco Pan
Parcela: R$ 450,00 (96x)

✅ *STATUS:* Qualificado
📝 *FASE:* Aguardando documentos

📊 *PRÓXIMOS PASSOS:*
- Cliente vai preencher formulário
- Aguardar envio de documentos
```

---

### 5️⃣ TESTES DE ROBUSTEZ

#### Teste 5.1: Múltiplas Mensagens Rápidas
- [ ] Enviar 5 mensagens seguidas rapidamente
- [ ] Verificar se Jul.IA responde TODAS (não pode ignorar nenhuma)
- [ ] Verificar se não há duplicação de respostas

---

#### Teste 5.2: Mensagens Longas
- [ ] Enviar mensagem com 500+ caracteres
- [ ] Verificar se Jul.IA processa corretamente
- [ ] Verificar se resposta continua curta (máximo 5 linhas)

---

#### Teste 5.3: Caracteres Especiais e Emojis
- [ ] Enviar mensagem com emojis: "Olá 😊🎉💰"
- [ ] Verificar se Jul.IA processa normalmente

---

#### Teste 5.4: Números de Telefone em Formatos Diferentes
- [ ] Testar com: (11) 94600-3506
- [ ] Testar com: 11946003506
- [ ] Testar com: +55 11 94600-3506
- [ ] Verificar se sistema normaliza e encontra lead corretamente

---

### 6️⃣ VALIDAÇÃO DO DASHBOARD

#### Teste 6.1: Métricas em Tempo Real
- [ ] Acessar dashboard: https://3000-i9eazc49dkftpwcqj2k2o-d0327918.manusvm.computer
- [ ] Verificar se "Total de Leads" aumenta após criar novo lead
- [ ] Verificar se "Leads Qualificados" aumenta após qualificação
- [ ] Verificar se taxa de qualificação é calculada corretamente

---

#### Teste 6.2: Visualização de Leads
- [ ] Clicar em "Visualizar Leads"
- [ ] Verificar se todos os leads aparecem
- [ ] Verificar se nome do contato está correto (não "Novo Lead")
- [ ] Verificar se status de qualificação está correto
- [ ] Testar busca por nome
- [ ] Testar busca por WhatsApp
- [ ] Testar busca por CPF

---

#### Teste 6.3: Histórico de Conversas
- [ ] Clicar em "Histórico de Conversas"
- [ ] Selecionar um lead
- [ ] Verificar se todas as mensagens aparecem
- [ ] Verificar se ordem está correta (mais recente primeiro)
- [ ] Verificar se horários estão corretos

---

## 📊 Critérios de Sucesso

### ✅ Sistema APROVADO se:
1. **100% das mensagens são respondidas** (nunca fica em silêncio)
2. **Qualificação automática funciona** (consignado + banco + dados = qualificado)
3. **Respostas são curtas** (máximo 5 linhas)
4. **Tom é coloquial e empático** (como Dr. Juliano)
5. **Aviso legal aparece apenas 2x** (primeira mensagem e despedida)
6. **Áudios são detectados** e respondidos adequadamente
7. **Imagens/documentos sem legenda são detectados** e respondidos
8. **Proteção contra golpes funciona** (alerta + números oficiais)
9. **Empatia é contextual** (cliente final vs parceiro)
10. **Monitoramento de APIs está ativo** (health checks a cada 5min)
11. **Dashboard mostra dados corretos** em tempo real
12. **Nomes dos contatos são buscados automaticamente** (não "Novo Lead")

### ❌ Sistema REPROVADO se:
1. Jul.IA fica em silêncio após mensagem do cliente
2. Respostas são muito longas (mais de 5 linhas)
3. Usa juridiquês ou linguagem formal demais
4. Não qualifica leads automaticamente
5. Aviso legal aparece em todas as mensagens
6. Ignora áudios ou documentos sem legenda
7. Não detecta golpes
8. Usa empatia inadequadamente (em conversas comerciais)
9. Dashboard não atualiza em tempo real
10. Monitoramento de APIs não está funcionando

---

## 🚀 Próximos Passos Após Testes

1. **Se APROVADO:**
   - Salvar checkpoint final
   - Criar documentação de uso para Dr. Juliano
   - Preparar deploy redundante (Railway + GitHub)
   - Sistema pronto para operar 24/7 durante viagem

2. **Se REPROVADO:**
   - Identificar problemas específicos
   - Corrigir bugs encontrados
   - Repetir testes até aprovação
   - Salvar checkpoint após correções

---

## 📝 Registro de Testes

**Testador:** Dr. Juliano / Manus IA  
**Data de Início:** 22/11/2025  
**Data de Conclusão:** _____  
**Status Final:** ⏳ Em andamento

**Observações:**
_____________________
_____________________
_____________________
