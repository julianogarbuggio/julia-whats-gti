import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import {
  createCliente,
  getClienteById,
  getClienteByCpf,
  getClienteByWhatsapp,
  updateCliente,
  searchClientes,
  getAllClientes,
  deleteCliente,
  deleteMultipleClientes,
  findDuplicateClientes,
  mergeClientes,
  exportClientesToJSON,
  exportClientesToCSV,
  importClientesFromJSON,
  createDocumento,
  getDocumentosByClienteId,
  getDocumentosByLeadId,
  deleteDocumento,
} from "./db-clientes";
import { storagePut } from "./storage";

export const clientesRouter = router({
  // Criar novo cliente
  create: protectedProcedure
    .input(
      z.object({
        nomeCompleto: z.string(),
        nacionalidade: z.string().optional(),
        dataNascimento: z.string().optional(),
        estadoCivil: z.string().optional(),
        profissao: z.string().optional(),
        rg: z.string().optional(),
        rgUf: z.string().optional(),
        cpf: z.string().optional(),
        endereco: z.string().optional(),
        numero: z.string().optional(),
        complemento: z.string().optional(),
        bairro: z.string().optional(),
        cidade: z.string().optional(),
        estado: z.string().optional(),
        cep: z.string().optional(),
        whatsapp: z.string().optional(),
        email: z.string().optional(),
        leadId: z.number().optional(),
        origem: z.string().optional(),
        observacoes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const cliente = await createCliente({
        ...input,
        dataNascimento: input.dataNascimento ? new Date(input.dataNascimento) : undefined,
      });
      return cliente;
    }),

  // Obter cliente por ID
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await getClienteById(input.id);
    }),

  // Obter cliente por CPF
  getByCpf: protectedProcedure
    .input(z.object({ cpf: z.string() }))
    .query(async ({ input }) => {
      return await getClienteByCpf(input.cpf);
    }),

  // Obter cliente por WhatsApp
  getByWhatsapp: protectedProcedure
    .input(z.object({ whatsapp: z.string() }))
    .query(async ({ input }) => {
      return await getClienteByWhatsapp(input.whatsapp);
    }),

  // Atualizar cliente
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          nomeCompleto: z.string().optional(),
          nacionalidade: z.string().optional(),
          dataNascimento: z.string().optional(),
          estadoCivil: z.string().optional(),
          profissao: z.string().optional(),
          rg: z.string().optional(),
          rgUf: z.string().optional(),
          cpf: z.string().optional(),
          endereco: z.string().optional(),
          numero: z.string().optional(),
          complemento: z.string().optional(),
          bairro: z.string().optional(),
          cidade: z.string().optional(),
          estado: z.string().optional(),
          cep: z.string().optional(),
          whatsapp: z.string().optional(),
          email: z.string().optional(),
          observacoes: z.string().optional(),
          ativo: z.boolean().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const updateData = {
        ...input.data,
        dataNascimento: input.data.dataNascimento ? new Date(input.data.dataNascimento) : undefined,
      };
      return await updateCliente(input.id, updateData);
    }),

  // Buscar clientes
  search: protectedProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      return await searchClientes(input.query);
    }),

  // Listar todos os clientes
  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(100),
        offset: z.number().default(0),
        includeInactive: z.boolean().default(false),
      })
    )
    .query(async ({ input }) => {
      return await getAllClientes(input.limit, input.offset, input.includeInactive);
    }),

  // Deletar cliente
  delete: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        soft: z.boolean().default(true),
      })
    )
    .mutation(async ({ input }) => {
      return await deleteCliente(input.id, input.soft);
    }),

  // Deletar múltiplos clientes
  deleteMultiple: protectedProcedure
    .input(
      z.object({
        ids: z.array(z.number()),
        soft: z.boolean().default(true),
      })
    )
    .mutation(async ({ input }) => {
      return await deleteMultipleClientes(input.ids, input.soft);
    }),

  // Buscar duplicados
  findDuplicates: protectedProcedure
    .input(
      z.object({
        nomeCompleto: z.string().optional(),
        cpf: z.string().optional(),
        whatsapp: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      return await findDuplicateClientes(input);
    }),

  // Mesclar clientes
  merge: protectedProcedure
    .input(
      z.object({
        mainId: z.number(),
        duplicateId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      return await mergeClientes(input.mainId, input.duplicateId);
    }),

  // Exportar para JSON
  exportJSON: protectedProcedure.query(async () => {
    return await exportClientesToJSON();
  }),

  // Exportar para CSV
  exportCSV: protectedProcedure.query(async () => {
    const csv = await exportClientesToCSV();
    return { csv };
  }),

  // Importar de JSON
  importJSON: protectedProcedure
    .input(
      z.object({
        clientes: z.array(
          z.object({
            nomeCompleto: z.string(),
            nacionalidade: z.string().optional(),
            dataNascimento: z.string().optional(),
            estadoCivil: z.string().optional(),
            profissao: z.string().optional(),
            rg: z.string().optional(),
            rgUf: z.string().optional(),
            cpf: z.string().optional(),
            endereco: z.string().optional(),
            numero: z.string().optional(),
            complemento: z.string().optional(),
            bairro: z.string().optional(),
            cidade: z.string().optional(),
            estado: z.string().optional(),
            cep: z.string().optional(),
            whatsapp: z.string().optional(),
            email: z.string().optional(),
            observacoes: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const clientesData = input.clientes.map(c => ({
        ...c,
        dataNascimento: c.dataNascimento ? new Date(c.dataNascimento) : undefined,
      }));
      return await importClientesFromJSON(clientesData);
    }),
});

export const documentosRouter = router({
  // Upload de documento
  upload: protectedProcedure
    .input(
      z.object({
        clienteId: z.number(),
        leadId: z.number().optional(),
        nomeArquivo: z.string(),
        tipoDocumento: z.string().optional(),
        fileData: z.string(), // Base64 encoded file
        mimeType: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Decodificar base64
      const buffer = Buffer.from(input.fileData, "base64");
      
      // Gerar chave única para S3
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(7);
      const fileKey = `clientes/${input.clienteId}/documentos/${timestamp}-${randomSuffix}-${input.nomeArquivo}`;
      
      // Upload para S3
      const { url } = await storagePut(fileKey, buffer, input.mimeType);
      
      // Salvar referência no banco de dados
      const documento = await createDocumento({
        clienteId: input.clienteId,
        leadId: input.leadId,
        nomeArquivo: input.nomeArquivo,
        tipoDocumento: input.tipoDocumento,
        mimeType: input.mimeType,
        tamanho: buffer.length,
        s3Key: fileKey,
        s3Url: url,
        uploadedBy: ctx.user.id,
      });
      
      return documento;
    }),

  // Listar documentos por cliente
  listByCliente: protectedProcedure
    .input(z.object({ clienteId: z.number() }))
    .query(async ({ input }) => {
      return await getDocumentosByClienteId(input.clienteId);
    }),

  // Listar documentos por lead
  listByLead: protectedProcedure
    .input(z.object({ leadId: z.number() }))
    .query(async ({ input }) => {
      return await getDocumentosByLeadId(input.leadId);
    }),

  // Deletar documento
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await deleteDocumento(input.id);
    }),
});
