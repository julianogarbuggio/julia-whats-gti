/**
 * Script de teste de fluxo completo da Jul.IA
 * Simula conversas reais para validar o sistema
 */

// Node 22 tem fetch nativo

const BASE_URL = 'https://3000-i9eazc49dkftpwcqj2k2o-d0327918.manusvm.computer';
const TEST_PHONE = '5511999999999'; // Número de teste

console.log('🧪 INICIANDO TESTES DE FLUXO COMPLETO\n');
console.log('=' .repeat(80));

// Cenário 1: Cliente novo com empréstimo consignado
async function testScenario1() {
  console.log('\n📋 CENÁRIO 1: Cliente novo com empréstimo consignado');
  console.log('-'.repeat(80));
  
  const messages = [
    'Olá, boa tarde!',
    'Tenho um empréstimo consignado e quero saber se posso cancelar',
    'É no Banco do Brasil',
    'A parcela é R$ 350 por mês',
    'Meu nome é Maria Silva',
  ];
  
  for (const msg of messages) {
    console.log(`\n👤 Cliente: ${msg}`);
    
    try {
      const response = await fetch(`${BASE_URL}/api/webhook/zapi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: TEST_PHONE,
          text: { message: msg },
          messageType: 'text',
          fromMe: false,
          fromApi: false,
          isGroup: false,
          messageId: `test-${Date.now()}`,
        }),
      });
      
      const result = await response.json();
      console.log(`✅ Status: ${response.status}`);
      console.log(`📤 Resposta: ${JSON.stringify(result, null, 2)}`);
      
      // Aguardar 2 segundos entre mensagens
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`❌ Erro: ${error.message}`);
    }
  }
}

// Cenário 2: Cliente solicitando atendimento humano
async function testScenario2() {
  console.log('\n📋 CENÁRIO 2: Cliente solicitando atendimento humano');
  console.log('-'.repeat(80));
  
  const messages = [
    'Quero falar com o advogado',
    'Preciso de atendimento urgente',
  ];
  
  for (const msg of messages) {
    console.log(`\n👤 Cliente: ${msg}`);
    
    try {
      const response = await fetch(`${BASE_URL}/api/webhook/zapi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: '5511988888888',
          text: { message: msg },
          messageType: 'text',
          fromMe: false,
          fromApi: false,
          isGroup: false,
          messageId: `test-${Date.now()}`,
        }),
      });
      
      const result = await response.json();
      console.log(`✅ Status: ${response.status}`);
      console.log(`📤 Resposta: ${JSON.stringify(result, null, 2)}`);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`❌ Erro: ${error.message}`);
    }
  }
}

// Cenário 3: Cliente com dúvidas sobre custos
async function testScenario3() {
  console.log('\n📋 CENÁRIO 3: Cliente perguntando sobre custos');
  console.log('-'.repeat(80));
  
  const messages = [
    'Quanto custa?',
    'Vou ter que pagar algo?',
  ];
  
  for (const msg of messages) {
    console.log(`\n👤 Cliente: ${msg}`);
    
    try {
      const response = await fetch(`${BASE_URL}/api/webhook/zapi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: '5511977777777',
          text: { message: msg },
          messageType: 'text',
          fromMe: false,
          fromApi: false,
          isGroup: false,
          messageId: `test-${Date.now()}`,
        }),
      });
      
      const result = await response.json();
      console.log(`✅ Status: ${response.status}`);
      console.log(`📤 Resposta: ${JSON.stringify(result, null, 2)}`);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`❌ Erro: ${error.message}`);
    }
  }
}

// Executar todos os cenários
async function runAllTests() {
  try {
    await testScenario1();
    await testScenario2();
    await testScenario3();
    
    console.log('\n' + '='.repeat(80));
    console.log('✅ TESTES CONCLUÍDOS!');
    console.log('='.repeat(80));
  } catch (error) {
    console.error('\n❌ ERRO GERAL:', error);
  }
}

runAllTests();
