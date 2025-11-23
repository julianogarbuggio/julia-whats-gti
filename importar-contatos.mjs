/**
 * Script de Importação de Contatos do CSV
 * Importa contatos do Google Contacts para a tabela de clientes
 * 
 * Uso: node server/scripts/importar-contatos.mjs /caminho/para/contacts.csv
 */

import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import mysql from 'mysql2/promise';

// Conectar ao banco
let connection = null;

async function getConnection() {
  if (!connection) {
    connection = await mysql.createConnection(process.env.DATABASE_URL);
  }
  return connection;
}

/**
 * Normaliza número de telefone para formato padrão
 * Remove espaços, parênteses, hífens e adiciona +55 se necessário
 */
function normalizarTelefone(telefone) {
  if (!telefone) return null;
  
  // Remove caracteres especiais
  let limpo = telefone.replace(/[\s\-\(\)\.]/g, '');
  
  // Remove + do início se existir
  limpo = limpo.replace(/^\+/, '');
  
  // Se não começa com 55, adiciona
  if (!limpo.startsWith('55')) {
    limpo = '55' + limpo;
  }
  
  // Valida tamanho (55 + DDD + número)
  // Celular: 55 + 2 dígitos (DDD) + 9 dígitos = 13 dígitos
  // Fixo: 55 + 2 dígitos (DDD) + 8 dígitos = 12 dígitos
  if (limpo.length < 12 || limpo.length > 13) {
    return null; // Número inválido
  }
  
  return limpo;
}

/**
 * Extrai primeiro nome de um nome completo
 */
function extrairPrimeiroNome(nomeCompleto) {
  if (!nomeCompleto) return null;
  
  // Remove pontos e vírgulas
  const limpo = nomeCompleto.replace(/[.,]/g, '').trim();
  
  // Pega primeira palavra
  const partes = limpo.split(/\s+/);
  return partes[0] || null;
}

/**
 * Processa arquivo CSV e retorna array de contatos válidos
 */
function processarCSV(caminhoArquivo) {
  console.log(`📂 Lendo arquivo: ${caminhoArquivo}`);
  
  const conteudo = readFileSync(caminhoArquivo, 'utf-8');
  const registros = parse(conteudo, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
  
  console.log(`📊 Total de registros no CSV: ${registros.length}`);
  
  const contatos = [];
  const erros = [];
  
  for (const registro of registros) {
    // Monta nome completo
    const firstName = registro['First Name'] || '';
    const middleName = registro['Middle Name'] || '';
    const lastName = registro['Last Name'] || '';
    const nomeCompleto = [firstName, middleName, lastName]
      .filter(Boolean)
      .join(' ')
      .trim();
    
    // Pega telefone (prioriza Mobile, depois outros)
    const telefone1 = registro['Phone 1 - Value'];
    const telefone2 = registro['Phone 2 - Value'];
    const telefone3 = registro['Phone 3 - Value'];
    
    const telefoneRaw = telefone1 || telefone2 || telefone3;
    const telefone = normalizarTelefone(telefoneRaw);
    
    // Valida
    if (!nomeCompleto) {
      erros.push({ linha: contatos.length + erros.length + 2, motivo: 'Nome vazio' });
      continue;
    }
    
    if (!telefone) {
      erros.push({ 
        linha: contatos.length + erros.length + 2, 
        nome: nomeCompleto,
        telefoneRaw,
        motivo: 'Telefone inválido' 
      });
      continue;
    }
    
    // Adiciona contato válido
    contatos.push({
      nomeCompleto,
      primeiroNome: extrairPrimeiroNome(nomeCompleto),
      whatsapp: telefone,
      email: registro['E-mail 1 - Value'] || null,
      origem: 'importacao',
      observacoes: `Importado do Google Contacts em ${new Date().toISOString()}`,
      ativo: true,
    });
  }
  
  console.log(`\n✅ Contatos válidos: ${contatos.length}`);
  console.log(`❌ Contatos inválidos: ${erros.length}`);
  
  if (erros.length > 0) {
    console.log(`\n⚠️  Primeiros 10 erros:`);
    erros.slice(0, 10).forEach(erro => {
      console.log(`  Linha ${erro.linha}: ${erro.nome || 'Sem nome'} - ${erro.motivo}`);
      if (erro.telefoneRaw) {
        console.log(`    Telefone original: ${erro.telefoneRaw}`);
      }
    });
  }
  
  return { contatos, erros };
}

/**
 * Importa contatos para o banco de dados
 */
async function importarContatos(contatos) {
  console.log(`\n💾 Importando ${contatos.length} contatos para o banco...`);
  
  const conn = await getConnection();
  
  let importados = 0;
  let duplicados = 0;
  let errosImportacao = 0;
  
  for (const contato of contatos) {
    try {
      const sql = `
        INSERT INTO clientes (
          nomeCompleto, whatsapp, email, origem, observacoes, ativo, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      
      await conn.execute(sql, [
        contato.nomeCompleto,
        contato.whatsapp,
        contato.email,
        contato.origem,
        contato.observacoes,
        contato.ativo
      ]);
      
      importados++;
      
      if (importados % 100 === 0) {
        console.log(`  ✅ ${importados}/${contatos.length} importados...`);
      }
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        duplicados++;
      } else {
        errosImportacao++;
        console.error(`  ❌ Erro ao importar ${contato.nomeCompleto}:`, error.message);
      }
    }
  }
  
  console.log(`\n📊 Resultado da Importação:`);
  console.log(`  ✅ Importados: ${importados}`);
  console.log(`  ⚠️  Duplicados (já existiam): ${duplicados}`);
  console.log(`  ❌ Erros: ${errosImportacao}`);
  
  return { importados, duplicados, errosImportacao };
}

/**
 * Main
 */
async function main() {
  const caminhoArquivo = process.argv[2];
  
  if (!caminhoArquivo) {
    console.error('❌ Uso: node importar-contatos.mjs /caminho/para/contacts.csv');
    process.exit(1);
  }
  
  try {
    // Processa CSV
    const { contatos, erros } = processarCSV(caminhoArquivo);
    
    if (contatos.length === 0) {
      console.error('❌ Nenhum contato válido encontrado no CSV!');
      process.exit(1);
    }
    
    // Confirma importação
    console.log(`\n⚠️  Você está prestes a importar ${contatos.length} contatos.`);
    console.log(`   Deseja continuar? (Ctrl+C para cancelar)`);
    
    // Aguarda 3 segundos
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Importa
    const resultado = await importarContatos(contatos);
    
    console.log(`\n🎉 Importação concluída!`);
    console.log(`\n📋 Resumo Final:`);
    console.log(`  📂 Total no CSV: ${contatos.length + erros.length}`);
    console.log(`  ✅ Válidos: ${contatos.length}`);
    console.log(`  ❌ Inválidos: ${erros.length}`);
    console.log(`  💾 Importados: ${resultado.importados}`);
    console.log(`  ⚠️  Duplicados: ${resultado.duplicados}`);
    console.log(`  ❌ Erros: ${resultado.errosImportacao}`);
    
  } catch (error) {
    console.error('❌ Erro fatal:', error);
    if (connection) await connection.end();
    process.exit(1);
  }
  
  if (connection) await connection.end();
  process.exit(0);
}

main();
