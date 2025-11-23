import { getDb } from "../db";
import { leads, conversations } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { generateAIResponse } from "./ai-chatbot";
import { filtrarResposta, adicionarDisclaimerSeNecessario } from "./ai-security-filters";
import { consultarProcessoAutomatico } from "./andamento-processual-service";
import { extrairNumeroCNJ } from "./datajud-cnj-integration";

/**
 * Estados da conversa
 */
export enum ConversationState {
  INICIO = "INICIO",
  CONVERSANDO = "CONVERSANDO",
  AGUARDANDO_HUMANO = "AGUARDANDO_HUMANO",
}

/**
 * Contexto de conversa
 */
interface ConversationContext {
  leadId?: number;
  state: ConversationState;
  clienteNome?: string; // Para saudação personalizada
  clienteDataNascimento?: Date | null; // Para parabenizar no aniversário
  leadData: {
    clienteWhatsapp: string;
    clienteNome?: string;
    clienteEmail?: string;
    clienteCpf?: string;
    clienteDataNascimento?: Date | null;
    bancoNome?: string;
    tipoEmprestimo?: string;
    temEmprestimo?: boolean;
    valorParcela?: number;
    numeroParcelas?: number;
    periodoEmprestimo?: string;
    casoQualificado?: boolean;
    motivoNaoQualificado?: string;
  };
  messageHistory: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
}

/**
 * Salva lead no banco de dados
 */
async function salvarLead(leadData: ConversationContext["leadData"]): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Buscar lead existente
  const existingLeads = await db
    .select()
    .from(leads)
    .where(eq(leads.clienteWhatsapp, leadData.clienteWhatsapp))
    .limit(1);

  const leadId = existingLeads[0]?.id;

  if (leadId) {
    // Atualizar lead existente (apenas campos que existem)
    const updateData: any = {
      conversationState: ConversationState.CONVERSANDO,
    };
    
    // SEMPRE atualizar nome se vier do webhook (mesmo que seja null)
    if (leadData.clienteNome !== undefined) updateData.clienteNome = leadData.clienteNome;
    if (leadData.clienteEmail) updateData.clienteEmail = leadData.clienteEmail;
    if (leadData.clienteCpf) updateData.clienteCpf = leadData.clienteCpf;
    if (leadData.bancoNome) updateData.bancoNome = leadData.bancoNome;
    if (leadData.tipoEmprestimo) updateData.tipoEmprestimo = leadData.tipoEmprestimo;
    if (leadData.valorParcela) updateData.valorParcela = leadData.valorParcela;
    if (leadData.numeroParcelas) updateData.numeroParcelas = leadData.numeroParcelas;
    if (leadData.periodoEmprestimo) updateData.periodoContrato = leadData.periodoEmprestimo;
    if (leadData.casoQualificado !== undefined) updateData.casoQualificado = leadData.casoQualificado;
    if (leadData.motivoNaoQualificado) updateData.motivoNaoQualificado = leadData.motivoNaoQualificado;

    await db
      .update(leads)
      .set(updateData)
      .where(eq(leads.id, leadId));

    return leadId;
  } else {
    // Criar novo lead (apenas campos obrigatórios)
    const [result] = await db.insert(leads).values({
      clienteWhatsapp: leadData.clienteWhatsapp,
      clienteNome: leadData.clienteNome || null, // NÃO salvar "Novo Lead" - deixar null
      conversationState: ConversationState.CONVERSANDO,
    });

    return Number(result.insertId);
  }
}

/**
 * Salva mensagem no histórico
 */
async function salvarMensagem(
  leadId: number,
  phone: string,
  messageContent: string,
  fromMe: boolean
): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.error("[salvarMensagem] ❌ Database not available");
    return;
  }

  if (!leadId) {
    console.error("[salvarMensagem] ❌ leadId is required but got:", leadId);
    return;
  }

  try {
    console.log(`[salvarMensagem] 💾 Salvando: leadId=${leadId}, fromMe=${fromMe}, content=${messageContent.substring(0, 50)}...`);
    await db.insert(conversations).values({
      leadId,
      phone,
      messageContent,
      fromMe,
      messageType: "text",
    });
    console.log(`[salvarMensagem] ✅ Mensagem salva com sucesso!`);
  } catch (error) {
    console.error("[salvarMensagem] ❌ Erro ao salvar mensagem:", error);
    throw error;
  }
}

/**
 * Processa mensagem recebida e retorna resposta
 */
