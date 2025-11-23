# 🧪 Exemplos de Teste - Sistema de Treinamento

**Como testar o sistema de treinamento**

---

## 📋 Pré-requisitos

- Sistema integrado conforme `INSTRUCOES_INTEGRACAO.md`
- Servidor rodando
- Acesso ao WhatsApp **(44) 99986-9223**
- Acesso a outro WhatsApp para simular cliente

---

## ✅ Teste 1: Ativar Modo de Treinamento

### Objetivo:
Verificar se o comando de treinamento é detectado corretamente.

### Passos:

1. **Envie do (44) 99986-9223:**
   ```
   🔧 MODO TREINAMENTO ATIVADO
   ```

2. **Resultado esperado:**
   ```
   🔧 MODO TREINAMENTO ATIVADO

   Você quer:

   A) Corrigir um erro que a Jul.IA cometeu? (caso REAL)
   B) Ensinar um cenário novo? (caso SIMULADO)

   Responda A ou B.
   ```

### ✅ Passou?
- [ ] Sim
- [ ] Não (descreva o erro)

---

## ✅ Teste 2: Caso REAL (Corrigir Erro)

### Objetivo:
Treinar a Jul.IA para corrigir um erro em uma conversa real.

### Passos:

1. **Simule uma conversa com erro:**
   - Use outro WhatsApp
   - Envie: "Oi, tenho um empréstimo"
   - Jul.IA responde (anote a resposta)

2. **Ative treinamento do (44) 99986-9223:**
   ```
   🔧 MODO TREINAMENTO ATIVADO
   ```

3. **Escolha opção A:**
   ```
   A
   ```

4. **Informe o número do cliente:**
   ```
   5511999999999
   ```
   (substitua pelo número real usado no passo 1)

5. **Jul.IA mostra a conversa e pergunta:**
   ```
   Como eu deveria ter respondido?
   ```

6. **Você responde:**
   ```
   Você deveria ter perguntado qual banco antes de qualquer coisa
   ```

7. **Jul.IA pergunta:**
   ```
   O que eu devo evitar nesse tipo de situação?
   ```

8. **Você responde:**
   ```
   Nunca falar de documentos ou valores antes de saber o banco
   ```

9. **Jul.IA confirma:**
   ```
   ✅ Aprendizado salvo! Resumo:
   - Contexto: [mostra contexto]
   - Resposta correta: Perguntar banco primeiro
   - Evitar: Falar de documentos antes do banco
   - Palavras-chave: ["empréstimo", "banco", "documentos"]
   ```

### ✅ Passou?
- [ ] Sim
- [ ] Não (descreva o erro)

---

## ✅ Teste 3: Caso SIMULADO (Novo Cenário)

### Objetivo:
Ensinar a Jul.IA a lidar com uma situação nova.

### Passos:

1. **Ative treinamento do (44) 99986-9223:**
   ```
   🔧 MODO TREINAMENTO ATIVADO
   ```

2. **Escolha opção B:**
   ```
   B
   ```

3. **Jul.IA pergunta:**
   ```
   Descreva o contexto/situação que você quer ensinar
   ```

4. **Você responde:**
   ```
   Cliente pergunta se pode cancelar empréstimo consignado
   ```

5. **Jul.IA pergunta:**
   ```
   Como eu devo responder nessa situação?
   ```

6. **Você responde:**
   ```
   Explique que consignado não pode ser cancelado, mas pode ser revisado se tiver juros abusivos. Ofereça revisar o contrato.
   ```

7. **Jul.IA pergunta:**
   ```
   O que eu devo evitar nessa situação?
   ```

8. **Você responde:**
   ```
   Nunca diga que é impossível fazer nada. Sempre ofereça a revisão como alternativa.
   ```

9. **Jul.IA confirma:**
   ```
   ✅ Aprendizado salvo! Resumo:
   - Contexto: Cliente pergunta se pode cancelar empréstimo consignado
   - Resposta correta: Explicar que não pode cancelar, mas pode revisar
   - Evitar: Dizer que é impossível fazer nada
   - Palavras-chave: ["cancelar", "empréstimo", "consignado"]
   ```

### ✅ Passou?
- [ ] Sim
- [ ] Não (descreva o erro)

---

## ✅ Teste 4: Aplicação Automática do Aprendizado

### Objetivo:
Verificar se a Jul.IA aplica o aprendizado em conversas futuras.

### Passos:

1. **Simule uma conversa de outro WhatsApp:**
   ```
   Oi, posso cancelar meu empréstimo consignado?
   ```

2. **Resultado esperado:**
   Jul.IA deve responder algo como:
   ```
   Olá! O empréstimo consignado não pode ser cancelado, mas posso te ajudar a revisar o contrato se tiver juros abusivos. Quer que eu analise?
   ```

