import { eq, or, like, and, desc } from "drizzle-orm";
import { getDb } from "./db";
import { 
  clientes,
  documentos,
  type Cliente,
  type InsertCliente,
  type Documento,
  type InsertDocumento
} from "../drizzle/schema";

// ============================================
// CLIENTES - Funções de gerenciamento de clientes
// ============================================

export async function createCliente(data: InsertCliente): Promise<Cliente | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create cliente: database not available");
    return null;
  }

  try {
    const result = await db.insert(clientes).values(data);
    const insertId = Number(result[0].insertId);
    return await getClienteById(insertId);
  } catch (error) {
    console.error("[Database] Failed to create cliente:", error);
    throw error;
  }
}

export async function getClienteById(id: number): Promise<Cliente | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(clientes).where(eq(clientes.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getClienteByCpf(cpf: string): Promise<Cliente | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(clientes).where(eq(clientes.cpf, cpf)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getClienteByWhatsapp(whatsapp: string): Promise<Cliente | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(clientes).where(eq(clientes.whatsapp, whatsapp)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateCliente(id: number, data: Partial<InsertCliente>): Promise<Cliente | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.update(clientes).set(data).where(eq(clientes.id, id));
    return await getClienteById(id);
  } catch (error) {
    console.error("[Database] Failed to update cliente:", error);
    throw error;
  }
}

export async function searchClientes(query: string): Promise<Cliente[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const searchPattern = `%${query}%`;
    const result = await db.select().from(clientes).where(
      and(
        eq(clientes.ativo, true),
        or(
          like(clientes.nomeCompleto, searchPattern),
          like(clientes.whatsapp, searchPattern),
          like(clientes.cpf, searchPattern)
        )
      )
    ).orderBy(desc(clientes.createdAt));
    
    return result;
  } catch (error) {
    console.error("[Database] Failed to search clientes:", error);
    return [];
  }
}

export async function getAllClientes(limit: number = 100, offset: number = 0, includeInactive: boolean = false): Promise<Cliente[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    if (!includeInactive) {
      const result = await db.select().from(clientes)
        .where(eq(clientes.ativo, true))
        .orderBy(desc(clientes.createdAt))
        .limit(limit)
        .offset(offset);
      return result;
    }
    
    const result = await db.select().from(clientes)
      .orderBy(desc(clientes.createdAt))
      .limit(limit)
      .offset(offset);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get all clientes:", error);
    return [];
  }
}

export async function deleteCliente(id: number, soft: boolean = true): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    if (soft) {
      // Soft delete - apenas marca como inativo
      await db.update(clientes).set({ ativo: false }).where(eq(clientes.id, id));
    } else {
      // Hard delete - remove permanentemente
      await db.delete(clientes).where(eq(clientes.id, id));
    }
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete cliente:", error);
    return false;
  }
}

export async function deleteMultipleClientes(ids: number[], soft: boolean = true): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    for (const id of ids) {
      await deleteCliente(id, soft);
    }
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete multiple clientes:", error);
    return false;
  }
}

/**
 * Busca clientes duplicados baseado em CPF, nome completo ou WhatsApp
 */
export async function findDuplicateClientes(cliente: Partial<InsertCliente>): Promise<Cliente[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const conditions = [];
    
    if (cliente.cpf) {
      conditions.push(eq(clientes.cpf, cliente.cpf));
    }
    
    if (cliente.whatsapp) {
      conditions.push(eq(clientes.whatsapp, cliente.whatsapp));
    }
    
    if (cliente.nomeCompleto) {
      conditions.push(eq(clientes.nomeCompleto, cliente.nomeCompleto));
    }
    
    if (conditions.length === 0) return [];
    
    const result = await db.select().from(clientes).where(or(...conditions));
    return result;
  } catch (error) {
    console.error("[Database] Failed to find duplicate clientes:", error);
    return [];
  }
}

/**
 * Mescla dois clientes, mantendo o principal e removendo o duplicado
 */
