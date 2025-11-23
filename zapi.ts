 * Serviço de integração com Z-API (WhatsApp Business API)
 * Documentação: https://developer.z-api.io/
 */

const ZAPI_BASE_URL = process.env.ZAPI_BASE_URL || "https://api.z-api.io";
const ZAPI_INSTANCE_ID = process.env.ZAPI_INSTANCE_ID;
const ZAPI_TOKEN = process.env.ZAPI_TOKEN;
const ZAPI_CLIENT_TOKEN = process.env.ZAPI_CLIENT_TOKEN;

interface SendMessageParams {
  phone: string;
  message: string;
}

interface SendButtonsParams {
  phone: string;
  message: string;
  buttons: Array<{ id: string; label: string }>;
}

interface SendListParams {
  phone: string;
  message: string;
  buttonText: string;
  sections: Array<{
    title: string;
    rows: Array<{ id: string; title: string; description?: string }>;
  }>;
}

/**
 * Envia uma mensagem de texto simples via WhatsApp
 */
export async function sendTextMessage({ phone, message }: SendMessageParams) {
  if (!ZAPI_INSTANCE_ID || !ZAPI_TOKEN) {
    throw new Error("Z-API credentials not configured");
  }

  const url = `${ZAPI_BASE_URL}/instances/${ZAPI_INSTANCE_ID}/token/${ZAPI_TOKEN}/send-text`;
  
  console.log("[Z-API] Enviando mensagem...");
  console.log("[Z-API] URL completa:", url);
  console.log("[Z-API] ZAPI_BASE_URL:", ZAPI_BASE_URL);
  console.log("[Z-API] ZAPI_INSTANCE_ID:", ZAPI_INSTANCE_ID?.substring(0, 10) + "...");
  console.log("[Z-API] ZAPI_TOKEN:", ZAPI_TOKEN?.substring(0, 10) + "...");
  console.log("[Z-API] ZAPI_CLIENT_TOKEN:", ZAPI_CLIENT_TOKEN ? ZAPI_CLIENT_TOKEN.substring(0, 10) + "..." : "(não configurado)");

  try {
    const headers: Record<string, string> = {