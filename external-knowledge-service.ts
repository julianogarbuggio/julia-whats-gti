/**
 * Serviço de integração com a Base de Conhecimento Externa (Jul.IA Knowledge Base)
 * 
 * Este serviço consulta a API pública da Base de Conhecimento para buscar
 * conhecimentos relevantes que serão usados pela IA nas respostas.
 */

const KNOWLEDGE_BASE_API_URL = process.env.KNOWLEDGE_BASE_API_URL || "https://3000-i8ecmcu85ng5j410qc23p-341d1e34.manusvm.computer";

interface ExternalKnowledge {
  id: number;
  categoria: string;
  topico: string;
  conteudo: string;
  palavrasChave: string[];
  prioridade: number;
  ativo: boolean;
}

/**
 * Busca conhecimentos na Base de Conhecimento Externa
 */
export async function searchExternalKnowledge(query: string, limit: number = 5): Promise<ExternalKnowledge[]> {
  try {
    const url = `${KNOWLEDGE_BASE_API_URL}/api/trpc/api.searchForAI?input=${encodeURIComponent(JSON.stringify({ query, limit }))}`;
    
    console.log(`[External Knowledge] Buscando conhecimentos para: "${query}"`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`[External Knowledge] Erro HTTP: ${response.status}`);
      return [];
    }

    const data = await response.json();
    
    // tRPC retorna dados no formato { result: { data: [...] } }
    const knowledges = data?.result?.data || [];
    
    console.log(`[External Knowledge] Encontrados ${knowledges.length} conhecimentos`);
    
    return knowledges;
  } catch (error) {
    console.error("[External Knowledge] Erro ao buscar conhecimentos:", error);
    return [];
  }
}

/**
 * Verifica se o serviço de Base de Conhecimento Externa está disponível
 */
export async function isExternalKnowledgeAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${KNOWLEDGE_BASE_API_URL}/api/trpc/categories.list`, {
      method: 'GET',
      timeout: 3000,
    } as any);
    
    return response.ok;
  } catch (error) {
    console.warn("[External Knowledge] Serviço não disponível:", error);
    return false;
  }
}
