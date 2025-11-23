 * Serviço de Consulta de Andamento Processual
 * Integra com Jul.IA Intimações, DataJud CNJ e fornece guias de consulta por tribunal
 */

import { consultarProcessoCNJ, extrairNumeroCNJ, identificarTribunal as identificarTribunalCNJ } from './datajud-cnj-integration';

/**
 * Identifica o tribunal pelo número do processo
 */
export function identificarTribunal(numeroProcesso: string): {
  tribunal: string;
  nome: string;
  url: string;
  instrucoes: string;
} | null {
  // Remover espaços e caracteres especiais
  const numero = numeroProcesso.replace(/[^\d]/g, '');
  
  // Padrão: NNNNNNN-DD.AAAA.J.TT.OOOO
  // J = Justiça (1-9)
  // TT = Tribunal
  
  if (numero.length < 20) {
    return null;
  }
  
  const justica = numero.charAt(13);
  const tribunal = numero.substring(14, 16);
  
  // Justiça Estadual (8)
  if (justica === '8') {
    // São Paulo (26)
    if (tribunal === '26') {
      return {
        tribunal: 'ESAJ-SP',
        nome: 'Tribunal de Justiça de São Paulo',
        url: 'https://esaj.tjsp.jus.br/cpopg/open.do',
        instrucoes: `
📱 *COMO CONSULTAR SEU PROCESSO NO TJSP:*

1️⃣ Entre no site: https://esaj.tjsp.jus.br/cpopg/open.do

2️⃣ Na tela que abrir, você vai ver um campo escrito "Número do Processo"

3️⃣ Digite o número do seu processo: ${numeroProcesso}

4️⃣ Clique no botão "Consultar"

5️⃣ Pronto! Vai aparecer todas as movimentações do seu processo

💡 *Dica:* Se aparecer alguma palavra difícil, pode me perguntar que eu te explico!
        `.trim()
      };
    }
    
    // Paraná (16)
    if (tribunal === '16') {
      return {
        tribunal: 'EPROC-PR',
        nome: 'Tribunal de Justiça do Paraná',
        url: 'https://portal.tjpr.jus.br/jurisprudencia/publico/pesquisa.do?actionType=listar',
        instrucoes: `
📱 *COMO CONSULTAR SEU PROCESSO NO TJPR:*

1️⃣ Entre no site: https://portal.tjpr.jus.br/jurisprudencia/publico/pesquisa.do?actionType=listar

2️⃣ Procure o campo "Número do Processo"

3️⃣ Digite: ${numeroProcesso}

4️⃣ Clique em "Consultar"

5️⃣ Vai aparecer o andamento do seu processo

💡 *Dica:* Guarde esse link nos favoritos pra consultar sempre que quiser!
        `.trim()
      };
    }
    
    // Minas Gerais (13)
    if (tribunal === '13') {
      return {
        tribunal: 'PJEMG',
        nome: 'Tribunal de Justiça de Minas Gerais',
        url: 'https://pje.tjmg.jus.br/pje/ConsultaPublica/listView.seam',
        instrucoes: `
📱 *COMO CONSULTAR SEU PROCESSO NO TJMG:*

1️⃣ Entre no site: https://pje.tjmg.jus.br/pje/ConsultaPublica/listView.seam

2️⃣ Digite o número: ${numeroProcesso}

3️⃣ Clique em "Consultar"

4️⃣ Pronto! Vai aparecer tudo sobre seu processo

💡 *Dica:* Anote as últimas movimentações pra me mostrar se tiver dúvida!
        `.trim()
      };