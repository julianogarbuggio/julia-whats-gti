/**
 * Validador de Respostas Anti-Alucinação
 * 
 * Detecta e bloqueia respostas com informações inventadas/incorretas
 */

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  correctedResponse?: string;
}

/**
 * Lista de padrões que indicam alucinação
 */
const HALLUCINATION_PATTERNS = [
  // Endereços incorretos
  { pattern: /curitiba/gi, error: "Mencionou Curitiba como localização do escritório" },
  { pattern: /paran[aá]\s+(como|onde|localiza)/gi, error: "Sugeriu que escritório fica no Paraná" },
  
  // Valores/números inventados (sem contexto)
  { pattern: /R\$\s*\d+[.,]\d+\s*(mil|milh[õo]es)?(?!\s*(que|do|de|em))/gi, error: "Inventou valores monetários específicos" },
  
  // Prazos inventados
  { pattern: /(\d+)\s*(dias?|meses?|anos?)\s+para\s+(receber|ganhar|processar)/gi, error: "Inventou prazos específicos" },
  
  // Garantias não autorizadas
  { pattern: /(garanto|com certeza vai|100%\s+de\s+chance|definitivamente vai)/gi, error: "Deu garantias não autorizadas" },
];

/**
 * Informações corretas que devem estar presentes
 */
const CORRECT_INFO = {
  endereco: "Av. Paulista, 1636 - Sala 1105/225 - Cerqueira César, São Paulo - SP",
  oabs: "OAB/PR 47.565, OAB/SP 505.598, OAB/MG 234.362",
};

/**
 * Valida resposta da IA para detectar alucinações
 */
export function validateResponse(response: string): ValidationResult {
  const errors: string[] = [];
  
  // 1. Verificar padrões de alucinação
  for (const { pattern, error } of HALLUCINATION_PATTERNS) {
    if (pattern.test(response)) {
      errors.push(error);
    }
  }
  
  // 2. Se mencionou endereço, verificar se está correto
  if (response.toLowerCase().includes("escritório") && 
      response.toLowerCase().includes("fica")) {
    // Se mencionou localização mas não tem "Paulista", é erro
    if (!response.includes("Paulista") && !response.includes("São Paulo")) {
      errors.push("Mencionou localização do escritório mas não citou São Paulo/Paulista");
    }
  }
  
  // 3. Se passou em todas as validações
  if (errors.length === 0) {
    return {
      isValid: true,
      errors: [],
    };
  }
  
  // 4. Resposta inválida - gerar correção
  return {
    isValid: false,
    errors,
    correctedResponse: generateSafeResponse(response, errors),
  };
}

/**
 * Gera resposta segura quando detecta alucinação
 */
function generateSafeResponse(originalResponse: string, errors: string[]): string {
  console.error("[Response Validator] ❌ Alucinação detectada:", errors);
  console.error("[Response Validator] Resposta original:", originalResponse);
  
  // Resposta genérica segura
  return `Desculpa, acho que me confundi um pouco! 😅

Deixa eu te passar para o Dr. Juliano, que vai te dar a informação certinha.

Enquanto isso, pode me contar mais sobre o que você precisa?`;
}

/**
 * Valida e corrige resposta se necessário
 */
export function validateAndCorrect(response: string): string {
  const validation = validateResponse(response);
  
  if (!validation.isValid) {
    console.warn("[Response Validator] ⚠️ Resposta bloqueada por alucinação");
    console.warn("[Response Validator] Erros:", validation.errors);
    return validation.correctedResponse || response;
  }
  
  return response;
}
