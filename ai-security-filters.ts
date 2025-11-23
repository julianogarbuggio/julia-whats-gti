/**
 * Filtros de Segurança Jurídica para Jul.IA
 * 
 * Baseado em análise de caso real: IA Mercado Livre (Novembro 2025)
 * 
 * OBJETIVO: Garantir que a IA NUNCA:
 * 1. Dê consultas jurídicas
 * 2. Reconheça culpa de terceiros
 * 3. Oriente procedimentos legais específicos
 * 4. Analise casos concretos
 * 5. Garanta resultados
 * 6. Ofereça modelos ou redija documentos
 */

import { getDb } from '../db';
import { aiSecurityLogs } from '../../drizzle/schema';

// ============================================================================
// PALAVRAS E FRASES PROIBIDAS
// ============================================================================

export const PALAVRAS_PROIBIDAS_JURIDICAS = [
  // Reconhecimento de direitos
  'você tem direito', 'está garantido', 'lei garante', 'cdc garante',
  'pode exigir', 'deve receber', 'tem que pagar', 'direito garantido',
  
  // Análise de viabilidade
  'você vai ganhar', 'tem chances', 'é viável processar', 'vale a pena processar',
  'com certeza ganha', 'dificilmente perde', 'vai ganhar', 'chances de ganhar',
  
  // Reconhecimento de ilegalidade/culpa
  'isso é ilegal', 'é abusivo', 'é irregular', 'houve fraude',
  'caracteriza crime', 'é má-fé', 'má fé', 'empresa errou',
  'banco errou', 'cobrou indevidamente', 'você foi prejudicado',
  'houve prejuízo', 'você tem razão', 'está certo',
  
  // Orientação processual
  'você deve processar', 'acione o procon', 'faça boletim',
  'entre com ação', 'processe', 'denuncie', 'abra reclamação',
  'recomendo processar', 'sugiro processar', 'vá ao procon',
  
  // Consultoria jurídica
  'no seu caso específico', 'analisando sua situação',
  'pela lei', 'segundo o cdc', 'conforme jurisprudência',
  'a lei determina', 'o código prevê', 'está previsto em lei',
  'você pode processar', 'tem direito a indenização',
  
  // Redação de documentos
  'posso redigir', 'vou escrever', 'use este modelo',
  'copie isso', 'faça assim', 'escreva dessa forma',
  'modelo de reclamação', 'texto para o procon',
  
  // Garantias de resultado
  'vai funcionar', 'com certeza resolve', 'garanto que',
  'você vai conseguir', 'não tem como perder'
];

export const FRASES_SEGURAS_SUBSTITUTAS = [
  'Vou encaminhar para o Dr. Juliano analisar',
  'O advogado vai avaliar a viabilidade do seu caso',
  'Isso precisa de análise jurídica profissional',
  'Recomendo consultar o Dr. Juliano sobre isso',
  'Cada caso é único e precisa de avaliação especializada',
  'Vou registrar essas informações para análise do advogado',
  'O escritório vai verificar os detalhes do seu caso',
  'Essa é uma questão que requer orientação jurídica especializada'
];

export const DISCLAIMER_LEGAL = `

⚠️ *Aviso Legal:* Sou uma assistente de triagem. Esta resposta tem caráter informativo e não substitui a orientação de um advogado. O Dr. Juliano Garbuggio fará a análise oficial do seu caso.`;

// ============================================================================
// FUNÇÕES DE DETECÇÃO
// ============================================================================

/**
 * Verifica se o texto contém palavras ou frases proibidas
 */
export function contemPalavrasProibidas(texto: string): {
  contem: boolean;
  palavrasEncontradas: string[];
} {
  const textoLower = texto.toLowerCase();
  const palavrasEncontradas: string[] = [];
  
  for (const palavra of PALAVRAS_PROIBIDAS_JURIDICAS) {
    if (textoLower.includes(palavra.toLowerCase())) {
      palavrasEncontradas.push(palavra);
    }
  }
  
  return {
    contem: palavrasEncontradas.length > 0,
    palavrasEncontradas
  };
}

/**
 * Verifica se o texto contém tom de certeza jurídica absoluta
 */
export function contemCertezaJuridica(texto: string): boolean {
  const padroesCerteza = [
    /com certeza (você|vc) (vai|tem|pode)/i,
    /definitivamente (é|está|tem)/i,
    /sem dúvida (você|vc) (vai|tem|pode)/i,
    /obviamente (é|está|tem)/i,
    /claramente (é|está|houve)/i,
    /não há dúvida (de )?que/i,
    /tenho certeza que/i
  ];
  
  return padroesCerteza.some(padrao => padrao.test(texto));
}

/**
 * Verifica se o texto reconhece culpa de terceiros
 */
