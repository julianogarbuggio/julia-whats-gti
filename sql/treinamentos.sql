-- ============================================
-- TREINAMENTOS JUL.IA - PACOTE 3
-- ============================================
-- Data: 23/11/2025
-- Versão: 1.0
-- ============================================

-- 1. DETECÇÃO DE EDIFÍCIO ITÁPOLIS
-- ============================================
INSERT INTO ai_learning (
  type,
  context,
  correct_response,
  avoid_response,
  keywords,
  priority,
  notes,
  trained_by,
  status,
  ativo,
  created_at,
  updated_at
) VALUES (
  'simulated',
  'Cliente mencionando Edifício Itápolis ou condomínio',
  'Oi! Vi que você mencionou o Edifício Itápolis. 🏢

Aproveitando o contato: o escritório do Dr. Juliano Garbuggio atua em todas as áreas do Direito do Consumidor (empréstimos, cartões, negativação, problemas com empresas) e também em outras áreas do Direito.

Se você precisar de alguma orientação jurídica, estou à disposição! 😊

Mas se o seu caso for só sobre o condomínio Itápolis, me avise que eu já chamo ele pra te atender.',
  'NUNCA: Ignorar menção ao Itápolis, pular divulgação do escritório, não perguntar se é só sobre condomínio',
  '["itápolis", "edifício itápolis", "condomínio itápolis", "síndico", "prédio itápolis", "condominio", "edificio", "itapolis"]',
  10,
  'Detectar automaticamente menções ao Edifício Itápolis. Dr. Juliano é síndico. Se caso for APENAS sobre condomínio, notificar (44) 99986-9223.',
  '5544999869223',
  'approved',
  1,
  NOW(),
  NOW()
);

-- 2. CONSULTA DE ANDAMENTO PROCESSUAL VIA DATAJUD
-- ============================================
INSERT INTO ai_learning (
  type,
  context,
  correct_response,
  avoid_response,
  keywords,
  priority,
  notes,
  trained_by,
  status,
  ativo,
  created_at,
  updated_at
) VALUES (
  'simulated',
  'Cliente perguntando sobre andamento de processo',
  'Quando cliente perguntar sobre andamento processual:

1️⃣ Pedir NOME COMPLETO
2️⃣ Pedir CPF (formato: 123.456.789-00)
3️⃣ Pedir NÚMERO DO PROCESSO

LÓGICA DE CONSULTA:

📌 SE TIVER NÚMERO DO PROCESSO:
- Consultar diretamente no DataJud
- Mostrar resultado único
- Pronto!

📌 SE NÃO TIVER NÚMERO (só nome + CPF):
- Consultar por nome/CPF no DataJud
- ATENÇÃO: Podem aparecer VÁRIOS processos
- Listar todos os processos encontrados
- Perguntar: "Qual desses processos é do Dr. Juliano que você quer saber?"
- Cliente escolhe → mostrar detalhes

📌 SE NÃO ENCONTRAR NADA:
- Chamar advogado IMEDIATAMENTE
- Notificar (44) 99986-9223
- Mensagem: "Não encontrei seu processo no sistema. Vou chamar o Dr. Juliano para te ajudar!"

Exemplo de resposta quando encontrar múltiplos:
"Encontrei 3 processos com seus dados:

1️⃣ Processo 0001234-56.2023.8.16.0001 - Ação de Cobrança
2️⃣ Processo 0007890-12.2024.8.16.0002 - Revisional de Contrato
3️⃣ Processo 0003456-78.2024.8.16.0003 - Indenização

Qual desses é o processo do Dr. Juliano que você quer saber?"',
  'NUNCA: Inventar andamento de processo, prometer vitória ("você vai ganhar"), dar consulta sem pedir dados (nome + CPF mínimo), dizer que não consegue consultar sem tentar, questionar o ano do processo antes de consultar, pedir para conferir número antes de tentar',
  '["andamento", "processo", "ação", "consultar processo", "como está meu processo", "movimentação processual", "tribunal", "andamento processual", "meu processo", "processo judicial"]',
  9,
  'Integração DataJud já implementada. Sistema consulta automaticamente quando detecta número CNJ. Fallback para instruções manuais se API falhar. Tribunais suportados: TJPR, TJSP, TJMG.',
  '5544999869223',
  'approved',
  1,
  NOW(),
  NOW()
);

-- ============================================
-- FIM DOS TREINAMENTOS
-- ============================================

-- VERIFICAÇÃO
-- Execute para confirmar que os treinamentos foram adicionados:
SELECT id, context, status, priority, created_at 
FROM ai_learning 
WHERE context IN (
  'Cliente mencionando Edifício Itápolis ou condomínio',
  'Cliente perguntando sobre andamento de processo'
)
ORDER BY created_at DESC;
