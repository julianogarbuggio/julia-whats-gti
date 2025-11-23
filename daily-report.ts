/**
 * Serviço de Relatório Diário de Aprendizado
 * Gera e envia relatório diário para o Dr. Juliano
 */

import { getTodayLearnings } from "./learning-detection";
import { sendTextMessage } from "./gti-api";
import { ENV } from "../_core/env";

export interface DailyReportData {
  date: string;
  totalLearnings: number;
  totalFailures: number;
  totalDoubts: number;
  learnings: any[];
  failures: any[];
  doubts: any[];
  growthPlan: string[];
}

/**
 * Gera relatório diário de aprendizado
 */
export async function generateDailyReport(): Promise<DailyReportData> {
  const { learnings, failures, doubts } = await getTodayLearnings();

  // Gerar plano de crescimento baseado nas falhas e dúvidas
  const growthPlan = generateGrowthPlan(failures, doubts);

  return {
    date: new Date().toLocaleDateString("pt-BR"),
    totalLearnings: learnings.length,
    totalFailures: failures.length,
    totalDoubts: doubts.length,
    learnings,
    failures,
    doubts,
    growthPlan,
  };
}

/**
 * Gera plano de crescimento baseado em falhas e dúvidas
 */
function generateGrowthPlan(failures: any[], doubts: any[]): string[] {
  const plan: string[] = [];

  // Agrupar por categoria
  const categories = new Map<string, number>();

  [...failures, ...doubts].forEach((item) => {
    const cat = item.category || "geral";
    categories.set(cat, (categories.get(cat) || 0) + 1);
  });

  // Ordenar por frequência
  const sorted = Array.from(categories.entries()).sort((a, b) => b[1] - a[1]);

  // Gerar sugestões
  sorted.slice(0, 5).forEach(([category, count]) => {
    plan.push(
      `Estudar mais sobre: ${category} (${count} ocorrência${count > 1 ? "s" : ""})`
    );
  });

  if (plan.length === 0) {
    plan.push("Continuar monitorando conversas para identificar áreas de melhoria");
  }

  return plan;
}

/**
 * Formata relatório para envio via WhatsApp
 */
export function formatReportForWhatsApp(report: DailyReportData): string {
  let message = `📊 *RELATÓRIO DIÁRIO DE APRENDIZADO*\n`;
  message += `📅 Data: ${report.date}\n\n`;

  message += `📈 *RESUMO DO DIA:*\n`;
  message += `✅ Aprendizados: ${report.totalLearnings}\n`;
  message += `❌ Falhas: ${report.totalFailures}\n`;
  message += `❓ Dúvidas: ${report.totalDoubts}\n\n`;

  // Aprendizados
  if (report.learnings.length > 0) {
    message += `✅ *APRENDIZADOS* (Top 5):\n\n`;
    report.learnings.slice(0, 5).forEach((learning, index) => {
      message += `${index + 1}. *${learning.title}*\n`;
      message += `   ${learning.description}\n`;
      message += `   Categoria: ${learning.category} | Confiança: ${learning.confidence}%\n\n`;
    });
  }

  // Falhas
  if (report.failures.length > 0) {
    message += `❌ *FALHAS* (Top 5):\n\n`;
    report.failures.slice(0, 5).forEach((failure, index) => {
      message += `${index + 1}. *${failure.title}*\n`;
      message += `   ${failure.description}\n`;
      message += `   Categoria: ${failure.category} | Confiança: ${failure.confidence}%\n\n`;
    });
  }

  // Dúvidas
  if (report.doubts.length > 0) {
    message += `❓ *DÚVIDAS* (Top 5):\n\n`;
    report.doubts.slice(0, 5).forEach((doubt, index) => {
      message += `${index + 1}. *${doubt.title}*\n`;
      message += `   ${doubt.description}\n`;
      message += `   Categoria: ${doubt.category} | Confiança: ${doubt.confidence}%\n\n`;
    });
  }

  // Plano de crescimento
  if (report.growthPlan.length > 0) {
    message += `🎯 *PLANO DE CRESCIMENTO:*\n\n`;
    report.growthPlan.forEach((item, index) => {
      message += `${index + 1}. ${item}\n`;
    });
    message += `\n`;
  }

  message += `---\n`;
  message += `💡 *Acesse o Dashboard para revisar e corrigir cada item!*\n`;
  message += `🔗 https://sua-url.manus.space/treinamento`;

  return message;
}

/**
 * Envia relatório diário via WhatsApp
 */
export async function sendDailyReport(): Promise<boolean> {
  try {
    console.log("[Daily Report] Gerando relatório...");

    const report = await generateDailyReport();

    // Se não houver nada para reportar
    if (
      report.totalLearnings === 0 &&
      report.totalFailures === 0 &&
      report.totalDoubts === 0
    ) {
      console.log("[Daily Report] Nada para reportar hoje");
      return true;
    }

    const message = formatReportForWhatsApp(report);

    // Enviar para Dr. Juliano (telefone pessoal)
    const drJulianoPhone = "5544999869223"; // (44) 99986-9223

    await sendTextMessage({ phone: drJulianoPhone, message });

    console.log("[Daily Report] Relatório enviado com sucesso!");
    return true;
  } catch (error) {
    console.error("[Daily Report] Erro ao enviar relatório:", error);
    return false;
  }
}

/**
 * Agenda envio diário às 23h
 */
export function scheduleDailyReport(): void {
  // Calcular próximo horário de envio (23h)
  const now = new Date();
  const scheduledTime = new Date();
  scheduledTime.setHours(23, 0, 0, 0);

  // Se já passou das 23h hoje, agendar para amanhã
  if (now > scheduledTime) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  const timeUntilReport = scheduledTime.getTime() - now.getTime();

  console.log(
    `[Daily Report] Próximo relatório agendado para: ${scheduledTime.toLocaleString("pt-BR")}`
  );

  setTimeout(() => {
    sendDailyReport();
    // Reagendar para o próximo dia
    setInterval(sendDailyReport, 24 * 60 * 60 * 1000); // 24 horas
  }, timeUntilReport);
}
