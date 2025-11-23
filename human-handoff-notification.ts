import { sendTextMessage } from "./zapi";

const DR_JULIANO_PHONE_PERSONAL = "5544999869223"; // (44) 99986-9223
const DR_JULIANO_PHONE_BUSINESS = "5511956759223"; // (11) 95675-9223

/**
 * Envia notificação imediata quando cliente solicita atendimento humano
 */
export async function notifyHumanHandoffRequest(
  clientPhone: string,
  clientName?: string,
  reason?: string,
  lastMessage?: string
): Promise<void> {
  try {
    console.log("[Handoff] 🚨 Solicitação de atendimento humano detectada");

    const clientInfo = clientName || "Cliente não identificado";
    const reasonText = reason || "Cliente solicitou falar com advogado";

    const message = `🚨 *ATENDIMENTO HUMANO SOLICITADO*

👤 *Cliente:* ${clientInfo}
📱 *Telefone:* https://wa.me/${clientPhone}

📋 *Motivo:* ${reasonText}

${lastMessage ? `💬 *Última mensagem:*\n"${lastMessage}"\n\n` : ""}⏰ *Solicitado em:* ${new Date().toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    })}

---
_Notificação automática da Jul.IA_`;

    // Enviar para WhatsApp pessoal (prioritário)
    console.log("[Handoff] 📤 Enviando para WhatsApp pessoal...");
    await sendTextMessage({
      phone: DR_JULIANO_PHONE_PERSONAL,
      message,
    });

    console.log("[Handoff] ✅ Notificação enviada com sucesso!");
  } catch (error) {
    console.error("[Handoff] ❌ Erro ao enviar notificação:", error);

    // Tentar enviar para número alternativo em caso de erro
    try {
      console.log("[Handoff] 🔄 Tentando número alternativo...");
      await sendTextMessage({
        phone: DR_JULIANO_PHONE_BUSINESS,
        message: `🚨 ATENDIMENTO HUMANO SOLICITADO\n\nCliente: ${clientPhone}\n\n(Erro ao enviar para número principal)`,
      });
    } catch (fallbackError) {
      console.error("[Handoff] ❌ Erro também no número alternativo:", fallbackError);
    }
  }
}

/**
 * Detecta se a mensagem do cliente indica solicitação de atendimento humano
 */
export function detectsHumanHandoffRequest(message: string): boolean {
  const handoffKeywords = [
    "falar com advogado",
    "falar com doutor",
    "falar com dr",
    "falar com juliano",
    "atendimento humano",
    "pessoa real",
    "não é robô",
    "quero falar com alguém",
    "preciso falar com",
    "pode me passar",
    "transferir para",
    "contato do advogado",
    "telefone do advogado",
    "ligar para",
    "agendar consulta",
    "marcar horário",
  ];

  const messageLower = message.toLowerCase();
  return handoffKeywords.some((keyword) => messageLower.includes(keyword));
}

/**
 * Detecta se cliente está cobrando andamento do processo
 */
export function detectsProgressInquiry(message: string): boolean {
  const progressKeywords = [
    "quanto tempo",
    "demora quanto",
    "quando vai",
    "já deu entrada",
    "andamento",
    "como está",
    "status do processo",
    "meu processo",
    "minha ação",
    "já protocolou",
    "já entrou com",
    "vai demorar",
    "tá demorando",
    "por que demora",
    "quando sai",
    "previsão",
  ];

  const messageLower = message.toLowerCase();
  return progressKeywords.some((keyword) => messageLower.includes(keyword));
}

/**
 * Detecta se cliente está relatando tentativa de golpe
 */
export function detectsScamReport(message: string): boolean {
  const scamKeywords = [
    "outro número",
    "outro telefone",
    "me ligaram",
    "me chamaram",
    "número diferente",
    "telefone diferente",
    "outro whatsapp",
    "número estranho",
    "pedindo dinheiro",
    "pedindo pagamento",
    "pedir pix",
    "pagar boleto",
    "golpe",
    "suspeito",
    "clone",
    "falso",
  ];

  const messageLower = message.toLowerCase();
  return scamKeywords.some((keyword) => messageLower.includes(keyword));
}

/**
 * Envia notificação ENFÁTICA quando cliente cobra andamento
 */
export async function notifyProgressInquiry(
  clientPhone: string,
  clientName?: string,
  clientMessage?: string
): Promise<void> {
  try {
    console.log("[⚠️ Cobrança] Cliente cobrando andamento detectado");

    const clientInfo = clientName || "Cliente não identificado";

    const message = `⚠️ *CLIENTE COBRANDO ANDAMENTO!*

🚨 *URGENTE - RESPONDER PRIORIDADE*

👤 *Cliente:* ${clientInfo}
📱 *Telefone:* https://wa.me/${clientPhone}

💬 *Mensagem do cliente:*
"${clientMessage}"

⏰ *Cobrado em:* ${new Date().toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    })}

📄 *Ação necessária:*
✅ Verificar se cliente já enviou TODA a documentação
✅ Informar status real do caso
✅ Tranquilizar cliente sobre prazo (até 45 dias úteis)

---
_Notificação automática da Jul.IA_`;

    // Enviar para WhatsApp pessoal (prioritário)
    console.log("[⚠️ Cobrança] 📤 Enviando notificação enfática...");
    await sendTextMessage({
      phone: DR_JULIANO_PHONE_PERSONAL,
      message,
    });

    console.log("[⚠️ Cobrança] ✅ Notificação enviada com sucesso!");
  } catch (error) {
    console.error("[⚠️ Cobrança] ❌ Erro ao enviar notificação:", error);

    // Tentar enviar para número alternativo
    try {
      await sendTextMessage({
        phone: DR_JULIANO_PHONE_BUSINESS,
        message: `⚠️ CLIENTE COBRANDO ANDAMENTO\n\nCliente: ${clientPhone}\nMensagem: ${clientMessage}`,
      });
    } catch (fallbackError) {
      console.error("[⚠️ Cobrança] ❌ Erro também no número alternativo:", fallbackError);
    }
  }
}

