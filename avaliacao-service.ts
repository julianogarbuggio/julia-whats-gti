/**
 * Serviço de Avaliação e Finalização de Atendimento
 * 
 * Gerencia o fluxo de:
 * 1. Pergunta se pode ajudar com mais alguma coisa
 * 2. Pede avaliação (1-5 estrelas)
 * 3. Pede comentário (opcional)
 * 4. Aguarda 1 minuto
 * 5. Envia resumo para Dr. Juliano
 */

import { getDb } from "../db";
import { leads, avaliacoes, conversations } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { sendTextMessage } from "./zapi";

const DR_JULIANO_WHATSAPP = "5544999869223"; // (44) 99986-9223

/**
 * Detecta se mensagem indica finalização
 */
export function detectarFinalizacao(mensagem: string): boolean {
  const mensagemLower = mensagem.toLowerCase();
  const palavrasFinalizacao = [
    "obrigad",
    "valeu",
    "ok",
    "tchau",
    "até",
    "falou",
    "tá bom",
    "ta bom",
    "beleza",
    "só isso",
    "era isso",
    "é isso",
  ];
  
  return palavrasFinalizacao.some(palavra => mensagemLower.includes(palavra));
}

/**
 * Verifica se mensagem é uma avaliação (número de 1 a 5)
 */
export function detectarAvaliacao(mensagem: string): number | null {
  const mensagemLimpa = mensagem.trim();
  const numero = parseInt(mensagemLimpa);
  
  if (!isNaN(numero) && numero >= 1 && numero <= 5) {
    return numero;
  }
  
  // Detectar estrelas emoji
  const estrelas = (mensagemLimpa.match(/⭐/g) || []).length;
  if (estrelas >= 1 && estrelas <= 5) {
    return estrelas;
  }
  
  return null;
}

/**
 * Salva avaliação no banco de dados
 */
export async function salvarAvaliacao(
  leadId: number,
  nota: number,
  comentario?: string
): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  try {
    await db.insert(avaliacoes).values({
      leadId,
      nota,
      comentario: comentario || null,
    });
    
    console.log("[Avaliação] Salva com sucesso - Lead:", leadId, "Nota:", nota);
  } catch (error) {
    console.error("[Avaliação] Erro ao salvar:", error);
  }
}

/**
 * Gera resumo da conversa para enviar ao Dr. Juliano
 */