export function reconheceCulpa(texto: string): boolean {
  const padroesReconhecimentoCulpa = [
    /(empresa|banco|vendedor|instituição) (errou|falhou|agiu de má fé)/i,
    /houve (má fé|fraude|irregularidade|ilegalidade)/i,
    /(você|vc) (foi|está sendo) (prejudicado|lesado|enganado)/i,
    /isso (é|foi) (ilegal|abusivo|irregular|fraudulento)/i,
    /(cobraram|cobrança) (indevida|abusiva|ilegal)/i,
    /você tem razão/i,
    /você está certo/i
  ];
  
  return padroesReconhecimentoCulpa.some(padrao => padrao.test(texto));
}

/**
 * Verifica se o texto orienta procedimentos legais
 */
export function orientaProcesso(texto: string): boolean {
  const padroesOrientacaoProcessual = [
    /(você deve|recomendo|sugiro) (processar|acionar|denunciar)/i,
    /(entre|abra) (com )?(ação|processo|reclamação)/i,
    /(vá|procure) (ao|o) (procon|juizado|delegacia)/i,
    /faça (um )?(boletim|b\.o\.|registro)/i,
    /(pode|deve) (processar|acionar|reclamar)/i
  ];
  
  return padroesOrientacaoProcessual.some(padrao => padrao.test(texto));
}

// ============================================================================
// VALIDAÇÃO DE RESPOSTA
// ============================================================================

export interface ValidacaoResposta {
  segura: boolean;
  motivo?: string;
  palavrasProibidas?: string[];
  respostaAlternativa?: string;
  nivelRisco: 'baixo' | 'medio' | 'alto' | 'critico';
}

/**
 * Valida se uma resposta é segura juridicamente
 */
export function validarRespostaSegura(resposta: string): ValidacaoResposta {
  // Nível 1: Verificar palavras proibidas
  const { contem: contemProibidas, palavrasEncontradas } = contemPalavrasProibidas(resposta);
  
  if (contemProibidas) {
    return {
      segura: false,
      motivo: 'Contém palavras ou frases juridicamente perigosas',
      palavrasProibidas: palavrasEncontradas,
      respostaAlternativa: gerarRespostaSegura(),
      nivelRisco: 'alto'
    };
  }
  
  // Nível 2: Verificar certeza jurídica
  if (contemCertezaJuridica(resposta)) {
    return {
      segura: false,
      motivo: 'Contém afirmações jurídicas absolutas',
      respostaAlternativa: gerarRespostaSegura(),
      nivelRisco: 'medio'
    };
  }
  
  // Nível 3: Verificar reconhecimento de culpa
  if (reconheceCulpa(resposta)) {
    return {
      segura: false,
      motivo: 'Reconhece culpa de terceiros',
      respostaAlternativa: gerarRespostaSegura(),
      nivelRisco: 'critico'
    };
  }
  
  // Nível 4: Verificar orientação processual
  if (orientaProcesso(resposta)) {
    return {
      segura: false,
      motivo: 'Orienta procedimentos legais específicos',
      respostaAlternativa: gerarRespostaSegura(),
      nivelRisco: 'critico'
    };
  }
  
  // Resposta segura
  return {
    segura: true,
    nivelRisco: 'baixo'
  };
}

/**
 * Gera uma resposta segura alternativa
 */
function gerarRespostaSegura(): string {
  const respostasSeguras = [
    'Entendi sua situação. Vou encaminhar todas essas informações para o Dr. Juliano Garbuggio, que é especialista em Direito do Consumidor. Ele vai analisar seu caso com atenção e entrar em contato em breve.',
    
    'Obrigado por compartilhar esses detalhes. Esse tipo de situação requer uma análise jurídica profissional. Vou passar tudo para o advogado, que vai avaliar a viabilidade do seu caso.',
    
    'Anotei todas as informações. O Dr. Juliano vai verificar os detalhes e te orientar sobre os próximos passos. Cada caso é único e precisa de avaliação especializada.',
    
    'Compreendo sua preocupação. Vou registrar tudo e encaminhar para análise do advogado. Ele vai te dar uma orientação precisa sobre como proceder.',
    
    'Recebi todas as informações. O escritório vai analisar seu caso e entrar em contato para explicar as opções disponíveis e a melhor estratégia.'
  ];
  
  const respostaAleatoria = respostasSeguras[Math.floor(Math.random() * respostasSeguras.length)];
  return respostaAleatoria + DISCLAIMER_LEGAL;
}

// ============================================================================
// PROMPT GUARDIÃO
// ============================================================================