/**
 * Envia notificação quando cliente relata tentativa de golpe
 */
export async function notifyScamReport(
  clientPhone: string,
  clientName?: string,
  clientMessage?: string
): Promise<void> {
  try {
    console.log("[🚨 GOLPE] Cliente relatou tentativa de golpe!");

    const clientInfo = clientName || "Cliente não identificado";

    const message = `🚨 *TENTATIVA DE GOLPE RELATADA!*

⚠️ *ALERTA - Cliente recebeu contato suspeito*

👤 *Cliente:* ${clientInfo}
📱 *Telefone:* https://wa.me/${clientPhone}

💬 *Relato do cliente:*
"${clientMessage}"

⏰ *Relatado em:* ${new Date().toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    })}

📄 *Possíveis ações:*
✅ Confirmar se Jul.IA já alertou sobre golpe
✅ Verificar se cliente passou dados/pagou algo
✅ Orientar a bloquear número suspeito
✅ Reforçar números oficiais: (11) 95675-9223 e (44) 99986-9223

---
_Notificação automática da Jul.IA_`;

    // Enviar para WhatsApp pessoal (prioritário)
    console.log("[🚨 GOLPE] 📤 Enviando notificação...");
    await sendTextMessage({
      phone: DR_JULIANO_PHONE_PERSONAL,
      message,
    });

    console.log("[🚨 GOLPE] ✅ Notificação enviada com sucesso!");
  } catch (error) {
    console.error("[🚨 GOLPE] ❌ Erro ao enviar notificação:", error);

    // Tentar enviar para número alternativo
    try {
      await sendTextMessage({
        phone: DR_JULIANO_PHONE_BUSINESS,
        message: `🚨 TENTATIVA DE GOLPE RELATADA\n\nCliente: ${clientPhone}\nRelato: ${clientMessage}`,
      });
    } catch (fallbackError) {
      console.error("[🚨 GOLPE] ❌ Erro também no número alternativo:", fallbackError);
    }
  }
}

/**
 * Detecta se é caso fora do padrão (não consignado)
 */
export function detectsNonStandardCase(message: string): boolean {
  const nonStandardKeywords = [
    // Direito do Consumidor geral
    "produto defeituoso",
    "serviço ruim",
    "não entregaram",
    "cobrança indevida",
    "negativação",
    "serasa",
    "spc",
    "plano de saúde",
    "telefonia",
    "internet",
    "energia elétrica",
    "água",
    "compra online",
    "garantia",
    "troca",
    "devolução",
    "propaganda enganosa",
    "venda casada",
    // Outras áreas
    "trabalhista",
    "demissão",
    "rescisão",
    "horas extras",
    "família",
    "divórcio",
    "pensão",
    "guarda",
    "criminal",
    "processo criminal",
    "boletim de ocorrência",
    "cível",
    "indenização acidente",
    "danos morais",
  ];

  const messageLower = message.toLowerCase();
  return nonStandardKeywords.some((keyword) => messageLower.includes(keyword));
}

/**
 * Envia notificação quando cliente menciona caso fora do padrão
 */
export async function notifyNonStandardCase(
  clientPhone: string,
  clientName?: string,
  clientMessage?: string,
  caseType?: string
): Promise<void> {
  try {
    console.log("[📋 Caso Diferente] Cliente com caso fora do padrão detectado");

    const clientInfo = clientName || "Cliente não identificado";
    const tipo = caseType || "Não identificado";

    const message = `📋 *CASO FORA DO PADRÃO*

ℹ️ *Cliente com caso diferente de consignado*

👤 *Cliente:* ${clientInfo}
📱 *Telefone:* https://wa.me/${clientPhone}

📝 *Tipo de caso:* ${tipo}

💬 *Mensagem do cliente:*
"${clientMessage}"

⏰ *Recebido em:* ${new Date().toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    })}

📄 *Ação necessária:*
✅ Avaliar se é Direito do Consumidor (provavelmente atendemos)
✅ Se for outra área, decidir se aceita ou indica outro profissional
✅ Retornar para cliente confirmando atendimento ou não

---
_Notificação automática da Jul.IA_`;

    // Enviar para WhatsApp pessoal
    console.log("[📋 Caso Diferente] 📤 Enviando notificação...");
    await sendTextMessage({
      phone: DR_JULIANO_PHONE_PERSONAL,
      message,
    });

    console.log("[📋 Caso Diferente] ✅ Notificação enviada com sucesso!");
  } catch (error) {
    console.error("[📋 Caso Diferente] ❌ Erro ao enviar notificação:", error);

    // Tentar enviar para número alternativo
    try {
      await sendTextMessage({
        phone: DR_JULIANO_PHONE_BUSINESS,
        message: `📋 CASO FORA DO PADRÃO\n\nCliente: ${clientPhone}\nMensagem: ${clientMessage}`,
      });
    } catch (fallbackError) {
      console.error("[📋 Caso Diferente] ❌ Erro também no número alternativo:", fallbackError);
    }
  }
}
