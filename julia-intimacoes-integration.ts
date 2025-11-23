 * Serviço de Integração com Jul.IA Intimações
 * 
 * Funcionalidades:
 * 1. Enviar dados do cliente quando qualificado (webhook)
 * 2. Receber notificações de audiências
 * 3. Sincronização bidirecional de clientes
 */

import { getDb } from "../db";
import { leads } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const JULIA_INTIMACOES_URL = "https://juliaiga-intimacoes.manus.space";
const WEBHOOK_ENDPOINT = "/api/webhooks/clientes";

/**
 * Interface de dados do cliente para enviar ao Jul.IA Intimações
 */
interface ClienteData {
  nomeCompleto: string;
  cpf?: string;
  whatsapp: string;
  email?: string;
  dataNascimento?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  origem: string;
  externalId: string; // ID do lead no sistema WhatsApp
}

/**
 * Envia dados do cliente para Jul.IA Intimações via webhook
 */
export async function enviarClienteParaIntimacoes(leadId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.error("[Integração Intimações] Database não disponível");
    return false;
  }

  try {
    // Buscar dados do lead
    const leadData = await db
      .select()