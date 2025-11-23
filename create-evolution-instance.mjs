import 'dotenv/config';

const GTI_BASE_URL = process.env.GTI_BASE_URL;
const GTI_INSTANCE_ID = process.env.GTI_INSTANCE_ID;
const GTI_API_KEY = process.env.GTI_API_KEY;

async function createInstance() {
  try {
    console.log("🔧 Criando instância Evolution API...");
    console.log("Base URL:", GTI_BASE_URL);
    console.log("Instance ID:", GTI_INSTANCE_ID);
    
    const response = await fetch(`${GTI_BASE_URL}/instance/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": GTI_API_KEY,
      },
      body: JSON.stringify({
        instanceName: GTI_INSTANCE_ID,
        token: GTI_API_KEY,
        qrcode: true,
        integration: "WHATSAPP-BAILEYS",
      }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log("✅ Instância criada com sucesso!");
      console.log("Resposta:", JSON.stringify(data, null, 2));
    } else {
      console.error("❌ Erro ao criar instância:");
      console.error("Status:", response.status);
      console.error("Resposta:", JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error("❌ Erro:", error.message);
  }
}

createInstance();
