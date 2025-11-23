# 📋 Análise de Caso Real - Perda de Bagagem (Cesar)

## 🔴 Problemas Identificados

### 1. Mensagens Repetidas (Crítico)
**Sintoma:** Jul.IA envia a mesma mensagem 4-5 vezes consecutivas

**Exemplos:**
```
"Bom dia, Cesar! Que bom te ver de novo! 😊"
"Tudo bem?"
"Seus documentos continuam em análise com o Dr. Juliano..."
```

**Causa:** Sistema não está verificando histórico recente antes de enviar nova mensagem

### 2. Perda de Contexto (Crítico)
**Sintoma:** Jul.IA não lembra informações já fornecidas

**Exemplos:**
- Cliente já enviou formulário completo → Jul.IA pergunta dados novamente
- Cliente já enviou documentos → Jul.IA pergunta "você conseguiu me enviar tudo?"
- Cliente mencionou PERDA DE BAGAGEM → Jul.IA pergunta sobre empréstimo consignado

### 3. Não Detecta Tipo de Caso (Crítico)
**Sintoma:** Jul.IA insiste em empréstimo mesmo após cliente informar outro caso

**Fluxo real:**
1. Cliente preenche formulário
2. Jul.IA pergunta: "Você está tendo problemas com: 1. Empréstimo Consignado? 2. Cartão RMC/RCC? 3. Outro problema de Direito do Consumidor?"
3. Cliente responde: "perfeito, pode mandar. viajamos em 5 pessoas..." (contexto de viagem)
4. Cliente envia documento "LOST LUGGAGE WE$/LATAM" (PERDA DE BAGAGEM)
5. **Jul.IA continua perguntando sobre empréstimo**

### 4. Mensagens Genéricas Após Contexto Específico
**Sintoma:** Jul.IA envia mensagens genéricas ignorando contexto

**Exemplo:**
- Cliente fala sobre viagem em família
- Jul.IA responde: "Puxa, Cesar, parece que essa mensagem não era pra mim, hein? 😂"
- **Correto seria:** Reconhecer que é caso de PERDA DE BAGAGEM e pedir documentos específicos

## ✅ O Que Funcionou Bem

1. ✅ Jul.IA reconheceu que Dr. Juliano é especialista em Direito do Consumidor
2. ✅ Jul.IA mencionou análise contra companhia aérea
3. ✅ Jul.IA foi educada e empática

## 🎯 Correções Necessárias

### Correção 1: Sistema Anti-Repetição
**Implementar:** Verificar últimas 3 mensagens antes de enviar nova

```typescript
// Antes de enviar mensagem
const ultimasMensagens = await buscarUltimas3Mensagens(leadId);
const mensagemJaEnviada = ultimasMensagens.some(m => 
  similaridade(m.texto, novaMensagem) > 0.8
);

if (mensagemJaEnviada) {
  // NÃO enviar mensagem repetida
  return;
}
```

### Correção 2: Detecção Automática de Tipo de Caso
**Implementar:** Detectar palavras-chave e atualizar contexto

```typescript
const tiposCaso = {
  perdaBagagem: ['bagagem', 'mala', 'lost luggage', 'extravio', 'PIR'],
  atrasoVoo: ['atraso', 'voo', 'cancelamento', 'overbooking'],
  inscricaoIndevida: ['serasa', 'spc', 'protesto', 'nome sujo'],
  emprestimoConsignado: ['consignado', 'inss', 'margem', 'empréstimo']
};

// Quando cliente menciona palavras-chave
if (mensagemCliente.includes('bagagem') || mensagemCliente.includes('lost luggage')) {
  lead.tipoCaso = 'perdaBagagem';
  // ESQUECER empréstimo consignado
  // FOCAR em perda de bagagem
}
```

### Correção 3: Memória de Contexto
**Implementar:** Salvar e consultar informações já fornecidas

```typescript
interface ContextoLead {
  formularioPreenchido: boolean;
  documentosEnviados: string[];
  tipoCaso: string;
  ultimaInteracao: Date;
}

// Antes de perguntar algo
if (contexto.formularioPreenchido) {
  // NÃO perguntar dados pessoais novamente
}

if (contexto.documentosEnviados.length > 0) {
  // NÃO perguntar "você conseguiu enviar documentos?"
}
```

### Correção 4: Resposta Específica ao Receber Formulário
**Implementar:** Detectar webhook do formulário e enviar mensagem específica

```typescript
// Quando receber webhook do formulário
if (webhook.tipo === 'formulario_preenchido') {
  await enviarMensagem({
    texto: `📬 Recebido!

Acabei de receber seus dados do formulário 🙌
Logo mais você vai receber a procuração e demais documentos pra assinar, e assim já começamos a trabalhar no seu caso ⚖️`,
    leadId: webhook.leadId
  });
  
  // Atualizar contexto
  lead.formularioPreenchido = true;
}
```

