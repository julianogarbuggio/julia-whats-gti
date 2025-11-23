import { notifyOwner } from "../_core/notification";

/**
 * Serviço de Monitoramento de Saúde das APIs Externas
 * 
 * Monitora GTI-API, Z-API e ZapSign
 * Envia notificação ao owner quando detectar instabilidade
 */

interface APIStatus {
  name: string;
  url: string;
  status: 'online' | 'offline' | 'degraded';
  lastCheck: Date;
  responseTime?: number;
  error?: string;
}

interface HealthCheckResult {
  timestamp: Date;
  apis: APIStatus[];
  allHealthy: boolean;
}

// Cache de status para evitar spam de notificações
const lastNotificationTime: Record<string, Date> = {};
const NOTIFICATION_COOLDOWN_MS = 30 * 60 * 1000; // 30 minutos

/**
 * Verifica se uma API está respondendo
 */
async function checkAPI(name: string, url: string, timeout = 10000): Promise<APIStatus> {
  const startTime = Date.now();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Jul.IA-Health-Monitor/1.0'
      }
    });
    
    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;
    
    // Considera online se responder com qualquer status HTTP
    // (mesmo 401/403 indica que API está funcionando)
    const status = response.ok || response.status === 401 || response.status === 403
      ? 'online'
      : response.status >= 500
      ? 'degraded'
      : 'online';
    
    return {
      name,
      url,
      status,
      lastCheck: new Date(),
      responseTime
    };
  } catch (error: any) {
    return {
      name,
      url,
      status: 'offline',
      lastCheck: new Date(),
      error: error.message || 'Timeout ou erro de conexão'
    };
  }
}

/**
 * Envia notificação se API estiver offline
 * (com cooldown para evitar spam)
 */
async function notifyIfNeeded(api: APIStatus): Promise<void> {
  if (api.status === 'online') {
    // Limpa cooldown se voltou a funcionar
    delete lastNotificationTime[api.name];
    return;
  }
  
  const lastNotif = lastNotificationTime[api.name];
  const now = new Date();
  
  // Verifica cooldown
  if (lastNotif && (now.getTime() - lastNotif.getTime()) < NOTIFICATION_COOLDOWN_MS) {
    console.log(`[HealthMonitor] ⏳ Cooldown ativo para ${api.name}, não enviando notificação`);
    return;
  }
  
  // Envia notificação
  const statusEmoji = api.status === 'offline' ? '🔴' : '🟡';
  const title = `${statusEmoji} ${api.name} ${api.status === 'offline' ? 'OFFLINE' : 'DEGRADADO'}`;
  const content = `
**API:** ${api.name}
**Status:** ${api.status.toUpperCase()}
**URL:** ${api.url}
**Erro:** ${api.error || 'Sem detalhes'}
**Horário:** ${api.lastCheck.toLocaleString('pt-BR')}

⚠️ **AÇÃO NECESSÁRIA:** Verifique o serviço imediatamente!
  `.trim();
  
  const sent = await notifyOwner({ title, content });
  
  if (sent) {
    lastNotificationTime[api.name] = now;
    console.log(`[HealthMonitor] 📧 Notificação enviada para ${api.name}`);
  } else {
    console.error(`[HealthMonitor] ❌ Falha ao enviar notificação para ${api.name}`);
  }
}

/**
 * Executa health check completo de todas as APIs
 */
export async function runHealthCheck(): Promise<HealthCheckResult> {
  console.log('[HealthMonitor] 🏥 Iniciando health check...');
  
  const apis: APIStatus[] = await Promise.all([
    // GTI-API
    checkAPI(
      'GTI-API',
      process.env.GTI_BASE_URL || 'https://api.gti1.com.br',
      10000
    ),
    
    // Z-API
    checkAPI(
      'Z-API',
      process.env.ZAPI_BASE_URL || 'https://api.z-api.io',
      10000
    ),
    
    // ZapSign
    checkAPI(
      'ZapSign',
      process.env.ZAPSIGN_BASE_URL || 'https://api.zapsign.com.br',
      10000
    )
  ]);
  
  // Envia notificações se necessário
  await Promise.all(apis.map(api => notifyIfNeeded(api)));
  
  const allHealthy = apis.every(api => api.status === 'online');
  
  const result: HealthCheckResult = {
    timestamp: new Date(),
    apis,
    allHealthy
  };
  
  console.log(`[HealthMonitor] ✅ Health check concluído: ${allHealthy ? 'TODAS OK' : 'PROBLEMAS DETECTADOS'}`);
  apis.forEach(api => {
    const emoji = api.status === 'online' ? '✅' : api.status === 'degraded' ? '🟡' : '🔴';
    console.log(`  ${emoji} ${api.name}: ${api.status} (${api.responseTime || '?'}ms)`);
  });
  
  return result;
}

/**
 * Inicia monitoramento contínuo (executa a cada 5 minutos)
 */
export function startHealthMonitoring(intervalMinutes = 5): NodeJS.Timeout {
  console.log(`[HealthMonitor] 🚀 Iniciando monitoramento contínuo (intervalo: ${intervalMinutes}min)`);
  
  // Executa imediatamente
  runHealthCheck();
  
  // Agenda execuções periódicas
  return setInterval(() => {
    runHealthCheck();
  }, intervalMinutes * 60 * 1000);
}