export async function gerarResumoConversa(leadId: number): Promise<string> {
  const db = await getDb();
  if (!db) return "Erro ao gerar resumo";
  
  try {
    // Buscar dados do lead
    const leadData = await db
      .select()
      .from(leads)
      .where(eq(leads.id, leadId))
      .limit(1);
    
    if (leadData.length === 0) return "Lead não encontrado";
    
    const lead = leadData[0];
    
    // Buscar avaliação (se houver)
    const avaliacaoData = await db
      .select()
      .from(avaliacoes)
      .where(eq(avaliacoes.leadId, leadId))
      .orderBy(desc(avaliacoes.createdAt))
      .limit(1);
    
    const avaliacao = avaliacaoData.length > 0 ? avaliacaoData[0] : null;
    
    // Buscar histórico de mensagens
    const historico = await db
      .select()
      .from(conversations)
      .where(eq(conversations.leadId, leadId))
      .orderBy(desc(conversations.createdAt))
      .limit(20);
    
    // Converter telefone para formato internacional clicável
    const telefoneInternacional = lead.clienteWhatsapp
      .replace(/\D/g, '') // Remove tudo que não é número
      .replace(/^(\d{2})(\d)/, '55$1$2'); // Adiciona 55 se não tiver
    
    const telefoneClicavel = `https://wa.me/${telefoneInternacional}`;
    
    // Montar resumo - formato limpo e compacto
    let resumo = `📋 *RESUMO DE ATENDIMENTO*\n\n`;
    resumo += `👤 *${lead.clienteNome}*\n`;
    resumo += `📱 ${telefoneClicavel}\n\n`;
    
    // Informações do caso (compacto)
    if (lead.bancoNome || lead.tipoEmprestimo) {
      resumo += `💰 *CASO:*\n`;
      
      if (lead.tipoEmprestimo && lead.bancoNome) {
        resumo += `${lead.tipoEmprestimo} - ${lead.bancoNome}\n`;
      } else if (lead.tipoEmprestimo) {
        resumo += `${lead.tipoEmprestimo}\n`;
      } else if (lead.bancoNome) {
        resumo += `${lead.bancoNome}\n`;
      }
      
      if (lead.valorParcela && lead.numeroParcelas) {
        const valor = (lead.valorParcela / 100).toFixed(2);
        resumo += `Parcela: R$ ${valor} (${lead.numeroParcelas}x)\n`;
      } else if (lead.valorParcela) {
        const valor = (lead.valorParcela / 100).toFixed(2);
        resumo += `Parcela: R$ ${valor}\n`;
      }
      
      resumo += `\n`;
    }
    
    // Status e Fase
    if (lead.casoQualificado) {
      resumo += `✅ *STATUS:* Qualificado\n`;
    } else if (lead.casoQualificado === false) {
      resumo += `❌ *STATUS:* Não qualificado\n`;
      if (lead.motivoNaoQualificado) {
        resumo += `Motivo: ${lead.motivoNaoQualificado}\n`;
      }
    }
    
    // Fase do processo (se tiver)
    if (lead.faseProcesso) {
      const fases: Record<string, string> = {
        'documentos_enviados': 'Documentos enviados',
        'analise': 'Análise em andamento',
        'elaboracao_peticao': 'Elaboração da petição',
        'protocolado': 'Protocolado',
        'em_andamento': 'Processo em andamento',
        'finalizado': 'Finalizado'
      };
      resumo += `📝 *FASE:* ${fases[lead.faseProcesso] || lead.faseProcesso}\n`;
    }
    
    resumo += `\n`;
    
    // Andamento processual
    if (lead.solicitouAndamento) {
      resumo += `\n📊 *ANDAMENTO PROCESSUAL:*\n`;
      
      if (lead.andamentoEncontrado) {
        resumo += `✅ Consultado - Última consulta: ${lead.ultimaConsultaAndamento ? new Date(lead.ultimaConsultaAndamento).toLocaleDateString('pt-BR') : 'N/A'}\n`;
        if (lead.numeroProcesso) {
          resumo += `📋 Processo: ${lead.numeroProcesso}\n`;
        }
      } else if (lead.andamentoEncontrado === false) {
        resumo += `❌ Não cadastrado - Cliente solicitou consulta\n`;
      }
      
      if (lead.tribunalIdentificado) {
        resumo += `🏛️ Tribunal: ${lead.tribunalIdentificado}\n`;
      }
    }
    
    // Avaliação (compacto)
    if (avaliacao) {
      const estrelas = "⭐".repeat(avaliacao.nota);
      resumo += `\n⭐ *AVALIAÇÃO:* ${estrelas} (${avaliacao.nota}/5)\n`;
      
      if (avaliacao.comentario) {
        resumo += `💬 "${avaliacao.comentario}"\n`;
      }
    }
    
    // Link do formulário se for caso de consignado
    const isCasoConsignado = 
      lead.tipoEmprestimo?.toLowerCase().includes('consignado') ||
      lead.tipoEmprestimo?.toLowerCase().includes('rmc') ||
      lead.tipoEmprestimo?.toLowerCase().includes('rcc') ||
      lead.bancoNome; // Se tem banco, provavelmente é consignado
    
    if (isCasoConsignado && lead.casoQualificado) {
      resumo += `\n`;
      resumo += `📝 *FORMULÁRIO:*\n`;
      resumo += `Cliente deve preencher: http://formulario.julianogarbuggio.adv.br/\n`;
      resumo += `Opção 1 – Revisão de Empréstimos Consignados\n`;
    }
    
    return resumo;
  } catch (error) {
    console.error("[Resumo] Erro ao gerar:", error);
    return "Erro ao gerar resumo";
  }
}

/**
 * Envia resumo para o Dr. Juliano após 1 minuto
 */
export async function agendarEnvioResumo(leadId: number): Promise<void> {
  console.log("[Resumo] Agendando envio em 1 minuto para lead:", leadId);
  
  setTimeout(async () => {
    try {
      const resumo = await gerarResumoConversa(leadId);
      await sendTextMessage({ phone: DR_JULIANO_WHATSAPP, message: resumo });
      console.log("[Resumo] Enviado com sucesso para Dr. Juliano");
    } catch (error) {
      console.error("[Resumo] Erro ao enviar:", error);
    }
  }, 60000); // 1 minuto
}

/**
 * Mensagens do fluxo de finalização
 */
export const MENSAGENS_FINALIZACAO = {
  perguntarMais: "Posso te ajudar com mais alguma coisa hoje?",
  pedirAvaliacao: "Você poderia avaliar meu atendimento? Me dê uma nota de 1 a 5 ⭐",
  agradecerAvaliacao: (nota: number) => {
    if (nota >= 4) {
      return `Muito obrigada pela avaliação! ${nota === 5 ? "Fico muito feliz que tenha gostado! 😊" : "Que bom que pude ajudar! 😊"}`;
    } else {
      return "Obrigada pelo feedback! Vou melhorar cada vez mais. 😊";
    }
  },
  pedirComentario: "Quer deixar algum comentário sobre o atendimento?",
  agradecerComentario: "Muito obrigada pelo seu comentário! Foi um prazer te atender. 😊",
  despedida: "Qualquer coisa, é só me chamar! Estou aqui 24h por dia. Até logo! 👋",
};