### Correção 5: Fluxo Diferenciado por Tipo de Caso
**Implementar:** Pedir documentos específicos conforme tipo de caso

```typescript
const documentosPorTipo = {
  perdaBagagem: [
    'Passagem aérea (bilhete)',
    'Relatório PIR (Property Irregularity Report)',
    'Reclamação no Reclame Aqui ou Procon (se houver)',
    'Fotos da bagagem danificada (se aplicável)',
    'Comprovantes de compras emergenciais (se houver)'
  ],
  
  atrasoVoo: [
    'Passagem aérea (bilhete)',
    'Comprovante de embarque (boarding pass)',
    'Declaração da companhia sobre o atraso',
    'Comprovantes de despesas extras (hotel, alimentação)',
    'Reclamação no Reclame Aqui ou Procon (se houver)'
  ],
  
  inscricaoIndevida: [
    'Certidão do SERASA/SPC/PROTESTO atual (últimos 30 dias)',
    'Comprovante de pagamento (se já pagou)',
    'Boletim de Ocorrência (se for fraude)',
    'Documentos que provem a irregularidade'
  ],
  
  emprestimoConsignado: [
    'Extrato dos empréstimos (Meu INSS) ou contracheques',
    'RG/CPF, comprovante de residência',
    'Login do consumidor.gov.br (GOV.BR)'
  ]
};

// Quando pedir documentos
const docs = documentosPorTipo[lead.tipoCaso] || documentosPorTipo.emprestimoConsignado;
await enviarMensagem({
  texto: `💼 Documentos necessários:

${docs.map((d, i) => `${i + 1}. ${d}`).join('\n')}

Pode me enviar aqui mesmo pelo WhatsApp! 📎`,
  leadId: lead.id
});
```

## 📝 Fluxo Ideal para Perda de Bagagem

### Passo 1: Cliente menciona perda de bagagem
**Jul.IA detecta automaticamente:**
```
Entendi! Seu caso é sobre perda/extravio de bagagem, certo?

Vou te ajudar com isso! 🧳

Primeiro, preciso que você preencha este formulário rápido:

👉 Preencha a opção 1 do formulário abaixo e comece agora

http://formulario.julianogarbuggio.adv.br/
```

### Passo 2: Cliente preenche formulário
**Jul.IA recebe webhook e responde:**
```
📬 Recebido!

Acabei de receber seus dados do formulário 🙌
Logo mais você vai receber a procuração e demais documentos pra assinar, e assim já começamos a trabalhar no seu caso ⚖️
```

### Passo 3: Cliente assina procuração
**Jul.IA pede documentos específicos:**
```
💼 Documentos necessários para o seu caso de PERDA DE BAGAGEM:

1. Passagem aérea (bilhete)
2. Relatório PIR (Property Irregularity Report) - se tiver
3. Reclamação no Reclame Aqui ou Procon (se fez)
4. Fotos da bagagem (se aplicável)
5. RG/CPF e comprovante de residência

Pode me enviar aqui mesmo pelo WhatsApp! 📎
```

### Passo 4: Cliente envia documentos
**Jul.IA confirma recebimento:**
```
✅ Documentos recebidos!

Já encaminhei tudo para o Dr. Juliano analisar.

Ele vai verificar a viabilidade do seu caso contra a companhia aérea e te dará um retorno em breve.

Pode levar até 45 dias úteis para garantir que nada passe despercebido! 📋

Assim que tivermos uma posição, eu te aviso aqui. Fica tranquilo! 😊
```

## 🚀 Implementação

### Prioridade 1 (Urgente)
- [ ] Sistema anti-repetição de mensagens
- [ ] Detecção automática de tipo de caso
- [ ] Memória de contexto (formulário preenchido, documentos enviados)

### Prioridade 2 (Importante)
- [ ] Resposta específica ao receber formulário
- [ ] Fluxo diferenciado por tipo de caso
- [ ] Lista de documentos específicos por tipo

### Prioridade 3 (Desejável)
- [ ] Integração com ZapSign para detectar assinatura automática
- [ ] Notificação automática quando Dr. Juliano analisar
- [ ] Follow-up automático após 7 dias

## 📊 Métricas de Sucesso

**Antes:**
- ❌ 5 mensagens repetidas
- ❌ Cliente confuso
- ❌ Não detectou tipo de caso

**Depois (esperado):**
- ✅ 0 mensagens repetidas
- ✅ Cliente satisfeito
- ✅ Tipo de caso detectado automaticamente
- ✅ Documentos corretos solicitados
- ✅ Fluxo completo sem intervenção manual

---

**Data:** 23/11/2025
**Status:** 🔴 Crítico - Implementação urgente necessária
