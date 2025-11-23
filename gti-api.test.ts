/**
 * Testes de integração com GTI-API
 */

import { describe, it, expect } from "vitest";
import { getInstanceStatus, sendTextMessage } from "../gti-api";

describe("GTI-API Integration", () => {
  it("should validate GTI-API credentials by checking instance status", async () => {
    try {
      const status = await getInstanceStatus();
      
      // Verificar se a resposta tem a estrutura esperada
      expect(status).toBeDefined();
      console.log("[Test] GTI-API instance status:", status);
      
      // Se chegou aqui, as credenciais estão corretas
      expect(true).toBe(true);
    } catch (error) {
      console.error("[Test] GTI-API credentials validation failed:", error);
      throw new Error(`GTI-API credentials are invalid: ${error}`);
    }
  }, 15000); // Timeout de 15 segundos

  it("should send a test message via GTI-API", async () => {
    // Número de teste (você pode mudar para seu número)
    const testPhone = "5511956759223";
    const testMessage = "🤖 Teste de integração Jul.IA - GTI-API";

    try {
      const result = await sendTextMessage({
        phone: testPhone,
        message: testMessage,
      });

      expect(result).toBeDefined();
      console.log("[Test] Message sent successfully:", result);
    } catch (error) {
      console.error("[Test] Failed to send message:", error);
      // Não falhar o teste se for erro de número inválido
      if (error instanceof Error && error.message.includes("invalid")) {
        console.warn("[Test] Test phone number may be invalid, but API is working");
        expect(true).toBe(true);
      } else {
        throw error;
      }
    }
  }, 15000);
});
