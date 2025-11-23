/**
 * Serviço de Extração de Dados Estruturados
 * 
 * Analisa conversas e extrai informações estruturadas do lead:
 * - Nome completo
 * - CPF
 * - Email
 * - Data de nascimento
 * - Banco do empréstimo
 * - Tipo de empréstimo (consignado, RMC, RCC, etc)
 * - Valor da parcela
 * - Número de parcelas
 * - Período do contrato
 * 
 * Determina automaticamente se o lead está qualificado.
 */

import { invokeLLM } from "../_core/llm";

/**
 * Dados extraídos da conversa
 */
export interface ExtractedData {
  // Dados pessoais
  clienteNome?: string;
  cpf?: string;
  email?: string;
  dataNascimento?: string; // formato YYYY-MM-DD
  
  // Dados do empréstimo
  bancoNome?: string;
  tipoEmprestimo?: string; // "consignado", "RMC", "RCC", "cartao", "outro"
  valorParcela?: number;
  numeroParcelas?: number;
  periodoContrato?: string; // "menos de 1 ano", "1-3 anos", "3-5 anos", "mais de 5 anos"
  
  // Qualificação
  casoQualificado: boolean;
  motivoNaoQualificado?: string;
  confianca: number; // 0-100, confiança na extração
}

/**
 * Critérios para lead qualificado:
 * 1. Tem empréstimo consignado/RMC/RCC (não outros tipos)
 * 2. Informou banco
 * 3. Informou pelo menos um dado do empréstimo (valor OU parcelas OU período)
 */
function determinarQualificacao(data: Partial<ExtractedData>): {
  qualificado: boolean;
  motivo?: string;
} {
  // Verificar se tem tipo de empréstimo elegível
  const tiposElegiveis = ["consignado", "rmc", "rcc"];
  if (!data.tipoEmprestimo) {
    return {
      qualificado: false,
      motivo: "Não informou tipo de empréstimo"
    };
  }
  
  const tipoNormalizado = data.tipoEmprestimo.toLowerCase();
  const isElegivel = tiposElegiveis.some(tipo => tipoNormalizado.includes(tipo));
  
  if (!isElegivel) {
    return {
      qualificado: false,
      motivo: `Tipo de empréstimo não elegível: ${data.tipoEmprestimo}`
    };
  }
  
  // Verificar se informou banco
  if (!data.bancoNome) {
    return {
      qualificado: false,
      motivo: "Não informou banco do empréstimo"
    };
  }
  
  // Verificar se informou pelo menos um dado do empréstimo
  const temDadosEmprestimo = 
    data.valorParcela || 
    data.numeroParcelas || 
    data.periodoContrato;
  
  if (!temDadosEmprestimo) {
    return {
      qualificado: false,
      motivo: "Não informou dados suficientes do empréstimo (valor, parcelas ou período)"
    };
  }
  
  // Lead qualificado!
  return { qualificado: true };
}

/**
 * Extrai dados estruturados da conversa usando GPT-4
 */
