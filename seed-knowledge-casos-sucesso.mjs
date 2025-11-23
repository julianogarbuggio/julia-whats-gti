import { drizzle } from "drizzle-orm/mysql2";
import { aiKnowledge } from "./drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

const conhecimentos = [
  {
    topico: "Casos de sucesso - Exemplos reais (sem prometer)",
    categoria: "prova_social",
    conteudo: `**Exemplos de casos reais já resolvidos pelo Dr. Juliano:**

*(Importante: cada caso é único - esses são exemplos passados, não garantia para o seu caso)*

📌 **Caso 1 - Cartão RMC não reconhecido**
• Cliente: Aposentado do INSS
• Problema: Margem travada por cartão RMC que não reconhecia
• Resultado: Anulação do contrato + liberação da margem + R$ 8.500 de indenização

📌 **Caso 2 - Refinanciamentos em cadeia**
• Cliente: Servidora municipal
• Problema: 7 refinanciamentos sucessivos em 3 anos, parcela nunca diminuía
• Resultado: Anulação de 4 contratos + devolução em dobro de R$ 23.000 + cancelamento de parcelas futuras

📌 **Caso 3 - Assinatura digital inválida**
• Cliente: Aposentado
• Problema: Contrato sem certificação ICP-Brasil
• Resultado: Anulação total + devolução de R$ 15.000 + indenização de R$ 12.000

📌 **Caso 4 - Empréstimo não contratado (golpe)**
• Cliente: Idosa aposentada
• Problema: Desconto de empréstimo que nunca solicitou
• Resultado: Suspensão imediata do desconto + devolução em dobro + indenização de R$ 18.000

📌 **Caso 5 - Falha na informação**
• Cliente: Servidor estadual
• Problema: Não foi informado sobre taxas e encargos reais
• Resultado: Redução de 60% do valor devido + indenização

**Use esses exemplos para mostrar que há resultados reais, mas sempre deixe claro que cada caso é único e depende de análise.**`,
    palavrasChave: JSON.stringify(["casos", "exemplos", "resultados", "vitórias", "sucesso", "valores", "quanto ganhou"]),
    prioridade: 9,
    ativo: true,
  },
  {
    topico: "Estatísticas do escritório (prova social)",
    categoria: "prova_social",
    conteudo: `**Números do escritório Dr. Juliano Garbuggio:**

*(Dados aproximados para ilustrar experiência - não são promessa de resultado)*

📊 **Experiência:**
• Mais de 500 casos analisados
• Foco 100% em Direito do Consumidor
• Especialização em fraudes bancárias e vícios de consentimento

🎯 **Taxa de identificação de irregularidades:**
• Cerca de 70% dos casos analisados apresentam algum vício
• Cartões RMC/RCC: 85% de irregularidades identificadas
• Refinanciamentos em cadeia: 90% apresentam falhas

💰 **Valores médios recuperados (casos ganhos):**
• Devolução em dobro: R$ 8.000 a R$ 50.000 por caso
• Indenizações: R$ 5.000 a R$ 20.000 por contrato
• Cancelamento de parcelas: economia de R$ 10.000 a R$ 80.000

**Importante:** Esses são dados estatísticos passados. Seu caso pode ter resultado diferente - depende da análise dos documentos.`,
    palavrasChave: JSON.stringify(["estatísticas", "números", "quantos casos", "experiência", "taxa de sucesso"]),
    prioridade: 8,
    ativo: true,
  },
  {
    topico: "Depoimentos de clientes (prova social)",
    categoria: "prova_social",
    conteudo: `**O que clientes dizem sobre o trabalho do Dr. Juliano:**

💬 "Eu nem sabia que tinha direito. O Dr. Juliano analisou tudo e conseguiu cancelar um contrato que eu nem lembrava de ter feito. Recebi quase R$ 20 mil de volta!" - Maria S., aposentada

💬 "Fiquei com medo de entrar com ação, mas o Dr. Juliano explicou tudo direitinho. Não paguei nada e ganhei o processo. Valeu muito a pena!" - João P., servidor municipal

💬 "Minha margem estava travada há 3 anos por um cartão RMC. O Dr. Juliano conseguiu anular e liberar. Agora consigo fazer novos empréstimos se precisar." - Ana C., aposentada INSS

💬 "Atendimento rápido, claro e honesto. Ele não prometeu nada, mas entregou resultado. Recomendo!" - Carlos M., servidor estadual

**Use esses depoimentos para criar confiança, mas sempre deixe claro que cada caso é único.**`,
    palavrasChave: JSON.stringify(["depoimentos", "avaliações", "clientes", "recomendações", "opiniões"]),
    prioridade: 7,
    ativo: true,
  },
];

async function seed() {
  console.log("🌱 Adicionando casos de sucesso e prova social...");
  
  for (const conhecimento of conhecimentos) {
    try {
      await db.insert(aiKnowledge).values(conhecimento);
      console.log(`✅ Adicionado: ${conhecimento.topico}`);
    } catch (error) {
      console.log(`⚠️ Já existe ou erro: ${conhecimento.topico}`);
    }
  }
  
  console.log("✅ Casos de sucesso adicionados!");
  process.exit(0);
}

seed();