export const PROMPT_GUARDIAO = `
VOCÊ É JUL.IA - ASSISTENTE DE TRIAGEM DO ESCRITÓRIO JULIANO GARBUGGIO.

⚠️ REGRAS ABSOLUTAS DE SEGURANÇA JURÍDICA:

1. NUNCA reconheça culpa de ninguém (empresa, banco, vendedor)
2. NUNCA dê orientação jurídica ou consultoria
3. NUNCA analise casos concretos com conclusões
4. NUNCA incentive ações legais (processar, acionar Procon, denunciar)
5. NUNCA ofereça modelos ou redija documentos
6. NUNCA confirme que suas orientações são oficiais
7. NUNCA garanta resultados ou chances de vitória
8. NUNCA use termos jurídicos absolutos (é ilegal, é abusivo, houve fraude)

SEMPRE:
- Colete informações objetivamente
- Use linguagem neutra e factual
- Encaminhe para o Dr. Juliano quando necessário
- Lembre que você é apenas triagem, não advogado
- Seja informativa sem ser consultiva
- Eduque genericamente sem analisar casos específicos

SE DETECTAR CONSULTA JURÍDICA:
"Essa é uma questão que precisa de análise do advogado. Vou encaminhar para o Dr. Juliano avaliar seu caso com atenção."

FRASES PROIBIDAS:
- "Você tem direito a..."
- "O CDC garante..."
- "Você pode processar..."
- "Isso é ilegal/abusivo..."
- "Você vai ganhar..."
- "A empresa errou..."
- "Recomendo acionar o Procon..."

FRASES PERMITIDAS:
- "Vou encaminhar para o advogado analisar..."
- "O Dr. Juliano vai avaliar a viabilidade..."
- "Cada caso precisa de análise profissional..."
- "Existem vias administrativas e judiciais disponíveis..."
- "O escritório vai verificar os detalhes..."

LEMBRE-SE: Sua função é QUALIFICAR LEADS e INFORMAR sobre serviços, NÃO dar consultas jurídicas.
`;

// ============================================================================
// LOG DE SEGURANÇA
// ============================================================================

/**
 * Registra tentativa de resposta insegura para auditoria
 */
export async function registrarLogSeguranca(dados: {
  respostaOriginal: string;
  respostaFiltrada: string;
  motivo: string;
  nivelRisco: string;
  palavrasProibidas?: string[];
  leadId?: number;
  conversationId?: number;
}) {
  const db = await getDb();
  if (!db) return;
  
  try {
    await db.insert(aiSecurityLogs).values({
      originalResponse: dados.respostaOriginal,
      filteredResponse: dados.respostaFiltrada,
      reason: dados.motivo,
      riskLevel: dados.nivelRisco,
      prohibitedWords: dados.palavrasProibidas?.join(', ') || null,
      leadId: dados.leadId || null,
      conversationId: dados.conversationId || null,
      createdAt: new Date()
    });
  } catch (error) {
    console.error('[Security Log] Erro ao registrar log:', error);
  }
}

// ============================================================================
// FUNÇÃO PRINCIPAL DE FILTRAGEM
// ============================================================================

/**
 * Filtra e valida uma resposta antes de enviar ao cliente
 */
export async function filtrarResposta(
  resposta: string,
  contexto?: {
    leadId?: number;
    conversationId?: number;
  }
): Promise<string> {
  // Validar resposta
  const validacao = validarRespostaSegura(resposta);
  
  // Se não for segura, usar resposta alternativa
  if (!validacao.segura) {
    // Registrar log de segurança
    await registrarLogSeguranca({
      respostaOriginal: resposta,
      respostaFiltrada: validacao.respostaAlternativa || gerarRespostaSegura(),
      motivo: validacao.motivo || 'Resposta insegura',
      nivelRisco: validacao.nivelRisco,
      palavrasProibidas: validacao.palavrasProibidas,
      leadId: contexto?.leadId,
      conversationId: contexto?.conversationId
    });
    
    return validacao.respostaAlternativa || gerarRespostaSegura();
  }
  
  // Resposta segura, retornar original
  return resposta;
}

/**
 * Adiciona disclaimer legal se a resposta tratar de temas jurídicos
 * APENAS na primeira mensagem ou na despedida
 */
export function adicionarDisclaimerSeNecessario(
  resposta: string, 
  isPrimeiraMensagem: boolean = false,
  isDespedida: boolean = false
): string {
  // Só adicionar disclaimer na primeira mensagem ou despedida
  if (!isPrimeiraMensagem && !isDespedida) {
    return resposta;
  }
  
  const temasJuridicos = [
    'direito', 'lei', 'cdc', 'código', 'processo', 'ação',
    'juizado', 'procon', 'indenização', 'dano', 'prejuízo',
    'contrato', 'cláusula', 'ilegal', 'abusivo', 'irregular'
  ];
  
  const respostaLower = resposta.toLowerCase();
  const contemTemaJuridico = temasJuridicos.some(tema => 
    respostaLower.includes(tema)
  );
  
  if (contemTemaJuridico && !resposta.includes('⚠️')) {
    return resposta + DISCLAIMER_LEGAL;
  }
  
  return resposta;
}
