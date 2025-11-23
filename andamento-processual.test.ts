import { describe, it, expect } from 'vitest';
import { identificarTribunal } from '../andamento-processual-service';

describe('Andamento Processual Service', () => {
  describe('identificarTribunal', () => {
    it('deve identificar TJSP (São Paulo)', () => {
      const resultado = identificarTribunal('1234567-89.2024.8.26.0100');
      
      expect(resultado).not.toBeNull();
      expect(resultado?.tribunal).toBe('ESAJ-SP');
      expect(resultado?.nome).toBe('Tribunal de Justiça de São Paulo');
      expect(resultado?.url).toContain('esaj.tjsp.jus.br');
      expect(resultado?.instrucoes).toContain('TJSP');
    });

    it('deve identificar TJPR (Paraná)', () => {
      const resultado = identificarTribunal('1234567-89.2024.8.16.0001');
      
      expect(resultado).not.toBeNull();
      expect(resultado?.tribunal).toBe('EPROC-PR');
      expect(resultado?.nome).toBe('Tribunal de Justiça do Paraná');
      expect(resultado?.url).toContain('tjpr.jus.br');
    });

    it('deve identificar TJMG (Minas Gerais)', () => {
      const resultado = identificarTribunal('1234567-89.2024.8.13.0024');
      
      expect(resultado).not.toBeNull();
      expect(resultado?.tribunal).toBe('PJEMG');
      expect(resultado?.nome).toBe('Tribunal de Justiça de Minas Gerais');
      expect(resultado?.url).toContain('tjmg.jus.br');
    });

    it('deve identificar TJRS (Rio Grande do Sul)', () => {
      const resultado = identificarTribunal('1234567-89.2024.8.21.0001');
      
      expect(resultado).not.toBeNull();
      expect(resultado?.tribunal).toBe('TJRS');
      expect(resultado?.nome).toBe('Tribunal de Justiça do Rio Grande do Sul');
      expect(resultado?.url).toContain('tjrs.jus.br');
    });

    it('deve identificar TJRJ (Rio de Janeiro)', () => {
      const resultado = identificarTribunal('1234567-89.2024.8.19.0001');
      
      expect(resultado).not.toBeNull();
      expect(resultado?.tribunal).toBe('TJRJ');
      expect(resultado?.nome).toBe('Tribunal de Justiça do Rio de Janeiro');
      expect(resultado?.url).toContain('tjrj.jus.br');
    });

    it('deve identificar TJBA (Bahia)', () => {
      const resultado = identificarTribunal('1234567-89.2024.8.05.0001');
      
      expect(resultado).not.toBeNull();
      expect(resultado?.tribunal).toBe('TJBA');
      expect(resultado?.nome).toBe('Tribunal de Justiça da Bahia');
      expect(resultado?.url).toContain('tjba.jus.br');
    });

    it('deve identificar TJSC (Santa Catarina)', () => {
      const resultado = identificarTribunal('1234567-89.2024.8.24.0001');
      
      expect(resultado).not.toBeNull();
      expect(resultado?.tribunal).toBe('TJSC');
      expect(resultado?.nome).toBe('Tribunal de Justiça de Santa Catarina');
      expect(resultado?.url).toContain('tjsc.jus.br');
    });

    it('deve identificar TJGO (Goiás)', () => {
      const resultado = identificarTribunal('1234567-89.2024.8.09.0001');
      
      expect(resultado).not.toBeNull();
      expect(resultado?.tribunal).toBe('TJGO');
      expect(resultado?.nome).toBe('Tribunal de Justiça de Goiás');
      expect(resultado?.url).toContain('tjgo.jus.br');
    });

    it('deve identificar TJCE (Ceará)', () => {
      const resultado = identificarTribunal('1234567-89.2024.8.06.0001');
      
      expect(resultado).not.toBeNull();
      expect(resultado?.tribunal).toBe('TJCE');
      expect(resultado?.nome).toBe('Tribunal de Justiça do Ceará');
      expect(resultado?.url).toContain('tjce.jus.br');
    });

    it('deve identificar TJPE (Pernambuco)', () => {
      const resultado = identificarTribunal('1234567-89.2024.8.17.0001');
      
      expect(resultado).not.toBeNull();
      expect(resultado?.tribunal).toBe('TJPE');
      expect(resultado?.nome).toBe('Tribunal de Justiça de Pernambuco');
      expect(resultado?.url).toContain('tjpe.jus.br');
    });

    it('deve identificar TJES (Espírito Santo)', () => {
      const resultado = identificarTribunal('1234567-89.2024.8.08.0001');
      
      expect(resultado).not.toBeNull();
      expect(resultado?.tribunal).toBe('TJES');
      expect(resultado?.nome).toBe('Tribunal de Justiça do Espírito Santo');
      expect(resultado?.url).toContain('tjes.jus.br');
    });

    it('deve identificar Justiça Federal (PJe)', () => {
      const resultado = identificarTribunal('1234567-89.2024.4.01.0000');
      
      expect(resultado).not.toBeNull();
      expect(resultado?.tribunal).toBe('PJe-JF01');
      expect(resultado?.nome).toContain('Justiça Federal');
      expect(resultado?.url).toContain('jf01.jus.br');
    });

    it('deve retornar null para número inválido (muito curto)', () => {
      const resultado = identificarTribunal('123456');
      
      expect(resultado).toBeNull();
    });

    it('deve retornar null para número vazio', () => {
      const resultado = identificarTribunal('');
      
      expect(resultado).toBeNull();
    });

    it('deve funcionar com número sem formatação', () => {
      const resultado = identificarTribunal('12345678920248260100');
      
      expect(resultado).not.toBeNull();
      expect(resultado?.tribunal).toBe('ESAJ-SP');
    });

    it('deve funcionar com número com espaços', () => {
      const resultado = identificarTribunal('1234567-89.2024.8.26.0100   ');
      
      expect(resultado).not.toBeNull();
      expect(resultado?.tribunal).toBe('ESAJ-SP');
    });

    it('deve incluir número do processo nas instruções', () => {
      const numeroProcesso = '1234567-89.2024.8.26.0100';
      const resultado = identificarTribunal(numeroProcesso);
      
      expect(resultado).not.toBeNull();
      expect(resultado?.instrucoes).toContain(numeroProcesso);
    });

    it('deve incluir emojis nas instruções', () => {
      const resultado = identificarTribunal('1234567-89.2024.8.26.0100');
      
      expect(resultado).not.toBeNull();
      expect(resultado?.instrucoes).toContain('📱');
      expect(resultado?.instrucoes).toContain('💡');
    });

    it('deve incluir passo a passo nas instruções', () => {
      const resultado = identificarTribunal('1234567-89.2024.8.26.0100');
      
      expect(resultado).not.toBeNull();
      expect(resultado?.instrucoes).toContain('1️⃣');
      expect(resultado?.instrucoes).toContain('2️⃣');
      expect(resultado?.instrucoes).toContain('3️⃣');
    });

    it('deve usar linguagem simples nas instruções', () => {
      const resultado = identificarTribunal('1234567-89.2024.8.26.0100');
      
      expect(resultado).not.toBeNull();
      // Verificar que não usa termos jurídicos complexos
      expect(resultado?.instrucoes.toLowerCase()).not.toContain('petição');
      expect(resultado?.instrucoes.toLowerCase()).not.toContain('protocolo');
      expect(resultado?.instrucoes.toLowerCase()).not.toContain('jurisprudência');
      
      // Verificar que usa termos simples
      expect(resultado?.instrucoes.toLowerCase()).toContain('consultar');
      expect(resultado?.instrucoes.toLowerCase()).toContain('processo');
    });

    it('deve incluir dica útil nas instruções', () => {
      const resultado = identificarTribunal('1234567-89.2024.8.26.0100');
      
      expect(resultado).not.toBeNull();
      expect(resultado?.instrucoes).toContain('Dica:');
    });

    it('deve retornar JusBrasil como fallback para tribunal desconhecido', () => {
      const resultado = identificarTribunal('1234567-89.2024.8.99.0001');
      
      expect(resultado).not.toBeNull();
      expect(resultado?.tribunal).toBe('DESCONHECIDO');
      expect(resultado?.url).toContain('jusbrasil.com.br');
    });
  });
});
