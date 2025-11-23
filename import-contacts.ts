#!/usr/bin/env tsx
/**
 * Script para importar contatos do CSV e atualizar leads existentes
 * 
 * Funcionalidades:
 * 1. Ler CSV de contatos exportado do Google Contacts
 * 2. Extrair nome e telefone de cada contato
 * 3. Normalizar números de telefone (remover formatação)
 * 4. Atualizar leads existentes com nomes dos contatos
 */

import { readFileSync } from 'fs';
import { drizzle } from 'drizzle-orm/mysql2';
import { leads } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL não configurada');
  process.exit(1);
}

const db = drizzle(DATABASE_URL);

/**
 * Normaliza número de telefone removendo caracteres especiais
 * Mantém apenas dígitos
 */
function normalizePhone(phone: string | null | undefined): string | null {
  if (!phone) return null;
  
  // Remove tudo exceto dígitos
  let normalized = phone.replace(/\D/g, '');
  
  // Remove código do país se tiver (55)
  if (normalized.startsWith('55')) {
    normalized = normalized.substring(2);
  }
  
  // Remove zeros à esquerda
  normalized = normalized.replace(/^0+/, '');
  
  return normalized;
}

/**
 * Extrai nome do contato (primeira coluna do CSV)
 */
function extractName(nameField: string | null | undefined): string | null {
  if (!nameField) return null;
  
  // Remove pontos iniciais e espaços extras
  let name = nameField.trim().replace(/^\.+\s*/, '');
  
  // Remove sufixos comuns (Jec, Hu, Sp, etc)
  name = name.replace(/\s+(Jec|Hu|Sp|Sdi|Data|Base|Civel|Mva|FAM)$/i, '');
  
  // Capitaliza primeira letra de cada palavra
  name = name.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  return name || null;
}

/**
 * Processa CSV e retorna mapeamento telefone -> nome
 */
function processCSV(csvPath: string): Map<string, string> {
  console.log('📄 Lendo CSV:', csvPath);
  
  const content = readFileSync(csvPath, 'utf-8');
  const lines = content.split('\n');
  
  console.log(`📊 Total de linhas: ${lines.length}`);
  
  const phoneToName = new Map<string, string>();
  let processedCount = 0;
  let skippedCount = 0;
  
  // Pular header (linha 1)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // CSV é separado por vírgulas, mas nome pode ter vírgulas
    // Formato: Name,Given Name,Additional Name,...,Phone 1 - Type,Phone 1 - Value,...
    const fields = line.split(',');
    
    if (fields.length < 20) {
      skippedCount++;
      continue;
    }
    
    // Nome está na primeira coluna (índice 0)
    const nameField = fields[0];
    
    // Telefone está na coluna 20 (Phone 1 - Value)
    const phoneField = fields[20];
    
    if (!phoneField) {
      skippedCount++;
      continue;
    }
    
    const name = extractName(nameField);
    
    // Pode ter múltiplos telefones separados por :::
    const phones = phoneField.split(':::').map(p => p.trim());
    
    for (const phone of phones) {
      const normalized = normalizePhone(phone);
      
      if (normalized && normalized.length >= 10 && name) {
        phoneToName.set(normalized, name);
        processedCount++;
      }
    }
  }
  
  console.log(`✅ Processados: ${processedCount} telefones`);
  console.log(`⏭️  Ignorados: ${skippedCount} linhas sem telefone`);
  console.log(`📞 Total de contatos únicos: ${phoneToName.size}`);
  
  return phoneToName;
}

/**
 * Atualiza leads no banco de dados com nomes dos contatos
 */
async function updateLeads(phoneToName: Map<string, string>): Promise<void> {
  console.log('\n🔄 Atualizando leads no banco de dados...');
  
  // Buscar todos os leads
  const allLeads = await db.select().from(leads);
  
  console.log(`📊 Total de leads no banco: ${allLeads.length}`);
  
  let updatedCount = 0;
  let notFoundCount = 0;
  
  for (const lead of allLeads) {
    const leadPhone = normalizePhone(lead.clienteWhatsapp);
    
    if (!leadPhone) {
      notFoundCount++;
      continue;
    }
    
    const contactName = phoneToName.get(leadPhone);
    
    if (contactName) {
      // Atualizar apenas se nome for diferente
      if (lead.clienteNome !== contactName) {
        await db
          .update(leads)
          .set({ clienteNome: contactName })
          .where(eq(leads.id, lead.id));
        
        console.log(`✅ Atualizado: ${lead.clienteWhatsapp} -> ${contactName}`);
        updatedCount++;
      }
    } else {
      notFoundCount++;
    }
  }
  
  console.log(`\n📊 Resumo:`);
  console.log(`   ✅ Atualizados: ${updatedCount}`);
  console.log(`   ⏭️  Não encontrados: ${notFoundCount}`);
}

/**
 * Main
 */
async function main() {
  console.log('🚀 Iniciando importação de contatos...\n');
  
  const csvPath = process.argv[2] || '/home/ubuntu/upload/contacts.csv';
  
  try {
    // 1. Processar CSV
    const phoneToName = processCSV(csvPath);
    
    // 2. Atualizar leads
    await updateLeads(phoneToName);
    
    console.log('\n✅ Importação concluída com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erro na importação:', error);
    process.exit(1);
  }
}

main();
