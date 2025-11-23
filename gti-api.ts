 * Serviço de integração com GTI-API (WhatsApp Business API)
 * Baseado na Evolution API
 */

const GTI_BASE_URL = process.env.GTI_BASE_URL || "https://apivip.gti-api.com";
const GTI_INSTANCE_ID = process.env.GTI_INSTANCE_ID || "69205AC00B88";
const GTI_API_KEY = process.env.GTI_API_KEY || "6920588040029";

interface SendMessageParams {
  phone: string;
  message: string;
}

interface SendButtonsParams {
  phone: string;
  message: string;
  buttons: Array<{ id: string; label: string }>;
}

/**
 * Envia uma mensagem de texto simples via WhatsApp
 */
export async function sendTextMessage({ phone, message }: SendMessageParams) {
  if (!GTI_INSTANCE_ID || !GTI_API_KEY) {
    throw new Error("GTI-API credentials not configured");
  }

  // Formatar número para padrão internacional (sem +)
  const formattedPhone = phone.replace(/\D/g, "");

  const url = `${GTI_BASE_URL}/message/sendText/${GTI_INSTANCE_ID}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": GTI_API_KEY,
      },
      body: JSON.stringify({
        number: formattedPhone,
        text: message,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`GTI-API error: ${response.status} - ${errorData}`);
    }