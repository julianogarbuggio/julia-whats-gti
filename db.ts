import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  leads,
  conversations,
  chatbotConfig,
  integrations,
  metrics,
  webhookLogs,
  type Lead,
  type InsertLead,
  type Conversation,
  type InsertConversation,
  type ChatbotConfig,
  type InsertChatbotConfig,
  type Integration,
  type InsertIntegration,
  type Metric,
  type InsertMetric,
  type WebhookLog,
  type InsertWebhookLog
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;