import { describe, it, expect } from 'vitest';
import { extractLeadData, mergeLeadData } from '../server/services/data-extraction';

describe('Data Extraction Service', () => {
  describe('extractLeadData', () => {
    it('deve qualificar lead com empréstimo consignado completo', async () => {
      const conversation = [
        { role: 'assistant' as const, content: 'Olá! Como posso ajudar?' },
        { role: 'user' as const, content: 'Oi, meu nome é João Silva' },
        { role: 'assistant' as const, content: 'Prazer, João! Me conta, você tem algum empréstimo?' },
        { role: 'user' as const, content: 'Sim, tenho um consignado no Banco do Brasil' },
        { role: 'assistant' as const, content: 'Entendi. Qual o valor da parcela?' },
        { role: 'user' as const, content: 'R$ 450,00 por mês' },
      ];

      const result = await extractLeadData(conversation);

      expect(result.clienteNome).toBe('João Silva');
      expect(result.bancoNome).toContain('Banco do Brasil');
      expect(result.tipoEmprestimo).toContain('consignado');
      expect(result.valorParcela).toBe(450);
      expect(result.casoQualificado).toBe(true);
      expect(result.motivoNaoQualificado).toBeUndefined();
    }, 30000); // 30s timeout para chamada de API

    it('NÃO deve qualificar lead com cartão de crédito comum', async () => {
      const conversation = [
        { role: 'assistant' as const, content: 'Olá! Como posso ajudar?' },
        { role: 'user' as const, content: 'Tenho dívida no cartão de crédito' },
        { role: 'assistant' as const, content: 'Qual banco?' },
        { role: 'user' as const, content: 'Nubank' },
      ];

      const result = await extractLeadData(conversation);

      expect(result.casoQualificado).toBe(false);
      expect(result.motivoNaoQualificado).toContain('não elegível');
    }, 30000);

    it('NÃO deve qualificar lead sem informar banco', async () => {
      const conversation = [
        { role: 'assistant' as const, content: 'Olá! Como posso ajudar?' },
        { role: 'user' as const, content: 'Tenho um empréstimo consignado' },
        { role: 'assistant' as const, content: 'Qual o valor da parcela?' },
        { role: 'user' as const, content: 'R$ 300' },
      ];

      const result = await extractLeadData(conversation);

      expect(result.tipoEmprestimo).toContain('consignado');
      expect(result.valorParcela).toBe(300);
      expect(result.casoQualificado).toBe(false);
      expect(result.motivoNaoQualificado).toContain('banco');
    }, 30000);

    it('deve extrair CPF formatado corretamente', async () => {
      const conversation = [
        { role: 'assistant' as const, content: 'Qual seu CPF?' },
        { role: 'user' as const, content: 'Meu CPF é 12345678900' },
      ];

      const result = await extractLeadData(conversation);

      expect(result.cpf).toMatch(/\d{3}\.\d{3}\.\d{3}-\d{2}/);
    }, 30000);

    it('deve extrair email corretamente', async () => {
      const conversation = [
        { role: 'assistant' as const, content: 'Qual seu email?' },
        { role: 'user' as const, content: 'joao.silva@gmail.com' },
      ];

      const result = await extractLeadData(conversation);

      expect(result.email).toBe('joao.silva@gmail.com');
    }, 30000);

    it('deve qualificar lead com RMC', async () => {
      const conversation = [
        { role: 'assistant' as const, content: 'Que tipo de empréstimo?' },
        { role: 'user' as const, content: 'É um cartão RMC do Santander' },
        { role: 'assistant' as const, content: 'Qual a parcela?' },
        { role: 'user' as const, content: '250 reais' },
      ];

      const result = await extractLeadData(conversation);

      expect(result.tipoEmprestimo).toMatch(/rmc/i);
      expect(result.bancoNome).toContain('Santander');
      expect(result.valorParcela).toBe(250);
      expect(result.casoQualificado).toBe(true);
    }, 30000);
  });

  describe('mergeLeadData', () => {
    it('deve mesclar dados novos com dados existentes', () => {
      const currentData = {
        clienteNome: 'João',
        bancoNome: 'Banco do Brasil',
      };

      const extractedData = {
        clienteNome: 'João Silva',
        cpf: '123.456.789-00',
        email: 'joao@email.com',
        bancoNome: 'Banco do Brasil',
        tipoEmprestimo: 'consignado',
        valorParcela: 450,
        casoQualificado: true,
        confianca: 85,
      };

      const merged = mergeLeadData(currentData, extractedData);

      expect(merged.clienteNome).toBe('João Silva'); // Atualizado
      expect(merged.cpf).toBe('123.456.789-00'); // Novo
      expect(merged.email).toBe('joao@email.com'); // Novo
      expect(merged.bancoNome).toBe('Banco do Brasil'); // Mantido
      expect(merged.casoQualificado).toBe(true);
    });

    it('deve manter dados antigos se confiança for baixa', () => {
      const currentData = {
        clienteNome: 'João Silva',
      };

      const extractedData = {
        clienteNome: 'João',
        casoQualificado: false,
        confianca: 30, // Baixa confiança
      };

      const merged = mergeLeadData(currentData, extractedData);

      expect(merged.clienteNome).toBe('João Silva'); // Mantido (confiança baixa)
    });
  });
});
