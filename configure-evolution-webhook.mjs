import 'dotenv/config';

const GTI_BASE_URL = process.env.GTI_BASE_URL;
const GTI_INSTANCE_ID = process.env.GTI_INSTANCE_ID;
const GTI_API_KEY = process.env.GTI_API_KEY;

const WEBHOOK_URL = "https://3000-i9eazc49dkftpwcqj2k2o-d0327918.manusvm.computer/api/webhook/gti";

async function configureWebhook() {
  try {
    console.log("🔧 Configurando webhook Evolution API...");
    console.log("Base URL:", GTI_BASE_URL);
    console.log("Instance ID:", GTI_INSTANCE_ID);
    console.log("Webhook URL:", WEBHOOK_URL);
    
    const response = await fetch(`${GTI_BASE_URL}/webhook/set/${GTI_INSTANCE_ID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": GTI_API_KEY,
      },
      body: JSON.stringify({
        url: WEBHOOK_URL,
        webhook_by_events: false,
        webhook_base64: false,
        events: [
          "MESSAGES_UPSERT",
          "MESSAGES_UPDATE",
          "MESSAGES_DELETE",
          "SEND_MESSAGE",
        ],
      }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log("✅ Webhook configurado com sucesso!");
      console.log("Resposta:", JSON.stringify(data, null, 2));
    } else {
      console.error("❌ Erro ao configurar webhook:");
      console.error("Status:", response.status);
      console.error("Resposta:", JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error("❌ Erro:", error.message);
  }
}

configureWebhook();
