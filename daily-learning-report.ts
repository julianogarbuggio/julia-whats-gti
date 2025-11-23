import { getDb } from "../db";
import { leads, conversations, aiLearningPatterns } from "../../drizzle/schema";
import { gte, sql, desc, eq } from "drizzle-orm";

/**
 * Gera relatório diário de aprendizado da Jul.IA
 */
export async function generateDailyLearningReport(): Promise<string> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Data de hoje (início do dia)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. ESTATÍSTICAS DO DIA
  const [statsResult] = await db
    .select({
      totalLeads: sql<number>`COUNT(DISTINCT ${leads.id})`,
      newLeads: sql<number>`COUNT(DISTINCT CASE WHEN DATE(${leads.dataPrimeiroContato}) = CURDATE() THEN ${leads.id} END)`,
      totalConversations: sql<number>`COUNT(${conversations.id})`,
      clientMessages: sql<number>`COUNT(CASE WHEN ${conversations.fromMe} = 0 THEN 1 END)`,
      juliaMessages: sql<number>`COUNT(CASE WHEN ${conversations.fromMe} = 1 THEN 1 END)`,
    })
    .from(leads)
    .leftJoin(conversations, eq(conversations.leadId, leads.id))
    .where(gte(conversations.timestamp, today));

  const stats = statsResult || {
    totalLeads: 0,
    newLeads: 0,
    totalConversations: 0,
    clientMessages: 0,
    juliaMessages: 0,
  };

  // 2. NOVOS PADRÕES DE APRENDIZADO (últimas 24h)
  const newPatterns = await db
    .select()
    .from(aiLearningPatterns)
    .where(gte(aiLearningPatterns.ultimaOcorrencia, today))
    .orderBy(desc(aiLearningPatterns.frequencia))
    .limit(10);

  // 3. PADRÕES PENDENTES DE APROVAÇÃO
  const pendingPatterns = await db
    .select()
    .from(aiLearningPatterns)
    .where(eq(aiLearningPatterns.aprovado, false))
    .orderBy(desc(aiLearningPatterns.frequencia))
    .limit(10);

  // 4. CONSTRUIR E-MAIL HTML
  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório Diário - Jul.IA</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background: white;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 {
      color: #2563eb;
      border-bottom: 3px solid #2563eb;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    h2 {
      color: #1e40af;
      margin-top: 30px;
      margin-bottom: 15px;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
      margin: 20px 0;
    }
    .stat-card {
      background: #f0f9ff;
      border-left: 4px solid #2563eb;
      padding: 15px;
      border-radius: 4px;
    }
    .stat-number {
      font-size: 32px;
      font-weight: bold;
      color: #2563eb;
      margin: 5px 0;
    }
    .stat-label {
      font-size: 14px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .pattern-card {
      background: #fefce8;
      border-left: 4px solid #eab308;
      padding: 15px;
      margin: 10px 0;
      border-radius: 4px;
    }
    .pattern-question {
      font-weight: bold;
      color: #854d0e;
      margin-bottom: 8px;
    }
    .pattern-response {
      color: #666;
      font-size: 14px;
      margin-bottom: 8px;
    }
    .pattern-meta {
      font-size: 12px;
      color: #999;
      display: flex;
      gap: 15px;
    }
    .pending-card {
      background: #fef2f2;
      border-left: 4px solid #ef4444;
      padding: 15px;
      margin: 10px 0;
      border-radius: 4px;
    }
    .empty-state {
      text-align: center;
      padding: 40px;
      color: #94a3b8;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      color: #64748b;
      font-size: 14px;
    }
    .btn {
      display: inline-block;
      background: #2563eb;
      color: white;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 4px;
      margin: 10px 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📊 Relatório Diário - Jul.IA</h1>
    <p style="color: #64748b;">Resumo de ${new Date().toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}</p>

    <h2>📈 Estatísticas do Dia</h2>
    <div class="stats">
      <div class="stat-card">
        <div class="stat-label">Novos Leads</div>
        <div class="stat-number">${stats.newLeads}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Total de Leads</div>
        <div class="stat-number">${stats.totalLeads}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Conversas</div>
        <div class="stat-number">${stats.totalConversations}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Mensagens Recebidas</div>
        <div class="stat-number">${stats.clientMessages}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Respostas da Jul.IA</div>
        <div class="stat-number">${stats.juliaMessages}</div>
      </div>
    </div>

    <h2>🎓 O que a Jul.IA Aprendeu Hoje</h2>
    ${
      newPatterns.length > 0
        ? newPatterns
            .map(
              (pattern) => `
      <div class="pattern-card">
        <div class="pattern-question">❓ ${pattern.padrao}</div>
        <div class="pattern-response">💬 ${pattern.respostaSugerida || 'Sem resposta sugerida'}</div>
        <div class="pattern-meta">
          <span>🔄 Frequência: ${pattern.frequencia}x</span>
          <span>${pattern.aprovado ? '✅ Aprovado' : '⏳ Pendente'}</span>
        </div>
      </div>
    `
            )
            .join('')
        : '<div class="empty-state">Nenhum novo aprendizado hoje</div>'
    }

    <h2>⏳ Padrões Pendentes de Aprovação</h2>
    ${
      pendingPatterns.length > 0
        ? `
      <p style="color: #dc2626; font-weight: bold;">
        ⚠️ ${pendingPatterns.length} padrão(ões) aguardando sua aprovação
      </p>
      ${pendingPatterns
        .map(
          (pattern) => `
        <div class="pending-card">
          <div class="pattern-question">❓ ${pattern.padrao}</div>
          <div class="pattern-response">💬 ${pattern.respostaSugerida || 'Sem resposta sugerida'}</div>
          <div class="pattern-meta">
            <span>🔄 Frequência: ${pattern.frequencia}x</span>
            <span>📅 Última vez: ${new Date(pattern.ultimaOcorrencia).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      `
        )
        .join('')}
      <div style="text-align: center; margin-top: 20px;">
        <a href="https://3000-i9eazc49dkftpwcqj2k2o-d0327918.manusvm.computer" class="btn">
          🔍 Revisar no Dashboard
        </a>
      </div>
    `
        : '<div class="empty-state">✅ Nenhum padrão pendente de aprovação</div>'
    }

    <div class="footer">
      <p>Este é um relatório automático gerado pela Jul.IA</p>
      <p>Para gerenciar os aprendizados, acesse o <a href="https://3000-i9eazc49dkftpwcqj2k2o-d0327918.manusvm.computer">Dashboard</a></p>
    </div>
  </div>
</body>
</html>
  `;

  return html;
}

/**
 * Envia relatório diário por e-mail
 */
export async function sendDailyLearningReport(email: string): Promise<void> {
  try {
    const html = await generateDailyLearningReport();
    
    // TODO: Implementar envio de e-mail usando serviço de e-mail
    // Por enquanto, apenas log
    console.log(`[Daily Report] Relatório gerado para ${email}`);
    console.log(`[Daily Report] Tamanho: ${html.length} caracteres`);
    
    // Aqui você pode integrar com serviço de e-mail (SendGrid, AWS SES, etc)
    // await sendEmail({
    //   to: email,
    //   subject: `📊 Relatório Diário - Jul.IA - ${new Date().toLocaleDateString('pt-BR')}`,
    //   html: html,
    // });
    
  } catch (error) {
    console.error("[Daily Report] Erro ao enviar relatório:", error);
    throw error;
  }
}
