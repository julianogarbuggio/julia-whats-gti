/**
 * Sistema de Backup Automático
 * Baseado no sistema de backup da Jul.IA Plataforma
 * Realiza backup completo do banco de dados e envia para S3
 */

import { getDb } from "../db";
import { 
  clientes, 
  leads, 
  conversations, 
  chatbotConfig, 
  integrations, 
  metrics, 
  webhookLogs,
  documentos
} from "../../drizzle/schema";
import { storagePut } from "../storage";
import { exec } from "child_process";
import { promisify } from "util";
import * as fs from "fs/promises";
import * as path from "path";
import * as zlib from "zlib";

const execAsync = promisify(exec);

interface BackupConfig {
  backupDir: string;
  compress: boolean;
  keepLocalCopies: number;
  tables: string[];
  retention: {
    localDays: number;
    s3Days: number;
  };
}

const DEFAULT_CONFIG: BackupConfig = {
  backupDir: "/tmp/julia-whatsapp-backups",
  compress: true,
  keepLocalCopies: 10,
  tables: [
    "clientes",
    "leads",
    "conversations",
    "chatbotConfig",
    "integrations",
    "metrics",
    "webhookLogs",
    "documentos",
  ],
  retention: {
    localDays: 30,
    s3Days: 365,
  },
};

interface BackupData {
  timestamp: string;
  version: string;
  system: string;
  tables: Record<string, any[]>;
  stats: {
    totalRecords: number;
    tablesCounts: Record<string, number>;
  };
}

/**
 * Cria um backup completo do banco de dados
 */
