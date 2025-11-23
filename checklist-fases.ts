/**
 * Serviço de Checklist de Fases do Processo
 * Gera checklist visual para clientes em atendimento
 */

export type FaseProcesso = 
  | 'documentos_enviados'
  | 'analise'
  | 'elaboracao_peticao'
  | 'protocolado'
  | 'em_andamento'
  | 'finalizado';

/**
 * Gera checklist visual das fases do processo
 * Marca a fase atual do cliente
 */
export function gerarChecklistFases(faseAtual?: FaseProcesso | null): string {
  const fases = [
    { id: 'documentos_enviados', nome: 'Documentos enviados', emoji: '📄' },
    { id: 'analise', nome: 'Análise em andamento', emoji: '🔍' },
    { id: 'elaboracao_peticao', nome: 'Elaboração da petição', emoji: '📝' },
    { id: 'protocolado', nome: 'Protocolo da ação', emoji: '⚖️' },
    { id: 'em_andamento', nome: 'Acompanhamento processual', emoji: '📊' },
  ];

  let checklist = `📋 *CHECKLIST - Fases do Processo*\n\n`;

  for (const fase of fases) {
    const isFaseAtual = fase.id === faseAtual;
    const icon = isFaseAtual ? '🔄' : '⏳';
    const status = isFaseAtual ? '*(você está aqui!)*' : '';
    
    checklist += `${icon} ${fase.emoji} ${fase.nome} ${status}\n`;
  }

  return checklist;
}

/**
 * Mensagem para cliente que já enviou documentos
 */
export function mensagemClienteEmAtendimento(
  nome: string,
  faseAtual?: FaseProcesso | null
): string {
  let mensagem = `Oi ${nome}! 👋\n\n`;
  mensagem += `Vi aqui que você já enviou os documentos. Que bom! ✅\n\n`;
  
  // Checklist
  mensagem += gerarChecklistFases(faseAtual);
  mensagem += `\n`;
  
  // Explicação do prazo
  if (faseAtual === 'analise' || faseAtual === 'documentos_enviados') {
    mensagem += `O Dr. Juliano está analisando seu caso com muito cuidado. `;
    mensagem += `Pode levar até 45 dias úteis - esse tempo é pra garantir que nada passe despercebido e você tenha o melhor resultado possível! 💪\n\n`;
  }
  
  // Pergunta se enviou todos os documentos
  mensagem += `Só pra confirmar: você já enviou *todos* os documentos que precisava?\n`;
  mensagem += `Contratos, extratos, comprovante de renda?`;
  
  return mensagem;
}

/**
 * Detecta se cliente está em atendimento (já enviou documentos)
 */
export function isClienteEmAtendimento(
  statusLead: string,
  faseProcesso?: FaseProcesso | null
): boolean {
  return (
    statusLead === 'documentos_enviados' ||
    statusLead === 'convertido' ||
    faseProcesso !== null && faseProcesso !== undefined
  );
}