export async function mergeClientes(mainId: number, duplicateId: number): Promise<Cliente | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const mainCliente = await getClienteById(mainId);
    const duplicateCliente = await getClienteById(duplicateId);
    
    if (!mainCliente || !duplicateCliente) {
      throw new Error("One or both clientes not found");
    }
    
    // Mesclar dados - prioriza dados não vazios do duplicado
    const mergedData: Partial<InsertCliente> = {};
    
    const fields: (keyof InsertCliente)[] = [
      "nacionalidade", "dataNascimento", "estadoCivil", "profissao",
      "rg", "rgUf", "cpf", "endereco", "numero", "complemento",
      "bairro", "cidade", "estado", "cep", "whatsapp", "email", "observacoes"
    ];
    
    fields.forEach(field => {
      if (!mainCliente[field] && duplicateCliente[field]) {
        (mergedData as any)[field] = duplicateCliente[field];
      }
    });
    
    // Atualizar cliente principal com dados mesclados
    if (Object.keys(mergedData).length > 0) {
      await updateCliente(mainId, mergedData);
    }
    
    // Atualizar documentos do duplicado para apontar para o principal
    await db.update(documentos)
      .set({ clienteId: mainId })
      .where(eq(documentos.clienteId, duplicateId));
    
    // Remover duplicado (soft delete)
    await deleteCliente(duplicateId, true);
    
    return await getClienteById(mainId);
  } catch (error) {
    console.error("[Database] Failed to merge clientes:", error);
    throw error;
  }
}

// ============================================
// DOCUMENTOS - Funções de gerenciamento de documentos
// ============================================

export async function createDocumento(data: InsertDocumento): Promise<Documento | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(documentos).values(data);
    const insertId = Number(result[0].insertId);
    const documento = await db.select().from(documentos).where(eq(documentos.id, insertId)).limit(1);
    return documento.length > 0 ? documento[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create documento:", error);
    throw error;
  }
}

export async function getDocumentosByClienteId(clienteId: number): Promise<Documento[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db.select().from(documentos).where(eq(documentos.clienteId, clienteId)).orderBy(desc(documentos.createdAt));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get documentos:", error);
    return [];
  }
}

export async function getDocumentosByLeadId(leadId: number): Promise<Documento[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db.select().from(documentos).where(eq(documentos.leadId, leadId)).orderBy(desc(documentos.createdAt));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get documentos by lead:", error);
    return [];
  }
}

export async function deleteDocumento(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.delete(documentos).where(eq(documentos.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete documento:", error);
    return false;
  }
}

/**
 * Exporta clientes para formato JSON
 */
export async function exportClientesToJSON(): Promise<Cliente[]> {
  return await getAllClientes(10000, 0, false);
}

/**
 * Exporta clientes para formato CSV
 */
export async function exportClientesToCSV(): Promise<string> {
  const clientesList = await getAllClientes(10000, 0, false);
  
  const headers = [
    "ID",
    "Nome Completo",
    "CPF",
    "RG",
    "RG UF",
    "Data Nascimento",
    "Nacionalidade",
    "Estado Civil",
    "Profissão",
    "Endereço",
    "Número",
    "Complemento",
    "Bairro",
    "Cidade",
    "Estado",
    "CEP",
    "WhatsApp",
    "Email",
    "Origem",
    "Data Cadastro",
  ];

  const rows = clientesList.map(cliente => [
    cliente.id,
    cliente.nomeCompleto,
    cliente.cpf || "",
    cliente.rg || "",
    cliente.rgUf || "",
    cliente.dataNascimento?.toISOString().split('T')[0] || "",
    cliente.nacionalidade || "",
    cliente.estadoCivil || "",
    cliente.profissao || "",
    cliente.endereco || "",
    cliente.numero || "",
    cliente.complemento || "",
    cliente.bairro || "",
    cliente.cidade || "",
    cliente.estado || "",
    cliente.cep || "",
    cliente.whatsapp || "",
    cliente.email || "",
    cliente.origem || "",
    cliente.createdAt?.toISOString() || "",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
  ].join("\n");

  return csvContent;
}

/**
 * Importa clientes de formato JSON
 */
export async function importClientesFromJSON(clientesData: Partial<InsertCliente>[]): Promise<{ imported: number; duplicates: number; errors: number }> {
  let imported = 0;
  let duplicates = 0;
  let errors = 0;

  for (const clienteData of clientesData) {
    try {
      // Verificar duplicados
      const duplicateList = await findDuplicateClientes(clienteData);
      
      if (duplicateList.length > 0) {
        duplicates++;
        continue;
      }
      
      // Validar dados obrigatórios
      if (!clienteData.nomeCompleto) {
        errors++;
        continue;
      }
      
      // Criar novo cliente
      await createCliente({
        ...clienteData,
        nomeCompleto: clienteData.nomeCompleto,
        origem: "importacao",
      });
      imported++;
    } catch (error) {
      console.error("[Import] Error importing cliente:", error);
      errors++;
    }
  }

  return { imported, duplicates, errors };
}