export async function createBackup(config: Partial<BackupConfig> = {}): Promise<{
  success: boolean;
  filePath?: string;
  s3Url?: string;
  stats?: any;
  error?: string;
}> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  try {
    console.log("[Backup] Iniciando backup automático...");
    
    // Criar diretório de backup se não existir
    await fs.mkdir(finalConfig.backupDir, { recursive: true });
    
    // Obter dados de todas as tabelas
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }
    
    const backupData: BackupData = {
      timestamp: new Date().toISOString(),
      version: "1.0",
      system: "Jul.IA - Assistente de WhatsApp",
      tables: {},
      stats: {
        totalRecords: 0,
        tablesCounts: {},
      },
    };
    
    // Backup de cada tabela
    console.log("[Backup] Coletando dados das tabelas...");
    
    if (finalConfig.tables.includes("clientes")) {
      const data = await db.select().from(clientes);
      backupData.tables.clientes = data;
      backupData.stats.tablesCounts.clientes = data.length;
      backupData.stats.totalRecords += data.length;
      console.log(`[Backup] Clientes: ${data.length} registros`);
    }
    
    if (finalConfig.tables.includes("leads")) {
      const data = await db.select().from(leads);
      backupData.tables.leads = data;
      backupData.stats.tablesCounts.leads = data.length;
      backupData.stats.totalRecords += data.length;
      console.log(`[Backup] Leads: ${data.length} registros`);
    }
    
    if (finalConfig.tables.includes("conversations")) {
      const data = await db.select().from(conversations);
      backupData.tables.conversations = data;
      backupData.stats.tablesCounts.conversations = data.length;
      backupData.stats.totalRecords += data.length;
      console.log(`[Backup] Conversas: ${data.length} registros`);
    }
    
    if (finalConfig.tables.includes("chatbotConfig")) {
      const data = await db.select().from(chatbotConfig);
      backupData.tables.chatbotConfig = data;
      backupData.stats.tablesCounts.chatbotConfig = data.length;
      backupData.stats.totalRecords += data.length;
      console.log(`[Backup] Configurações: ${data.length} registros`);
    }
    
    if (finalConfig.tables.includes("integrations")) {
      const data = await db.select().from(integrations);
      backupData.tables.integrations = data;
      backupData.stats.tablesCounts.integrations = data.length;
      backupData.stats.totalRecords += data.length;
      console.log(`[Backup] Integrações: ${data.length} registros`);
    }
    
    if (finalConfig.tables.includes("metrics")) {
      const data = await db.select().from(metrics);
      backupData.tables.metrics = data;
      backupData.stats.tablesCounts.metrics = data.length;
      backupData.stats.totalRecords += data.length;
      console.log(`[Backup] Métricas: ${data.length} registros`);
    }
    
    if (finalConfig.tables.includes("webhookLogs")) {
      const data = await db.select().from(webhookLogs);
      backupData.tables.webhookLogs = data;
      backupData.stats.tablesCounts.webhookLogs = data.length;
      backupData.stats.totalRecords += data.length;
      console.log(`[Backup] Webhook Logs: ${data.length} registros`);
    }
    
    if (finalConfig.tables.includes("documentos")) {
      const data = await db.select().from(documentos);
      backupData.tables.documentos = data;
      backupData.stats.tablesCounts.documentos = data.length;
      backupData.stats.totalRecords += data.length;
      console.log(`[Backup] Documentos: ${data.length} registros`);
    }
    
    // Gerar nome do arquivo
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `backup-${timestamp}.json`;
    const filePath = path.join(finalConfig.backupDir, fileName);
    
    // Salvar JSON
    const jsonContent = JSON.stringify(backupData, null, 2);
    await fs.writeFile(filePath, jsonContent, "utf-8");
    console.log(`[Backup] Backup salvo em: ${filePath}`);
    
    let finalFilePath = filePath;
    let originalSize = Buffer.byteLength(jsonContent);
    let compressedSize = originalSize;
    
    // Comprimir se configurado
    if (finalConfig.compress) {
      const compressedPath = `${filePath}.gz`;
      const compressed = zlib.gzipSync(jsonContent);
      await fs.writeFile(compressedPath, compressed);
      compressedSize = compressed.length;
      finalFilePath = compressedPath;
      
      const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(1);
      console.log(`[Backup] Compressão: ${originalSize} -> ${compressedSize} bytes (${reduction}% redução)`);
      
      // Remover arquivo não comprimido
      await fs.unlink(filePath);
    }
    
    // Upload para S3
    console.log("[Backup] Enviando para S3...");
    const fileContent = await fs.readFile(finalFilePath);
    const s3Key = `backups/julia-whatsapp/${timestamp}/${path.basename(finalFilePath)}`;
    const { url: s3Url } = await storagePut(
      s3Key,
      fileContent,
      finalConfig.compress ? "application/gzip" : "application/json"
    );
    
    console.log(`[Backup] Backup enviado para S3: ${s3Url}`);
    
    // Limpar backups antigos
    await cleanOldBackups(finalConfig);
    
    console.log("[Backup] ✓ Backup criado com sucesso");
    
    return {
      success: true,
      filePath: finalFilePath,
      s3Url,
      stats: backupData.stats,
    };
  } catch (error) {
    console.error("[Backup] Erro ao criar backup:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Remove backups antigos baseado na política de retenção
 */
async function cleanOldBackups(config: BackupConfig): Promise<void> {
  try {
    const files = await fs.readdir(config.backupDir);
    const now = Date.now();
    const retentionMs = config.retention.localDays * 24 * 60 * 60 * 1000;
    
    for (const file of files) {
      if (!file.startsWith("backup-")) continue;
      
      const filePath = path.join(config.backupDir, file);
      const stats = await fs.stat(filePath);
      const age = now - stats.mtimeMs;
      
      if (age > retentionMs) {
        await fs.unlink(filePath);
        console.log(`[Backup] Removido backup antigo: ${file}`);
      }
    }
    
    // Manter apenas os N backups mais recentes
    const backupFiles = files
      .filter(f => f.startsWith("backup-"))
      .map(f => ({
        name: f,
        path: path.join(config.backupDir, f),
        time: 0,
      }));
    
    // Obter timestamps
    for (const file of backupFiles) {
      const stats = await fs.stat(file.path);
      file.time = stats.mtimeMs;
    }
    
    // Ordenar por data (mais recente primeiro)
    backupFiles.sort((a, b) => b.time - a.time);
    
    // Remover backups excedentes
    if (backupFiles.length > config.keepLocalCopies) {
      const toRemove = backupFiles.slice(config.keepLocalCopies);
      for (const file of toRemove) {
        await fs.unlink(file.path);
        console.log(`[Backup] Removido backup excedente: ${file.name}`);
      }
    }
  } catch (error) {
    console.error("[Backup] Erro ao limpar backups antigos:", error);
  }
}

/**
 * Lista todos os backups disponíveis
 */
export async function listBackups(config: Partial<BackupConfig> = {}): Promise<{
  success: boolean;
  backups?: Array<{
    fileName: string;
    filePath: string;
    size: number;
    createdAt: Date;
    compressed: boolean;
  }>;
  error?: string;
}> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  try {
    const files = await fs.readdir(finalConfig.backupDir);
    const backupFiles = files.filter(f => f.startsWith("backup-"));
    
    const backups = [];
    for (const file of backupFiles) {
      const filePath = path.join(finalConfig.backupDir, file);
      const stats = await fs.stat(filePath);
      
      backups.push({
        fileName: file,
        filePath,
        size: stats.size,
        createdAt: stats.mtime,
        compressed: file.endsWith(".gz"),
      });
    }
    
    // Ordenar por data (mais recente primeiro)
    backups.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return {
      success: true,
      backups,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Valida a integridade de um backup
 */
export async function validateBackup(filePath: string): Promise<{
  success: boolean;
  valid?: boolean;
  stats?: any;
  error?: string;
}> {
  try {
    let content: string;
    
    if (filePath.endsWith(".gz")) {
      const compressed = await fs.readFile(filePath);
      content = zlib.gunzipSync(compressed).toString("utf-8");
    } else {
      content = await fs.readFile(filePath, "utf-8");
    }
    
    const data = JSON.parse(content);
    
    // Validar estrutura
    if (!data.timestamp || !data.version || !data.tables) {
      return {
        success: true,
        valid: false,
        error: "Invalid backup structure",
      };
    }
    
    return {
      success: true,
      valid: true,
      stats: data.stats,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
