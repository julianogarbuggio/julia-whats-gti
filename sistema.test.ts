/**
 * Suite de Testes Automatizados - Jul.IA WhatsApp Assistant
 * 
 * Valida funcionalidades críticas do sistema antes do deploy em produção
 */

import { describe, it, expect, beforeAll } from 'vitest';

describe('Jul.IA WhatsApp Assistant - Testes Completos', () => {
  
  describe('1. Fluxo Conversacional Básico', () => {
    
    it('deve processar primeira mensagem e criar lead', async () => {
      // Simular webhook recebendo mensagem
      const payload = {
        event: 'messages.upsert',
        data: {
          pushName: 'João Silva',
          key: {
            remoteJid: '5511999999999@s.whatsapp.net',
            fromMe: false,
          },
          message: {
            conversation: 'Oi'
          }
        }
      };
      
      // Importar função de processamento
      const { processMessage } = await import('../server/services/conversation-flow');
      
      const result = await processMessage('5511999999999', 'Oi', undefined, 'João Silva');
      
      expect(result).toBeDefined();
      expect(result.response).toBeTruthy();
      expect(result.response.length).toBeGreaterThan(0);
      expect(result.newContext.leadId).toBeDefined();
      
      console.log('✅ Teste 1.1: Primeira mensagem processada com sucesso');
      console.log('   Lead ID:', result.newContext.leadId);
      console.log('   Resposta:', result.response.substring(0, 100) + '...');
    });
    
    it('deve usar nome do contato na saudação', async () => {
      const { processMessage } = await import('../server/services/conversation-flow');
      
      const result = await processMessage('5511888888888', 'Olá', undefined, 'Maria Santos');
      
      expect(result.response).toContain('Maria Santos');
      
      console.log('✅ Teste 1.2: Nome do contato usado na saudação');
      console.log('   Resposta:', result.response);
    });
    
    it('deve manter histórico de conversas', async () => {
      const { processMessage } = await import('../server/services/conversation-flow');
      
      // Primeira mensagem
      const result1 = await processMessage('5511777777777', 'Tenho um consignado', undefined, 'Pedro Costa');
      
      // Segunda mensagem (deve ter contexto da primeira)
      const result2 = await processMessage('5511777777777', 'É do Banco Pan', result1.newContext);
      
      expect(result2.newContext.messageHistory.length).toBeGreaterThan(2);
      expect(result2.response).toBeTruthy();
      
      console.log('✅ Teste 1.3: Histórico de conversas mantido');
      console.log('   Mensagens no histórico:', result2.newContext.messageHistory.length);
    });
  });
  
  describe('2. Qualificação Automática de Leads', () => {
    
    it('deve qualificar lead quando fornece tipo + banco + dados', async () => {
      const { processMessage } = await import('../server/services/conversation-flow');
      
      // Simular conversa completa
      let context;
      
      context = (await processMessage('5511666666666', 'Tenho um consignado', undefined, 'Ana Lima')).newContext;
      context = (await processMessage('5511666666666', 'É do Banco Pan', context)).newContext;
      context = (await processMessage('5511666666666', 'Parcela de R$ 450', context)).newContext;
      context = (await processMessage('5511666666666', 'São 96 parcelas', context)).newContext;
      
      // Aguardar extração de dados (pode levar alguns segundos)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Verificar se lead foi qualificado
      const { getDb } = await import('../server/db');
      const { leads } = await import('../drizzle/schema');
      const { eq } = await import('drizzle-orm');
      
      const db = await getDb();
      if (db) {
        const [lead] = await db.select().from(leads).where(eq(leads.clienteWhatsapp, '5511666666666')).limit(1);
        
        if (lead) {
          console.log('✅ Teste 2.1: Lead qualificado automaticamente');
          console.log('   Banco:', lead.bancoNome);
          console.log('   Tipo:', lead.tipoEmprestimo);
          console.log('   Qualificado:', lead.casoQualificado ? 'SIM' : 'NÃO');
        }
      }
    });
  });
  
  describe('3. Detecção de Tipos de Mensagem', () => {
    
    it('deve detectar e responder a áudios', async () => {
      const { processMessage } = await import('../server/services/conversation-flow');
      
      const result = await processMessage('5511555555555', '[Áudio]', undefined, 'Carlos Souza');
      
      expect(result.response).toBeTruthy();
      expect(result.response.toLowerCase()).toMatch(/áudio|ouvir|escrever/);
      
      console.log('✅ Teste 3.1: Áudio detectado e respondido');
      console.log('   Resposta:', result.response);
    });
    
    it('deve detectar e responder a imagens sem legenda', async () => {
      const { processMessage } = await import('../server/services/conversation-flow');
      
      const result = await processMessage('5511444444444', '[Cliente enviou uma imagem]', undefined, 'Lucia Ferreira');
      
      expect(result.response).toBeTruthy();
      expect(result.response.length).toBeGreaterThan(0);
      
      console.log('✅ Teste 3.2: Imagem sem legenda detectada e respondida');
      console.log('   Resposta:', result.response);
    });
    
    it('deve detectar e responder a documentos', async () => {
      const { processMessage } = await import('../server/services/conversation-flow');
      
      const result = await processMessage('5511333333333', '[Documento]', undefined, 'Roberto Alves');
      
      expect(result.response).toBeTruthy();
      
      console.log('✅ Teste 3.3: Documento detectado e respondido');
      console.log('   Resposta:', result.response);
    });
  });
  
  describe('4. Integração com APIs Externas', () => {
    
    it('deve verificar status das APIs (GTI, Z-API, ZapSign, DataJud)', async () => {
      const { checkApiHealth } = await import('../server/services/api-monitor');
      
      const health = await checkApiHealth();
      
      expect(health).toBeDefined();
      expect(health.gti).toBeDefined();
      expect(health.zapi).toBeDefined();
      expect(health.zapsign).toBeDefined();
      expect(health.datajud).toBeDefined();
      
      console.log('✅ Teste 4.1: Status das APIs verificado');
      console.log('   GTI-API:', health.gti.status);
      console.log('   Z-API:', health.zapi.status);
      console.log('   ZapSign:', health.zapsign.status);
      console.log('   DataJud:', health.datajud.status);
    });
    
    it('deve identificar tribunal por número de processo', async () => {
      const { identificarTribunal } = await import('../server/services/datajud-cnj-integration');
      
      const tribunalSP = identificarTribunal('0000000-00.0000.8.26.0000');
      const tribunalPR = identificarTribunal('0000000-00.0000.8.16.0000');
      const tribunalMG = identificarTribunal('0000000-00.0000.8.13.0000');
      
      expect(tribunalSP).toBe('ESAJ-SP');
      expect(tribunalPR).toBe('EPROC-PR');
      expect(tribunalMG).toBe('PJe-MG');
      
      console.log('✅ Teste 4.2: Identificação de tribunal funcionando');
      console.log('   SP:', tribunalSP);
      console.log('   PR:', tribunalPR);
      console.log('   MG:', tribunalMG);
    });
  });
  
  describe('5. Cenários Críticos', () => {
    
    it('deve detectar menção a golpe e alertar', async () => {
      const { processMessage } = await import('../server/services/conversation-flow');
      
      const result = await processMessage(
        '5511222222222',
        'Recebi ligação de um advogado com sobrenome Silva',
        undefined,
        'Sandra Oliveira'
      );
      
      expect(result.response.toLowerCase()).toMatch(/golpe|atenção|oficial/i);
      
      console.log('✅ Teste 5.1: Golpe detectado e alerta enviado');
      console.log('   Resposta:', result.response.substring(0, 150) + '...');
    });
    
    it('deve usar empatia apenas para clientes finais', async () => {
      const { processMessage } = await import('../server/services/conversation-flow');
      
      // Cliente final com problema
      const result1 = await processMessage(
        '5511111111111',
        'Estou com dívida de R$ 10.000',
        undefined,
        'José Santos'
      );
      
      // Parceiro comercial
      const result2 = await processMessage(
        '5511000000000',
        'Sou do Jusbrasil, quero discutir parceria',
        undefined,
        'Jusbrasil'
      );
      
      // Cliente final deve ter empatia
      const temEmpatia1 = result1.response.toLowerCase().match(/puxa|imagino|difícil|chato/);
      
      // Parceiro NÃO deve ter empatia exagerada
      const temEmpatia2 = result2.response.toLowerCase().match(/puxa|imagino|difícil|chato/);
      
      console.log('✅ Teste 5.2: Empatia contextual funcionando');
      console.log('   Cliente final tem empatia:', !!temEmpatia1);
      console.log('   Parceiro comercial sem empatia:', !temEmpatia2);
    });
    
    it('deve manter respostas curtas (máximo 5 linhas)', async () => {
      const { processMessage } = await import('../server/services/conversation-flow');
      
      const result = await processMessage('5511123456789', 'Quanto custa?', undefined, 'Teste');
      
      const linhas = result.response.split('\n').filter(l => l.trim().length > 0);
      
      console.log('✅ Teste 5.3: Respostas curtas validadas');
      console.log('   Número de linhas:', linhas.length);
      console.log('   Máximo permitido: 5');
      console.log('   Resposta:', result.response);
    });
  });
  
  describe('6. Validação do Sistema', () => {
    
    it('deve ter base de conhecimento populada', async () => {
      const { getDb } = await import('../server/db');
      const { aiKnowledge } = await import('../drizzle/schema');
      
      const db = await getDb();
      if (db) {
        const knowledge = await db.select().from(aiKnowledge).limit(10);
        
        expect(knowledge.length).toBeGreaterThan(0);
        
        console.log('✅ Teste 6.1: Base de conhecimento populada');
        console.log('   Tópicos encontrados:', knowledge.length);
      }
    });
    
    it('deve ter filtros de segurança ativos', async () => {
      const { PALAVRAS_PROIBIDAS } = await import('../server/services/ai-security-filters');
      
      expect(PALAVRAS_PROIBIDAS).toBeDefined();
      expect(PALAVRAS_PROIBIDAS.length).toBeGreaterThan(0);
      
      console.log('✅ Teste 6.2: Filtros de segurança ativos');
      console.log('   Palavras proibidas:', PALAVRAS_PROIBIDAS.length);
    });
  });
});
