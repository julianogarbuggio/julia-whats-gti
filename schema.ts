  messageContent: text("messageContent").notNull(),
  
  // Contexto da conversa
  stepId: varchar("stepId", { length: 50 }), // ID do step no fluxo conversacional
  stepName: varchar("stepName", { length: 255 }), // Nome do step (ex: "welcome", "get_name")
  
  // Metadados
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = typeof conversations.$inferInsert;

/**
 * Tabela de Configurações do Chatbot
 * Armazena configurações gerais do chatbot e mensagens personalizadas
 */
export const chatbotConfig = mysqlTable("chatbotConfig", {
  id: int("id").autoincrement().primaryKey(),
  
  // Configurações gerais
  configKey: varchar("configKey", { length: 255 }).notNull().unique(),
  configValue: text("configValue").notNull(),
  configType: mysqlEnum("configType", ["text", "json", "boolean", "number"]).default("text").notNull(),
  description: text("description"),
  
  // Metadados
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ChatbotConfig = typeof chatbotConfig.$inferSelect;
export type InsertChatbotConfig = typeof chatbotConfig.$inferInsert;

/**
 * Tabela de Integrações
 * Armazena configurações e credenciais das integrações externas
 */
export const integrations = mysqlTable("integrations", {
  id: int("id").autoincrement().primaryKey(),
  
  // Identificação da integração
  integrationName: varchar("integrationName", { length: 100 }).notNull().unique(), // zapi, zapsign, julia_procuracoes, etc
  integrationDisplayName: varchar("integrationDisplayName", { length: 255 }).notNull(),
  integrationStatus: mysqlEnum("integrationStatus", ["active", "inactive", "error"]).default("inactive").notNull(),
  
  // Configurações (armazenadas como JSON)
  configData: text("configData"), // JSON com credenciais e configurações
  