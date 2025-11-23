#!/usr/bin/env node

/**
 * Script para configurar webhook no GTI-API via Evolution API
 */

const GTI_BASE_URL = process.env.GTI_BASE_URL || 'https://apivip.gti-api.com';
const GTI_INSTANCE_ID = process.env.GTI_INSTANCE_ID || '69205AC00B88';
const GTI_API_KEY = process.env.GTI_API_KEY || '6920588040029';
const WEBHOOK_URL = 'https://3000-i9eazc49dkftpwcqj2k2o-d0327918.manusvm.computer/api/webhook/gti';

console.log('🔧 Configurando webhook no GTI-API...\n');
console.log(`Base URL: ${GTI_BASE_URL}`);
console.log(`Instance ID: ${GTI_INSTANCE_ID}`);
console.log(`Webhook URL: ${WEBHOOK_URL}\n`);

async function configureWebhook() {
  try {
    // Configurar webhook para receber mensagens
    const webhookConfig = {
      url: WEBHOOK_URL,
      webhook_by_events: false,
      webhook_base64: false,
      events: [
        'MESSAGES_UPSERT',
        'MESSAGES_UPDATE',
        'MESSAGES_DELETE',
        'SEND_MESSAGE'
      ]
    };

    console.log('📡 Enviando configuração de webhook...');
    console.log(JSON.stringify(webhookConfig, null, 2));

    const response = await fetch(`${GTI_BASE_URL}/webhook/set/${GTI_INSTANCE_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': GTI_API_KEY,
      },
      body: JSON.stringify(webhookConfig),
    });

    const responseText = await response.text();
    console.log(`\n📊 Status: ${response.status}`);
    console.log(`📄 Response: ${responseText}\n`);

    if (response.ok) {
      console.log('✅ Webhook configurado com sucesso!');
      return true;
    } else {
      console.error('❌ Erro ao configurar webhook');
      return false;
    }
  } catch (error) {
    console.error('❌ Erro:', error.message);
    return false;
  }
}

// Executar
configureWebhook().then(success => {
  process.exit(success ? 0 : 1);
});