3. **Verifique se a resposta:**
   - [ ] Explica que não pode cancelar
   - [ ] Oferece revisão como alternativa
   - [ ] NÃO diz que é impossível fazer nada

### ✅ Passou?
- [ ] Sim
- [ ] Não (descreva o erro)

---

## ✅ Teste 5: Detecção de ATENDIMENTO HUMANO

### Objetivo:
Verificar se a Jul.IA detecta solicitação de atendimento humano.

### Passos:

1. **Simule conversa de outro WhatsApp:**
   ```
   ATENDIMENTO HUMANO
   ```

2. **Resultado esperado:**
   - Jul.IA responde:
     ```
     ✅ Entendi! Estou avisando o Dr. Juliano agora mesmo.
     
     Ele vai entrar em contato com você o mais rápido possível. 📱
     ```
   - **(44) 99986-9223** recebe notificação:
     ```
     🚨 ATENDIMENTO HUMANO SOLICITADO
     
     Cliente: [Nome]
     Telefone: [Número]
     
     Última mensagem: ATENDIMENTO HUMANO
     ```

### ✅ Passou?
- [ ] Sim
- [ ] Não (descreva o erro)

---

## ✅ Teste 6: Aviso de IA em Desenvolvimento

### Objetivo:
Verificar se a primeira mensagem inclui aviso sobre fase de aprendizado.

### Passos:

1. **Simule conversa de novo WhatsApp (nunca conversou antes):**
   ```
   Oi
   ```

2. **Resultado esperado:**
   ```
   Boa [tarde/noite]! Sou a Jul.IA, assistente virtual do Dr. Juliano Garbuggio. 🤖
   
   ⚠️ Aviso: Estou em fase de aprendizado! Posso cometer erros. Se preferir, escreva "ATENDIMENTO HUMANO" a qualquer momento.
   
   Como posso te ajudar hoje?
   ```

### ✅ Passou?
- [ ] Sim
- [ ] Não (descreva o erro)

---

## ✅ Teste 7: Busca de Aprendizados por Palavras-chave

### Objetivo:
Verificar se a Jul.IA busca aprendizados relevantes automaticamente.

### Pré-requisito:
Ter criado o aprendizado do Teste 3 (cancelar consignado).

### Passos:

1. **Simule conversa de outro WhatsApp:**
   ```
   Quero cancelar meu consignado
   ```

2. **Resultado esperado:**
   Jul.IA deve aplicar o aprendizado criado no Teste 3.

3. **Verifique no banco de dados:**
   ```sql
   SELECT * FROM ai_learning WHERE id = [ID do aprendizado do Teste 3];
   ```

4. **Campos esperados:**
   - `times_applied`: deve ter incrementado (+1)
   - `last_applied`: deve ter timestamp recente

### ✅ Passou?
- [ ] Sim
- [ ] Não (descreva o erro)

---

## 📊 Checklist Completo

- [ ] Teste 1: Ativar Modo de Treinamento
- [ ] Teste 2: Caso REAL (Corrigir Erro)
- [ ] Teste 3: Caso SIMULADO (Novo Cenário)
- [ ] Teste 4: Aplicação Automática do Aprendizado
- [ ] Teste 5: Detecção de ATENDIMENTO HUMANO
- [ ] Teste 6: Aviso de IA em Desenvolvimento
- [ ] Teste 7: Busca de Aprendizados por Palavras-chave

---

## 🐛 Problemas Comuns

### Problema 1: Comando de treinamento não detectado

**Causa:** Telefone não é (44) 99986-9223  
**Solução:** Verifique se está enviando do telefone correto

### Problema 2: Aprendizado não aplicado

**Causa:** Palavras-chave não correspondem  
**Solução:** Revise as palavras-chave extraídas no banco de dados

### Problema 3: ATENDIMENTO HUMANO não notifica

**Causa:** Integração no webhook não implementada  
**Solução:** Revise `INSTRUCOES_INTEGRACAO.md` seção 5

### Problema 4: Aviso de IA não aparece

**Causa:** Função `getGreeting()` não atualizada  
**Solução:** Revise `INSTRUCOES_INTEGRACAO.md` seção 7

---

## 📞 Suporte

Se algum teste falhar, revise:
1. `INSTRUCOES_INTEGRACAO.md` (integração completa?)
2. Logs do servidor (erros?)
3. Banco de dados (tabela criada?)

---

## ✅ Resultado Final

**Total de testes:** 7  
**Testes passados:** ___  
**Testes falhados:** ___  

**Status:** [ ] Pronto para produção [ ] Precisa correções
