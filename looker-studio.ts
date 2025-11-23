/**
 * Serviço de Integração com Google Looker Studio
 * 
 * Este serviço gerencia a integração entre o chatbot e o Google Looker Studio
 * através de exportação de métricas para Google Sheets
 */

import { getAllLeads } from "../db";

/**
 * URL do relatório do Google Looker Studio
 */
export const LOOKER_STUDIO_REPORT_URL = "https://lookerstudio.google.com/reporting/2fc4b08f-5526-46bf-8c01-c67210cf5327";

/**
 * Configuração do relatório para embed
 */
export function getLookerStudioEmbedConfig() {
  return {
    reportUrl: LOOKER_STUDIO_REPORT_URL,
    embedUrl: `${LOOKER_STUDIO_REPORT_URL}/embed`,
    allowFullscreen: true,
    allowInteraction: true,
  };
}

/**
 * Prepara dados de métricas do chatbot para exportação
 */
export async function prepareMetricsForExport(): Promise<{
  success: boolean;
  data?: any[];
  summary?: any;
  error?: string;
}> {
  try {
    const allLeads = await getAllLeads(10000);
    
    // Calcular métricas
    const totalLeads = allLeads.length;
    const leadsQualificados = allLeads.filter(l => l.casoQualificado).length;
    const leadsConvertidos = allLeads.filter(l => l.statusLead === "convertido").length;
    const leadsAtendimentoHumano = allLeads.filter(l => l.atendimentoHumanoSolicitado).length;
    const leadsAgendados = allLeads.filter(l => l.statusLead === "agendado").length;
    const leadsDocumentosEnviados = allLeads.filter(l => l.statusLead === "documentos_enviados").length;
    const leadsPerdidos = allLeads.filter(l => l.statusLead === "perdido").length;
    
    // Métricas por banco
    const leadsPorBanco: Record<string, number> = {};
    allLeads.forEach(lead => {
      if (lead.bancoNome) {
        leadsPorBanco[lead.bancoNome] = (leadsPorBanco[lead.bancoNome] || 0) + 1;
      }
    });
    
    // Métricas por tipo de empréstimo
    const leadsPorTipo: Record<string, number> = {};
    allLeads.forEach(lead => {
      if (lead.tipoEmprestimo) {
        leadsPorTipo[lead.tipoEmprestimo] = (leadsPorTipo[lead.tipoEmprestimo] || 0) + 1;
      }
    });
    
    // Métricas diárias (últimos 30 dias)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const leadsPorDia: Record<string, number> = {};
    allLeads.forEach(lead => {
      if (lead.dataPrimeiroContato && lead.dataPrimeiroContato >= thirtyDaysAgo) {
        const dateKey = lead.dataPrimeiroContato.toISOString().split('T')[0];
        leadsPorDia[dateKey] = (leadsPorDia[dateKey] || 0) + 1;
      }
    });
    
    // Preparar dados para Google Sheets
    const metricsData = [
      // Cabeçalho
      ["Métrica", "Valor", "Percentual", "Data Atualização"],
      
      // Métricas gerais
      ["Total de Leads", totalLeads, "100%", new Date().toISOString()],
      ["Leads Qualificados", leadsQualificados, `${(leadsQualificados / totalLeads * 100).toFixed(2)}%`, new Date().toISOString()],
      ["Leads Convertidos", leadsConvertidos, `${(leadsConvertidos / totalLeads * 100).toFixed(2)}%`, new Date().toISOString()],
      ["Leads Agendados", leadsAgendados, `${(leadsAgendados / totalLeads * 100).toFixed(2)}%`, new Date().toISOString()],
      ["Documentos Enviados", leadsDocumentosEnviados, `${(leadsDocumentosEnviados / totalLeads * 100).toFixed(2)}%`, new Date().toISOString()],
      ["Atendimento Humano", leadsAtendimentoHumano, `${(leadsAtendimentoHumano / totalLeads * 100).toFixed(2)}%`, new Date().toISOString()],
      ["Leads Perdidos", leadsPerdidos, `${(leadsPerdidos / totalLeads * 100).toFixed(2)}%`, new Date().toISOString()],
      
      // Separador
      ["", "", "", ""],
      ["Leads por Banco", "", "", ""],
      ...Object.entries(leadsPorBanco).map(([banco, count]) => [
        banco,
        count,
        `${(count / totalLeads * 100).toFixed(2)}%`,
        new Date().toISOString()
      ]),
      
      // Separador
      ["", "", "", ""],
      ["Leads por Tipo de Empréstimo", "", "", ""],
      ...Object.entries(leadsPorTipo).map(([tipo, count]) => [
        tipo,
        count,
        `${(count / totalLeads * 100).toFixed(2)}%`,
        new Date().toISOString()
      ]),
      
      // Separador
      ["", "", "", ""],
      ["Leads por Dia (Últimos 30 dias)", "", "", ""],
      ...Object.entries(leadsPorDia)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => [
          date,
          count,
          `${(count / totalLeads * 100).toFixed(2)}%`,
          new Date().toISOString()
        ]),
    ];
    
    const summary = {
      totalLeads,
      leadsQualificados,
      leadsConvertidos,
      leadsAtendimentoHumano,
      leadsAgendados,
      leadsDocumentosEnviados,
      leadsPerdidos,
      taxaQualificacao: (leadsQualificados / totalLeads * 100).toFixed(2),
      taxaConversao: (leadsConvertidos / totalLeads * 100).toFixed(2),
      leadsPorBanco,
      leadsPorTipo,
      leadsPorDia,
    };
    
    return {
      success: true,
      data: metricsData,
      summary,
    };
  } catch (error) {
    console.error("[Looker Studio] Error preparing metrics:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Gera CSV formatado para importação no Google Sheets
 */
export async function generateGoogleSheetsCSV(): Promise<{
  success: boolean;
  csv?: string;
  filename?: string;
  error?: string;
}> {
  try {
    const metricsResult = await prepareMetricsForExport();
    
    if (!metricsResult.success || !metricsResult.data) {
      return {
        success: false,
        error: metricsResult.error || "Failed to prepare metrics",
      };
    }
    
    // Converter para CSV
    const csvContent = metricsResult.data
      .map(row => row.map((cell: any) => `"${cell}"`).join(","))
      .join("\n");
    
    const filename = `julia-whatsapp-metrics-${new Date().toISOString().split('T')[0]}.csv`;
    
    return {
      success: true,
      csv: csvContent,
      filename,
    };
  } catch (error) {
    console.error("[Looker Studio] Error generating CSV:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Instruções para conectar o Google Sheets ao Looker Studio
 */
export function getGoogleSheetsInstructions(): string {
  return `
# Como Conectar o Chatbot ao Google Looker Studio

## Passo 1: Exportar Métricas para Google Sheets

1. No dashboard do chatbot, clique em "Exportar Métricas para Google Sheets"
2. Faça download do arquivo CSV gerado
3. Abra o Google Sheets (https://sheets.google.com)
4. Crie uma nova planilha chamada "Jul.IA - Métricas do Chatbot"
5. Importe o arquivo CSV: Arquivo > Importar > Upload
6. Configure a importação:
   - Tipo de separador: Vírgula
   - Converter texto em números e datas: Sim
   - Substituir planilha atual: Sim

## Passo 2: Conectar Google Sheets ao Looker Studio

1. Abra seu relatório do Looker Studio: ${LOOKER_STUDIO_REPORT_URL}
2. Clique em "Recursos" > "Gerenciar fontes de dados adicionadas"
3. Clique em "Adicionar dados"
4. Selecione "Google Sheets" como conector
5. Selecione a planilha "Jul.IA - Métricas do Chatbot"
6. Clique em "Adicionar"

## Passo 3: Criar Visualizações

1. No Looker Studio, adicione novos gráficos:
   - Gráfico de linha: Leads por Dia
   - Gráfico de pizza: Leads por Banco
   - Gráfico de barras: Leads por Tipo de Empréstimo
   - Scorecard: Total de Leads, Taxa de Qualificação, Taxa de Conversão

2. Configure os campos de dados:
   - Dimensão: Data, Banco, Tipo de Empréstimo
   - Métrica: Valor, Percentual

## Passo 4: Automatizar Atualização

Para manter os dados sempre atualizados:

1. Configure um agendamento no chatbot para exportar métricas automaticamente
2. Use Google Apps Script para importar o CSV automaticamente
3. O Looker Studio atualizará automaticamente quando os dados mudarem

## Nota Importante

- As métricas são atualizadas em tempo real no chatbot
- Exporte os dados regularmente para manter o Looker Studio atualizado
- Você pode configurar alertas no Looker Studio para mudanças significativas
  `;
}
