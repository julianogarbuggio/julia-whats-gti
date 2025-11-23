import { drizzle } from "drizzle-orm/mysql2";
import { aiKnowledge } from "./drizzle/schema.js";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL);

async function corrigir() {
  console.log("🔧 Corrigindo honorários...");
  
  // Buscar o registro de honorários
  const registros = await db
    .select()
    .from(aiKnowledge)
    .where(eq(aiKnowledge.topico, "Honorários em caso de vitória - ATUALIZADO"));
  
  if (registros.length > 0) {
    const id = registros[0].id;
    
    await db
      .update(aiKnowledge)
      .set({
        conteudo: `**E se ganhar a ação, quais são os honorários?**

Os honorários são cobrados somente em caso de vitória, sobre o resultado alcançado:

📌 **35%** sobre:
• Valores devolvidos (geralmente em dobro)
• Restituição de encargos indevidos

📌 **40%** sobre:
• Valores que você deixar de pagar por anulação/cancelamento de parcelas

📌 **45%** sobre:
• Indenizações por danos morais
• Multas aplicadas ao banco
• Penalidades por má conduta da instituição financeira

**(Valores atualizados conforme orientação do escritório.)**`,
      })
      .where(eq(aiKnowledge.id, id));
    
    console.log("✅ Honorários corrigidos!");
  } else {
    console.log("⚠️ Registro não encontrado");
  }
  
  process.exit(0);
}

corrigir();
