# 📖 Documentação de Uso - Sistema de Treinamento

**Como treinar a Jul.IA via WhatsApp**

---

## 🎯 Conceito

O sistema de treinamento permite que você ensine a Jul.IA a responder melhor em situações específicas. Os aprendizados são **universais** - aplicam-se a TODOS os clientes, não apenas um.

---

## 📱 Como Treinar via WhatsApp

### 1. Ativar Modo de Treinamento

Envie do telefone **(44) 99986-9223**:

```
🔧 MODO TREINAMENTO ATIVADO
```

### 2. Escolher Tipo de Treinamento

A Jul.IA vai perguntar:

```
Você quer:

A) Corrigir um erro que a Jul.IA cometeu? (caso REAL)
B) Ensinar um cenário novo? (caso SIMULADO)

Responda A ou B.
```

---

## 🔴 Opção A: Caso REAL (Corrigir Erro)

**Quando usar:** A Jul.IA respondeu errado para um cliente e você quer corrigir.

### Passo a passo:

1. **Você:** `A`

2. **Jul.IA:** `Ok! Me passa o número de celular do cliente (formato: 5511956759223)`

3. **Você:** `5511956759223`

4. **Jul.IA:** Vai buscar a conversa e mostrar as últimas mensagens

5. **Jul.IA:** `Como eu deveria ter respondido?`

6. **Você:** Escreva a resposta correta (exemplo: `Você deveria ter perguntado sobre o banco antes de falar de documentos`)

7. **Jul.IA:** `O que eu devo evitar nesse tipo de situação?`

8. **Você:** Escreva o que evitar (exemplo: `Nunca falar de documentos antes de saber o banco`)

9. **Jul.IA:** Confirma o aprendizado e resume as mudanças

### Exemplo completo:

```
Você: 🔧 MODO TREINAMENTO ATIVADO
Jul.IA: Você quer: A) Corrigir erro ou B) Ensinar cenário novo?

Você: A
Jul.IA: Me passa o número do cliente (5511956759223)

Você: 5511956759223
Jul.IA: [Mostra conversa]
      Como eu deveria ter respondido?

Você: Você deveria ter perguntado sobre o banco antes de falar de documentos
Jul.IA: O que eu devo evitar?

Você: Nunca falar de documentos antes de saber o banco
Jul.IA: ✅ Aprendizado salvo! Agora eu sempre vou perguntar o banco antes de pedir documentos.
```

---

## 🟢 Opção B: Caso SIMULADO (Novo Cenário)

**Quando usar:** Você quer ensinar a Jul.IA a lidar com uma situação que ainda não aconteceu.

### Passo a passo:

1. **Você:** `B`

2. **Jul.IA:** `Descreva o contexto/situação que você quer ensinar`

3. **Você:** Descreva a situação (exemplo: `Cliente pergunta se pode cancelar empréstimo consignado`)

4. **Jul.IA:** `Como eu devo responder nessa situação?`

5. **Você:** Escreva a resposta correta (exemplo: `Explique que consignado não pode ser cancelado, mas pode ser revisado se tiver juros abusivos`)

6. **Jul.IA:** `O que eu devo evitar nessa situação?`

7. **Você:** Escreva o que evitar (exemplo: `Nunca diga que é impossível revisar. Sempre ofereça a revisão como alternativa`)

8. **Jul.IA:** Confirma o aprendizado e resume as mudanças

### Exemplo completo:

```
Você: 🔧 MODO TREINAMENTO ATIVADO
Jul.IA: Você quer: A) Corrigir erro ou B) Ensinar cenário novo?

Você: B
Jul.IA: Descreva o contexto/situação

Você: Cliente pergunta se pode cancelar empréstimo consignado
Jul.IA: Como eu devo responder?

Você: Explique que consignado não pode ser cancelado, mas pode ser revisado se tiver juros abusivos
Jul.IA: O que eu devo evitar?

Você: Nunca diga que é impossível revisar. Sempre ofereça a revisão como alternativa
Jul.IA: ✅ Aprendizado salvo! Agora eu sempre vou oferecer revisão quando cliente perguntar sobre cancelamento.
```

---

## 🔄 Fluxo de Aprovação

Após salvar um aprendizado:

1. **Status inicial:** `pending` (pendente de aprovação)
2. **Você revisa** no Dashboard (Pacote 2) ou via WhatsApp
3. **Você aprova** → Status muda para `active` (ativo)
4. **Jul.IA aplica** automaticamente em conversas futuras

---

## 📊 Como Funciona Internamente

### 1. Palavras-chave

O sistema extrai palavras-chave automaticamente do contexto. Exemplo:

- Contexto: "Cliente pergunta se pode cancelar empréstimo consignado"
- Palavras-chave: `["cancelar", "empréstimo", "consignado"]`

### 2. Busca Inteligente

Quando um cliente escreve algo, a Jul.IA:

1. Busca aprendizados com palavras-chave similares
2. Ordena por prioridade (1-10)
3. Aplica os aprendizados na resposta
4. Incrementa contador de uso

### 3. Aplicação Universal

**IMPORTANTE:** Os aprendizados aplicam-se a TODOS os clientes, não apenas um.

Exemplo:
- Você ensina: "Sempre perguntar o banco antes de pedir documentos"
- Jul.IA aplica: Para TODOS os clientes que mencionarem empréstimo

---

## 🎚️ Prioridade

Você pode definir prioridade de 1 a 10:

- **1-3:** Baixa prioridade (sugestões gerais)
- **4-6:** Média prioridade (boas práticas)
- **7-10:** Alta prioridade (regras obrigatórias)

**Padrão:** 5 (média)

---

## 📈 Métricas de Uso

Cada aprendizado rastreia:

- **timesApplied:** Quantas vezes foi usado
- **lastApplied:** Última vez que foi usado

Isso ajuda a identificar aprendizados mais úteis.

---

## ⚠️ Boas Práticas

### ✅ Faça:

- Seja específico no contexto
- Escreva respostas claras e diretas
- Defina o que evitar claramente
- Use linguagem simples (como fala com cliente)

### ❌ Não faça:

- Criar aprendizados muito genéricos ("sempre seja educado")
- Escrever respostas muito longas (máximo 5 linhas)
- Usar juridiquês ou termos técnicos
- Criar aprendizados contraditórios

---

## 🚨 Atendimento Humano

Se um cliente escrever **"ATENDIMENTO HUMANO"**, a Jul.IA:

1. Notifica automaticamente **(44) 99986-9223**
2. Responde ao cliente: "Estou avisando o Dr. Juliano agora mesmo"
3. Para de responder (aguarda humano assumir)

---

## 📞 Suporte

Qualquer dúvida, consulte os exemplos de teste ou a documentação de integração.