export async function processMessage(
  whatsapp: string,
  message: string,
  context?: ConversationContext,
  chatName?: string | null // Nome do contato salvo no WhatsApp
): Promise<{ response: string; newContext: ConversationContext }> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  console.log("[processMessage] 🔍 Início - whatsapp:", whatsapp, "message:", message.substring(0, 50));

  // Buscar lead existente (sempre, para pegar nome e data de nascimento)
  const existingLeads = await db
    .select()
    .from(leads)
    .where(eq(leads.clienteWhatsapp, whatsapp))
    .limit(1);
  const existingLead = existingLeads[0];
  
  // Verificar retomada automática após atendimento humano
  let retomadaAutomatica = false;
  if (existingLead?.conversationState === ConversationState.AGUARDANDO_HUMANO && existingLead.ultimaMensagemHumana) {
    const agora = new Date();
    const ultimaMensagem = new Date(existingLead.ultimaMensagemHumana);
    const diferencaMinutos = (agora.getTime() - ultimaMensagem.getTime()) / (1000 * 60);
    
    if (diferencaMinutos >= 5) {
      console.log("[processMessage] 🔄 Retomada automática - última mensagem humana há", diferencaMinutos.toFixed(1), "minutos");
      retomadaAutomatica = true;
      // Atualizar estado para CONVERSANDO para Jul.IA retomar
      await db
        .update(leads)
        .set({ 
          conversationState: ConversationState.CONVERSANDO,
          ultimaMensagemHumana: null,
        })
        .where(eq(leads.id, existingLead.id));
    }
  }

  // Buscar ou criar contexto
  if (!context) {
    console.log("[processMessage] 💾 Buscando contexto do banco...");
    console.log("[processMessage] 📄 Lead encontrado:", existingLead ? `ID=${existingLead.id}, state=${existingLead.conversationState}` : "NENHUM");

    // Determinar estado baseado no lead existente
    let initialState = ConversationState.INICIO;
    if (existingLead?.conversationState) {
      // Usar estado salvo do banco (ou CONVERSANDO se retomada automática)
      initialState = retomadaAutomatica ? ConversationState.CONVERSANDO : existingLead.conversationState as ConversationState;
      console.log("[processMessage] ✅ Usando estado salvo:", initialState, retomadaAutomatica ? "(retomada automática)" : "");
    } else {
      console.log("[processMessage] 🆕 Novo lead - estado inicial:", initialState);
    }
    
    context = {
      leadId: existingLead?.id,
      state: initialState,
      leadData: {
        clienteWhatsapp: whatsapp,
        clienteNome: chatName || existingLead?.clienteNome || undefined, // SEMPRE priorizar nome do contato salvo no WhatsApp
        clienteEmail: existingLead?.clienteEmail || undefined,
        clienteCpf: existingLead?.clienteCpf || undefined,
        bancoNome: existingLead?.bancoNome || undefined,
        tipoEmprestimo: existingLead?.tipoEmprestimo || undefined,
        temEmprestimo: existingLead?.bancoNome ? true : undefined,
      },
      messageHistory: [],
    };
    
    // Carregar histórico de mensagens do banco (últimas 10)
    if (existingLead?.id) {
      console.log("[processMessage] 📚 Carregando histórico de mensagens...");
      const history = await db
        .select()
        .from(conversations)
        .where(eq(conversations.leadId, existingLead.id))
        .orderBy(desc(conversations.createdAt))
        .limit(10);
      
      // Inverter ordem (mais antiga primeiro)
      context.messageHistory = history.reverse().map(msg => ({
        role: msg.fromMe ? "assistant" as const : "user" as const,
        content: msg.messageContent
      }));
      console.log("[processMessage] 📚 Histórico carregado:", context.messageHistory.length, "mensagens");
    }
  }

  console.log("[processMessage] 🤖 Chamando IA com contexto...");
  
  // Detectar se cliente mencionou número de processo e tentar consultar automaticamente
  let consultaProcesso: { sucesso: boolean; mensagem: string; tribunal?: string } | null = null;
  const numeroCNJ = extrairNumeroCNJ(message);
  
  if (numeroCNJ) {
    console.log(`[processMessage] 📊 Número de processo detectado: ${numeroCNJ}`);
    console.log(`[processMessage] 🔍 Tentando consulta automática via DataJud CNJ...`);
    
    try {
      consultaProcesso = await consultarProcessoAutomatico(numeroCNJ);
      
      if (consultaProcesso.sucesso) {
        console.log(`[processMessage] ✅ Consulta automática bem-sucedida!`);
      } else {
        console.log(`[processMessage] ⚠️ Consulta automática falhou, usando instruções manuais`);
      }
    } catch (error) {
      console.error(`[processMessage] ❌ Erro na consulta automática:`, error);
      // Se der erro, criar resposta genérica
      consultaProcesso = {
        sucesso: false,
        mensagem: `🔍 Deixa eu consultar esse processo pra você! Um momento...\n\n❌ Não consegui consultar agora. Pode tentar de novo em alguns minutos ou me passa mais detalhes do processo?`
      };
    }
  }
  
  // Chamar IA para gerar resposta contextualizada
  const aiResult = await generateAIResponse(message, {
    leadId: context.leadId,
    clienteNome: context.leadData.clienteNome || undefined, // CORRIGIDO: usar nome do context (que tem nome do WhatsApp)
    clienteDataNascimento: existingLead?.clienteDataNascimento || undefined,
    conversationHistory: context.messageHistory,
    leadData: context.leadData,
    // Se consultou processo, passar resultado para IA usar na resposta
    consultaProcesso: consultaProcesso || undefined,
  });

  console.log("[processMessage] ✅ IA respondeu:", aiResult.response.substring(0, 100));

  // Se consultou processo automaticamente, usar resultado da consulta em vez da resposta da IA
  // IMPORTANTE: Se detectou número CNJ, SEMPRE usar resultado da consulta (mesmo que falhe)
  let response = aiResult.response;
  
  if (consultaProcesso) {
    // Número CNJ foi detectado - SEMPRE usar resultado da consulta
    response = consultaProcesso.mensagem;
    console.log(`[processMessage] 📨 Usando resultado da consulta DataJud (sucesso=${consultaProcesso.sucesso})`);
  }
  let newState = context.state;

  // Atualizar estado se necessário
  if (aiResult.shouldHandoff) {
    newState = ConversationState.AGUARDANDO_HUMANO;
  } else if (context.state === ConversationState.INICIO) {
    newState = ConversationState.CONVERSANDO;
  }

  // Atualizar contexto
  context.messageHistory.push({ role: "user", content: message });
  context.messageHistory.push({ role: "assistant", content: response });

  // Extrair dados estruturados da conversa (a cada 3 mensagens ou quando lead novo)
  const shouldExtract = 
    !context.leadId || // Lead novo
    context.messageHistory.length % 6 === 0; // A cada 3 trocas (6 mensagens)
  
  if (shouldExtract) {
    console.log("[processMessage] 🔍 Extraindo dados estruturados da conversa...");
    const { extractLeadData, mergeLeadData } = await import("./data-extraction");
    
    try {
      const extractedData = await extractLeadData(
        context.messageHistory,
        context.leadData
      );
      
      // Mesclar dados extraídos com dados atuais
      const mergedData = mergeLeadData(context.leadData, extractedData);
      
      // Atualizar contexto com dados extraídos
      context.leadData = {
        ...context.leadData,
        ...mergedData,
      };
      
      console.log("[processMessage] ✅ Dados extraídos e mesclados:");
      console.log("  - Nome:", context.leadData.clienteNome || "não informado");
      console.log("  - Banco:", context.leadData.bancoNome || "não informado");
      console.log("  - Tipo:", context.leadData.tipoEmprestimo || "não informado");
      console.log("  - Qualificado:", context.leadData.casoQualificado ? "✅ SIM" : "❌ NÃO");
      if (context.leadData.motivoNaoQualificado) {
        console.log("  - Motivo:", context.leadData.motivoNaoQualificado);
      }
    } catch (error) {
      console.error("[processMessage] ❌ Erro ao extrair dados:", error);
      // Continuar mesmo se extração falhar
    }
  }

  // Salvar ou atualizar lead
  if (!context.leadId) {
    console.log("[processMessage] 💾 Criando novo lead...");
    const leadId = await salvarLead(context.leadData);
    context.leadId = leadId;
  } else {
    console.log("[processMessage] 💾 Atualizando lead existente...");
    await salvarLead(context.leadData);
  }
  
  // Enviar para Jul.IA Intimações se lead foi qualificado
  if (context.leadData.casoQualificado && context.leadId) {
    console.log("[processMessage] 🔗 Lead qualificado - enviando para Jul.IA Intimações...");
    const { enviarClienteParaIntimacoes } = await import("./julia-intimacoes-integration");
    // Enviar de forma assíncrona para não bloquear resposta
    enviarClienteParaIntimacoes(context.leadId).catch(error => {
      console.error("[processMessage] Erro ao enviar para Intimações:", error);
    });
  }

  // Salvar mensagens no histórico
  console.log("[processMessage] 💾 Salvando mensagens no histórico...");
  console.log("[processMessage] 📝 leadId atual:", context.leadId);
  
  try {
    console.log("[processMessage] 💾 Salvando mensagem do CLIENTE (fromMe=false)...");
    await salvarMensagem(context.leadId!, whatsapp, message, false);
    console.log("[processMessage] ✅ Mensagem do cliente salva!");
  } catch (error) {
    console.error("[processMessage] ❌ ERRO ao salvar mensagem do cliente:", error);
  }
  
  try {
    console.log("[processMessage] 💾 Salvando resposta da JUL.IA (fromMe=true)...");
    await salvarMensagem(context.leadId!, whatsapp, response, true);
    console.log("[processMessage] ✅ Resposta da Jul.IA salva!");
  } catch (error) {
    console.error("[processMessage] ❌ ERRO ao salvar resposta da Jul.IA:", error);
  }

  // Atualizar estado da conversa no banco
  await db
    .update(leads)
    .set({ 
      conversationState: newState,
      updatedAt: new Date(),
    })
    .where(eq(leads.id, context.leadId!));

  console.log("[processMessage] 🎉 Processamento concluído!");

  return {
    response,
    newContext: {
      ...context,
      state: newState,
    },
  };
}
