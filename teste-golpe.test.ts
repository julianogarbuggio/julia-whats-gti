/**
 * Teste de Detecção de Golpes
 * Valida que IA alerta automaticamente quando cliente menciona contato de advogado falso
 */

import { describe, it, expect } from 'vitest';

describe('Detecção de Golpes', () => {
  
  it('deve alertar quando cliente menciona "Recebi ligação de advogado"', async () => {
    const { processMessage } = await import('./services/conversation-flow');
    
    const result = await processMessage(
      '5511999888777',
      'Recebi ligação de um advogado',
      undefined,
      'Maria Silva'
    );
    
    console.log('\n📞 TESTE 1: "Recebi ligação de um advogado"');
    console.log('Resposta:', result.response);
    console.log('');
    
    // Verificar se resposta contém alerta de golpe
    const temAlerta = result.response.includes('ATENÇÃO') || 
                      result.response.includes('GOLPE') ||
                      result.response.includes('NUNCA liga');
    
    expect(temAlerta).toBe(true);
    expect(result.response).toContain('(11) 95675-9223');
  }, 10000);
  
  it('deve alertar quando cliente menciona "Advogado com sobrenome Silva"', async () => {
    const { processMessage } = await import('./services/conversation-flow');
    
    const result = await processMessage(
      '5511888777666',
      'Recebi ligação de um advogado com sobrenome Silva',
      undefined,
      'João Santos'
    );
    
    console.log('\n👨‍⚖️ TESTE 2: "Advogado com sobrenome Silva"');
    console.log('Resposta:', result.response);
    console.log('');
    
    const temAlerta = result.response.includes('ATENÇÃO') || 
                      result.response.includes('GOLPE') ||
                      result.response.includes('NUNCA liga');
    
    expect(temAlerta).toBe(true);
  }, 10000);
  
  it('deve alertar quando cliente menciona "Alguém do escritório ligou"', async () => {
    const { processMessage } = await import('./services/conversation-flow');
    
    const result = await processMessage(
      '5511777666555',
      'Alguém do escritório ligou pra mim',
      undefined,
      'Ana Costa'
    );
    
    console.log('\n📱 TESTE 3: "Alguém do escritório ligou"');
    console.log('Resposta:', result.response);
    console.log('');
    
    const temAlerta = result.response.includes('ATENÇÃO') || 
                      result.response.includes('GOLPE') ||
                      result.response.includes('NUNCA liga');
    
    expect(temAlerta).toBe(true);
  }, 10000);
  
  it('NÃO deve alertar em conversa normal sobre empréstimo', async () => {
    const { processMessage } = await import('./services/conversation-flow');
    
    const result = await processMessage(
      '5511666555444',
      'Tenho um empréstimo consignado',
      undefined,
      'Pedro Lima'
    );
    
    console.log('\n💰 TESTE 4: Conversa normal (não deve alertar)');
    console.log('Resposta:', result.response);
    console.log('');
    
    const temAlerta = result.response.includes('ATENÇÃO') || 
                      result.response.includes('GOLPE');
    
    // NÃO deve ter alerta em conversa normal
    expect(temAlerta).toBe(false);
  }, 10000);
});
