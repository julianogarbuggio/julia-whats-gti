/**
 * Integração com API DataJud CNJ (Railway)
 * 
 * Consulta processos judiciais públicos através do DataJud
 * API hospedada em: https://julia-datajud-production.up.railway.app
 */

import { identificarTribunal as identificarTribunalManual } from './andamento-processual-service';

const DATAJUD_API_URL = "https://julia-datajud-production.up.railway.app";

export type TribunalCNJ = "TJPR" | "TJSP" | "TJMG";

export interface ConsultaProcessoRequest {
  numero_processo_cnj: string;
  tribunal: TribunalCNJ;
}

export interface ConsultaProcessoResponse {
  mensagem: string;
  numero_processo_cnj?: string;
  tribunal?: string;
}

/**
 * Identifica o tribunal baseado no número CNJ do processo
 * Formato: NNNNNNN-DD.AAAA.J.TR.OOOO
 * Onde TR = código do tribunal
 */
export function identificarTribunal(numeroCNJ: string): TribunalCNJ | null {
  // Remove formatação
  const numero = numeroCNJ.replace(/[.-]/g, '');
  
  // Extrai código do tribunal (posições 13-14 no formato sem pontuação)
  // Exemplo: 00012345620238160001
  //                         ^^
  //                         TR (posição 13-14)
  
  if (numero.length < 20) {
    return null;
  }
  
  const codigoTribunal = numero.substring(13, 15);
  
  // Mapeamento de códigos de tribunal
  const mapa: Record<string, TribunalCNJ> = {
    '16': 'TJPR', // Tribunal de Justiça do Paraná
    '26': 'TJSP', // Tribunal de Justiça de São Paulo
    '13': 'TJMG', // Tribunal de Justiça de Minas Gerais
  };
  
  return mapa[codigoTribunal] || null;
}

/**
 * Consulta processo no DataJud CNJ
 */
export async function consultarProcessoCNJ(
  numeroCNJ: string,
  tribunal?: TribunalCNJ
): Promise<ConsultaProcessoResponse> {
  try {
    console.log(`[DataJud] 🔍 Consultando processo ${numeroCNJ} (identificação automática de tribunal)...`);
    
    const payload = {
      numero_processo_cnj: numeroCNJ
    };
    
    const response = await fetch(`${DATAJUD_API_URL}/api/datajud/consulta-processo-auto`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[DataJud] ❌ Erro HTTP ${response.status}:`, errorText);
      
      // Gera instruções de consulta manual como fallback
      const tribunalInfo = identificarTribunalManual(numeroCNJ);
      
      if (tribunalInfo) {
        console.log(`[DataJud] 📖 Enviando instruções de consulta manual para ${tribunalInfo.tribunal}`);
        return {
          mensagem: `❌ Sistema de consulta temporariamente indisponível.\n\nMas não se preocupe! Você pode consultar agora mesmo:\n\n${tribunalInfo.instrucoes}`,
          numero_processo_cnj: numeroCNJ,
          tribunal: tribunalInfo.tribunal
        };
      }
      
      return {
        mensagem: `❌ Erro ao consultar o DataJud (${response.status}). Tente novamente mais tarde ou consulte diretamente no site do tribunal.`,
        numero_processo_cnj: numeroCNJ
      };
    }
    
    const data: ConsultaProcessoResponse = await response.json();
    
    console.log(`[DataJud] ✅ Consulta concluída:`, data.mensagem.substring(0, 100) + '...');
    
    return data;
    
  } catch (error: any) {
    console.error('[DataJud] ❌ Erro na consulta:', error);
    
    return {
      mensagem: `❌ Erro ao consultar o processo: ${error.message || 'Erro desconhecido'}. Tente novamente mais tarde.`,
      numero_processo_cnj: numeroCNJ
    };
  }
}

/**
 * Extrai número CNJ de uma mensagem
 * Formatos aceitos:
 * - 0001234-56.2023.8.16.0001
 * - 00012345620238160001
 */
export function extrairNumeroCNJ(texto: string): string | null {
  // Padrão com formatação: NNNNNNN-DD.AAAA.J.TR.OOOO
  const padraoFormatado = /\d{7}-\d{2}\.\d{4}\.\d{1}\.\d{2}\.\d{4}/g;
  const matchFormatado = texto.match(padraoFormatado);
  
  if (matchFormatado) {
    return matchFormatado[0];
  }
  
  // Padrão sem formatação: 20 dígitos
  const padraoSemFormatacao = /\b\d{20}\b/g;
  const matchSemFormatacao = texto.match(padraoSemFormatacao);
  
  if (matchSemFormatacao) {
    // Converte para formato com pontuação
    const num = matchSemFormatacao[0];
    return `${num.substring(0, 7)}-${num.substring(7, 9)}.${num.substring(9, 13)}.${num.substring(13, 14)}.${num.substring(14, 16)}.${num.substring(16, 20)}`;
  }
  
  return null;
}
