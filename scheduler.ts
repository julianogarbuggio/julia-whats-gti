import cron from 'node-cron';
import { sendDailyReport } from './daily-report';

/**
 * Inicializa agendamentos de tarefas
 */
export function initializeScheduler() {
  console.log('[Scheduler] Inicializando agendamentos...');

  // Relatório diário de aprendizado às 23h (horário de Brasília - GMT-3)
  // Cron: 0 23 * * * = todo dia às 23:00
  cron.schedule('0 23 * * *', async () => {
    console.log('[Scheduler] 📊 Executando relatório diário de aprendizado às 23h');
    try {
      await sendDailyReport();
      console.log('[Scheduler] ✅ Relatório diário enviado com sucesso via WhatsApp');
    } catch (error) {
      console.error('[Scheduler] ❌ Erro ao enviar relatório diário:', error);
    }
  }, {
    timezone: 'America/Sao_Paulo' // Horário de Brasília
  });

  console.log('[Scheduler] ✅ Agendamento configurado: Relatório diário de aprendizado às 23h');
}
