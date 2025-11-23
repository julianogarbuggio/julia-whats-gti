/**
 * Integração com ChatGPT via GPT Actions/Plugins
 * 
 * Este arquivo fornece endpoints para integração da Jul.IA com ChatGPT,
 * permitindo que o ChatGPT use as funcionalidades do chatbot via API.
 */

import { Request, Response } from "express";
import { generateAIResponse } from "./services/ai-chatbot";
import { filtrarResposta, adicionarDisclaimerSeNecessario } from "./services/ai-security-filters";

/**
 * Webhook para receber mensagens do ChatGPT
 * POST /api/chatgpt-webhook
 * 
 * Body:
 * {
 *   "message": "string",
 *   "context": "string (optional)",
 *   "userId": "string (optional)"
 * }
 */
export async function chatgptWebhook(req: Request, res: Response) {
  try {
    const { message, context, userId } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Missing required field: message"
      });
    }

    // Gerar resposta com a IA
    const aiResponse = await generateAIResponse(message, context || "");
    const responseText = typeof aiResponse === 'string' ? aiResponse : aiResponse.response;

    // Aplicar filtros de segurança jurídica
    const filteredResponse = await filtrarResposta(responseText, {});
    // ChatGPT sempre adiciona disclaimer (não temos histórico de conversa)
    const finalResponse = adicionarDisclaimerSeNecessario(filteredResponse, true, false);

    return res.json({
      success: true,
      response: finalResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[ChatGPT Webhook] Error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: String(error),
    });
  }
}

/**
 * Endpoint para enviar mensagens para o ChatGPT
 * POST /api/chatgpt-send
 * 
 * Body:
 * {
 *   "phone": "string",
 *   "message": "string"
 * }
 */
export async function chatgptSend(req: Request, res: Response) {
  try {
    const { phone, message } = req.body;

    if (!phone || !message) {
      return res.status(400).json({
        error: "Missing required fields: phone, message"
      });
    }

    // Enviar mensagem via Z-API
    const { sendTextMessage } = await import("./services/zapi");
    await sendTextMessage({ phone, message });

    return res.json({
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[ChatGPT Send] Error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: String(error),
    });
  }
}

/**
 * Endpoint de health check
 * GET /api/chatgpt-health
 */
export function chatgptHealth(req: Request, res: Response) {
  return res.json({
    status: "ok",
    service: "Jul.IA ChatGPT Integration",
    timestamp: new Date().toISOString(),
  });
}
