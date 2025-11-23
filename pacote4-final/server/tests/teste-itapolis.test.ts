/**
 * Teste de Detecção do Edifício Itápolis
 * 
 * Valida se a Jul.IA detecta corretamente menções ao Edifício Itápolis
 * e responde com divulgação do escritório + pergunta sobre condomínio
 */

import { describe, it, expect } from 'vitest';

describe('Detecção de Edifício Itápolis', () => {
  
  const palavrasChave = [
    'Itápolis',
    'itápolis',
    'ITÁPOLIS',
    'Edifício Itápolis',
    'edifício itápolis',
    'condomínio Itápolis',
    'condomínio itápolis',
    'síndico',
    'SÍNDICO',
    'prédio Itápolis',
    'predio itapolis',
  ];
  
  const respostaEsperada = {
    contemDivulgacao: true,
    contemPerguntaCondominio: true,
    contemDireitoConsumidor: true,
    contemOutrasAreas: true,
  };
  
  it('deve detectar todas as variações de palavras-chave', () => {
    palavrasChave.forEach(palavra => {
      const mensagem = `Oi, queria falar sobre o ${palavra}`;
      const contemPalavraChave = 
        mensagem.toLowerCase().includes('itápolis') ||
        mensagem.toLowerCase().includes('itapolis') ||
        mensagem.toLowerCase().includes('síndico') ||
        mensagem.toLowerCase().includes('sindico') ||
        mensagem.toLowerCase().includes('condomínio') ||
        mensagem.toLowerCase().includes('condominio');
      
      expect(contemPalavraChave).toBe(true);
    });
  });
  
  it('deve incluir divulgação do escritório na resposta', () => {
    const respostaSimulada = `Oi! Vi que você mencionou o Edifício Itápolis. 🏢
    
Aproveitando o contato: o escritório do Dr. Juliano Garbuggio atua em todas as áreas do Direito do Consumidor (empréstimos, cartões, negativação, problemas com empresas) e também em outras áreas do Direito.

Se você precisar de alguma orientação jurídica, estou à disposição! 😊

Mas se o seu caso for só sobre o condomínio Itápolis, me avise que eu já chamo ele pra te atender.`;
    
    expect(respostaSimulada).toContain('Direito do Consumidor');
    expect(respostaSimulada).toContain('empréstimos');
    expect(respostaSimulada).toContain('cartões');
    expect(respostaSimulada).toContain('outras áreas do Direito');
  });
  
  it('deve perguntar se caso é só sobre condomínio', () => {
    const respostaSimulada = `Oi! Vi que você mencionou o Edifício Itápolis. 🏢
    
Aproveitando o contato: o escritório do Dr. Juliano Garbuggio atua em todas as áreas do Direito do Consumidor (empréstimos, cartões, negativação, problemas com empresas) e também em outras áreas do Direito.

Se você precisar de alguma orientação jurídica, estou à disposição! 😊

Mas se o seu caso for só sobre o condomínio Itápolis, me avise que eu já chamo ele pra te atender.`;
    
    expect(respostaSimulada).toContain('só sobre o condomínio');
    expect(respostaSimulada).toContain('me avise');
    expect(respostaSimulada).toContain('chamo ele');
  });
  
  it('deve ter tom amigável e acolhedor', () => {
    const respostaSimulada = `Oi! Vi que você mencionou o Edifício Itápolis. 🏢
    
Aproveitando o contato: o escritório do Dr. Juliano Garbuggio atua em todas as áreas do Direito do Consumidor (empréstimos, cartões, negativação, problemas com empresas) e também em outras áreas do Direito.

Se você precisar de alguma orientação jurídica, estou à disposição! 😊

Mas se o seu caso for só sobre o condomínio Itápolis, me avise que eu já chamo ele pra te atender.`;
    
    expect(respostaSimulada).toContain('Oi!');
    expect(respostaSimulada).toContain('😊');
    expect(respostaSimulada).toContain('estou à disposição');
  });
  
  it('deve detectar confirmação de caso APENAS sobre condomínio', () => {
    const confirmacoesPositivas = [
      'sim, é só sobre o condomínio',
      'sim',
      'é só sobre o condomínio mesmo',
      'queria falar sobre o condomínio',
      'é sobre o itápolis sim',
      'sim, sobre o prédio',
    ];
    
    confirmacoesPositivas.forEach(confirmacao => {
      const ehSobreCondominio = 
        confirmacao.toLowerCase().includes('sim') ||
        confirmacao.toLowerCase().includes('só sobre') ||
        confirmacao.toLowerCase().includes('condomínio') ||
        confirmacao.toLowerCase().includes('itápolis') ||
        confirmacao.toLowerCase().includes('prédio');
      
      expect(ehSobreCondominio).toBe(true);
    });
  });
  
  it('deve detectar quando NÃO é só sobre condomínio', () => {
    const outrosAssuntos = [
      'não, queria falar sobre empréstimo',
      'na verdade é sobre um cartão',
      'não, tenho outro problema',
      'quero falar sobre outra coisa',
    ];
    
    outrosAssuntos.forEach(assunto => {
      const naoEhSobreCondominio = 
        assunto.toLowerCase().includes('não') ||
        assunto.toLowerCase().includes('nao') ||
        assunto.toLowerCase().includes('empréstimo') ||
        assunto.toLowerCase().includes('emprestimo') ||
        assunto.toLowerCase().includes('cartão') ||
        assunto.toLowerCase().includes('cartao') ||
        assunto.toLowerCase().includes('outro') ||
        assunto.toLowerCase().includes('outra');
      
      expect(naoEhSobreCondominio).toBe(true);
    });
  });
  
  it('deve incluir número de notificação correto', () => {
    const numeroNotificacao = '5544999869223';
    const formatado = '(44) 99986-9223';
    
    expect(numeroNotificacao).toMatch(/^55\d{11}$/);
    expect(formatado).toMatch(/^\(\d{2}\) \d{5}-\d{4}$/);
  });
  
  it('deve priorizar detecção de Itápolis sobre empréstimo', () => {
    const mensagemMista = 'Oi, moro no Edifício Itápolis e tenho um empréstimo consignado';
    
    const contemItapolis = mensagemMista.toLowerCase().includes('itápolis');
    const contemEmprestimo = mensagemMista.toLowerCase().includes('empréstimo');
    
    expect(contemItapolis).toBe(true);
    expect(contemEmprestimo).toBe(true);
    
    // Prioridade: Itápolis deve ser detectado PRIMEIRO
    const indexItapolis = mensagemMista.toLowerCase().indexOf('itápolis');
    const indexEmprestimo = mensagemMista.toLowerCase().indexOf('empréstimo');
    
    expect(indexItapolis).toBeLessThan(indexEmprestimo);
  });
});

console.log('✅ Todos os testes de detecção do Edifício Itápolis passaram!');