export async function extractLeadData(
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }>,
  currentLeadData?: Partial<ExtractedData>
): Promise<ExtractedData> {
  try {
    console.log("[DataExtraction] 🔍 Extraindo dados da conversa...");
    
    // Montar prompt de extração
    const prompt = `Você é um assistente especializado em extrair dados estruturados de conversas sobre empréstimos consignados.

CONVERSA:
${conversationHistory.map(msg => `${msg.role === "user" ? "Cliente" : "Assistente"}: ${msg.content}`).join("\n")}

DADOS ATUAIS DO LEAD:
${currentLeadData ? JSON.stringify(currentLeadData, null, 2) : "Nenhum dado ainda"}

TAREFA:
Analise a conversa e extraia TODOS os dados mencionados pelo cliente. Retorne APENAS um JSON válido com os campos abaixo.

IMPORTANTE:
- Se um dado NÃO foi mencionado, NÃO invente! Deixe o campo vazio (null)
- Para tipo de empréstimo, use: "consignado", "RMC", "RCC", "cartao", "outro"
- Para período do contrato, use: "menos de 1 ano", "1-3 anos", "3-5 anos", "mais de 5 anos"
- Normalize nomes de bancos (ex: "Santander", "Banco do Brasil", "Caixa", "Bradesco")
- CPF deve estar no formato 000.000.000-00 (com pontos e hífen)
- Data de nascimento no formato YYYY-MM-DD

CAMPOS PARA EXTRAIR:
{
  "clienteNome": string | null,
  "cpf": string | null,
  "email": string | null,
  "dataNascimento": string | null,
  "bancoNome": string | null,
  "tipoEmprestimo": string | null,
  "valorParcela": number | null,
  "numeroParcelas": number | null,
  "periodoContrato": string | null,
  "confianca": number (0-100, sua confiança na extração)
}

Retorne APENAS o JSON, sem texto adicional.`;

    const response = await invokeLLM({
      messages: [
        { role: "system", content: "Você é um extrator de dados estruturados. Retorne APENAS JSON válido." },
        { role: "user", content: prompt }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "lead_data_extraction",
          strict: true,
          schema: {
            type: "object",
            properties: {
              clienteNome: { type: ["string", "null"] },
              cpf: { type: ["string", "null"] },
              email: { type: ["string", "null"] },
              dataNascimento: { type: ["string", "null"] },
              bancoNome: { type: ["string", "null"] },
              tipoEmprestimo: { type: ["string", "null"] },
              valorParcela: { type: ["number", "null"] },
              numeroParcelas: { type: ["number", "null"] },
              periodoContrato: { type: ["string", "null"] },
              confianca: { type: "number" }
            },
            required: ["confianca"],
            additionalProperties: false
          }
        }
      },
      temperature: 0.1 // Baixa temperatura para extração precisa
    });

    if (!response || !response.choices || !response.choices[0]) {
      throw new Error("Invalid response structure from LLM");
    }
    
    const content = response.choices[0].message.content;
    if (!content || typeof content !== 'string') {
      throw new Error("Empty or invalid response from LLM");
    }

    const extracted = JSON.parse(content);
    console.log("[DataExtraction] ✅ Dados extraídos:", extracted);

    // Determinar qualificação
    const { qualificado, motivo } = determinarQualificacao(extracted);

    const result: ExtractedData = {
      ...extracted,
      casoQualificado: qualificado,
      motivoNaoQualificado: motivo,
      confianca: extracted.confianca || 50
    };

    console.log("[DataExtraction] 📊 Qualificação:", qualificado ? "✅ QUALIFICADO" : "❌ NÃO QUALIFICADO");
    if (motivo) {
      console.log("[DataExtraction] 📝 Motivo:", motivo);
    }

    return result;
  } catch (error) {
    console.error("[DataExtraction] ❌ Erro ao extrair dados:", error);
    
    // Retornar dados vazios em caso de erro
    return {
      casoQualificado: false,
      motivoNaoQualificado: "Erro ao processar dados da conversa",
      confianca: 0
    };
  }
}

/**
 * Mescla dados extraídos com dados existentes do lead
 * Prioriza dados novos sobre dados antigos
 */
export function mergeLeadData(
  currentData: Partial<ExtractedData>,
  extractedData: ExtractedData
): Partial<ExtractedData> {
  return {
    // Priorizar dados extraídos se tiverem confiança > 50
    clienteNome: extractedData.confianca > 50 && extractedData.clienteNome 
      ? extractedData.clienteNome 
      : currentData.clienteNome,
    
    cpf: extractedData.cpf || currentData.cpf,
    email: extractedData.email || currentData.email,
    dataNascimento: extractedData.dataNascimento || currentData.dataNascimento,
    
    bancoNome: extractedData.bancoNome || currentData.bancoNome,
    tipoEmprestimo: extractedData.tipoEmprestimo || currentData.tipoEmprestimo,
    valorParcela: extractedData.valorParcela || currentData.valorParcela,
    numeroParcelas: extractedData.numeroParcelas || currentData.numeroParcelas,
    periodoContrato: extractedData.periodoContrato || currentData.periodoContrato,
    
    // Sempre usar qualificação mais recente
    casoQualificado: extractedData.casoQualificado,
    motivoNaoQualificado: extractedData.motivoNaoQualificado,
  };
}
