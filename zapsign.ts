/**
 * Serviço de integração com ZapSign (Assinatura Digital)
 * Documentação: https://docs.zapsign.com.br/
 */

const ZAPSIGN_BASE_URL = process.env.ZAPSIGN_BASE_URL || "https://api.zapsign.com.br/api/v1";
const ZAPSIGN_API_TOKEN = process.env.ZAPSIGN_API_TOKEN;

interface CreateDocumentParams {
  name: string;
  pdfUrl: string;
  signers: Array<{
    name: string;
    email?: string;
    phone?: string;
    cpf?: string;
  }>;
  externalId?: string;
  folderPath?: string;
  lang?: string;
}

interface Signer {
  name: string;
  email?: string;
  phone?: string;
  cpf?: string;
  auth_mode?: string; // "assinaturaTela" | "tokenEmail" | "tokenSms"
}

/**
 * Cria um novo documento para assinatura no ZapSign
 */
export async function createDocument({
  name,
  pdfUrl,
  signers,
  externalId,
  folderPath,
  lang = "pt-br",
}: CreateDocumentParams) {
  if (!ZAPSIGN_API_TOKEN) {
    throw new Error("ZapSign API token not configured");
  }

  const url = `${ZAPSIGN_BASE_URL}/docs/`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ZAPSIGN_API_TOKEN}`,
      },
      body: JSON.stringify({
        name: name,
        url_pdf: pdfUrl,
        signers: signers.map((signer) => ({
          name: signer.name,
          email: signer.email,
          phone: signer.phone,
          cpf: signer.cpf,
          auth_mode: signer.phone ? "tokenSms" : "tokenEmail",
        })),
        external_id: externalId,
        folder_path: folderPath,
        lang: lang,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`ZapSign error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("[ZapSign] Error creating document:", error);
    throw error;
  }
}

/**
 * Obtém informações de um documento específico
 */
export async function getDocument(documentToken: string) {
  if (!ZAPSIGN_API_TOKEN) {
    throw new Error("ZapSign API token not configured");
  }

  const url = `${ZAPSIGN_BASE_URL}/docs/${documentToken}/`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${ZAPSIGN_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`ZapSign error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("[ZapSign] Error getting document:", error);
    throw error;
  }
}

/**
 * Lista todos os documentos
 */
export async function listDocuments(page: number = 1, limit: number = 20) {
  if (!ZAPSIGN_API_TOKEN) {
    throw new Error("ZapSign API token not configured");
  }

  const url = `${ZAPSIGN_BASE_URL}/docs/?page=${page}&limit=${limit}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${ZAPSIGN_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`ZapSign error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("[ZapSign] Error listing documents:", error);
    throw error;
  }
}

/**
 * Deleta um documento
 */
export async function deleteDocument(documentToken: string) {
  if (!ZAPSIGN_API_TOKEN) {
    throw new Error("ZapSign API token not configured");
  }

  const url = `${ZAPSIGN_BASE_URL}/docs/${documentToken}/`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${ZAPSIGN_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`ZapSign error: ${response.status} - ${errorData}`);
    }

    return { success: true };
  } catch (error) {
    console.error("[ZapSign] Error deleting document:", error);
    throw error;
  }
}

/**
 * Envia lembrete para um signatário
 */
export async function sendReminder(documentToken: string, signerToken: string) {
  if (!ZAPSIGN_API_TOKEN) {
    throw new Error("ZapSign API token not configured");
  }

  const url = `${ZAPSIGN_BASE_URL}/docs/${documentToken}/send-reminder/`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ZAPSIGN_API_TOKEN}`,
      },
      body: JSON.stringify({
        signer_token: signerToken,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`ZapSign error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("[ZapSign] Error sending reminder:", error);
    throw error;
  }
}

/**
 * Obtém o PDF assinado de um documento
 */
export async function getSignedPdf(documentToken: string) {
  if (!ZAPSIGN_API_TOKEN) {
    throw new Error("ZapSign API token not configured");
  }

  const url = `${ZAPSIGN_BASE_URL}/docs/${documentToken}/signed-pdf/`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${ZAPSIGN_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`ZapSign error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("[ZapSign] Error getting signed PDF:", error);
    throw error;
  }
}

/**
 * Cria um documento para procuração
 */
export async function createProcuracaoDocument(
  clientName: string,
  clientEmail: string | undefined,
  clientPhone: string,
  clientCpf: string | undefined,
  pdfUrl: string,
  externalId?: string
) {
  return createDocument({
    name: `Procuração - ${clientName}`,
    pdfUrl: pdfUrl,
    signers: [
      {
        name: clientName,
        email: clientEmail,
        phone: clientPhone,
        cpf: clientCpf,
      },
    ],
    externalId: externalId,
    folderPath: "/Procuracoes",
    lang: "pt-br",
  });
}

/**
 * Cria um documento para contrato de honorários
 */
export async function createContratoHonorariosDocument(
  clientName: string,
  clientEmail: string | undefined,
  clientPhone: string,
  clientCpf: string | undefined,
  pdfUrl: string,
  externalId?: string
) {
  return createDocument({
    name: `Contrato de Honorários - ${clientName}`,
    pdfUrl: pdfUrl,
    signers: [
      {
        name: clientName,
        email: clientEmail,
        phone: clientPhone,
        cpf: clientCpf,
      },
    ],
    externalId: externalId,
    folderPath: "/Contratos",
    lang: "pt-br",
  });
}
