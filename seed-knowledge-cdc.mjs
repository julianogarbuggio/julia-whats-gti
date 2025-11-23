import { drizzle } from "drizzle-orm/mysql2";
import { aiKnowledge } from "./drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

const knowledgeItems = [
  // ============================================
  // CÓDIGO DE DEFESA DO CONSUMIDOR - FUNDAMENTOS
  // ============================================
  {
    categoria: "cdc-fundamentos",
    topico: "O que é o Código de Defesa do Consumidor (CDC)?",
    conteudo: `**CÓDIGO DE DEFESA DO CONSUMIDOR (CDC) - Lei 8.078/1990**

📜 **O QUE É:**
- Lei federal que protege TODOS os consumidores brasileiros
- Vale para QUALQUER compra de produto ou serviço
- Empresa que desrespeita o CDC pode ser processada

🛡️ **PRINCIPAIS DIREITOS DO CONSUMIDOR:**

1️⃣ **DIREITO À INFORMAÇÃO:**
- Empresa deve informar TUDO sobre produto/serviço
- Preço, características, riscos, prazo de entrega
- Informação falsa = propaganda enganosa

2️⃣ **DIREITO DE ARREPENDIMENTO:**
- Comprou pela internet/telefone? Pode desistir em 7 dias
- Devolução do dinheiro INTEGRAL
- Não precisa justificar

3️⃣ **DIREITO À GARANTIA:**
- Produto com defeito? Empresa deve consertar, trocar ou devolver dinheiro
- Prazo: 30 dias (produto não durável) ou 90 dias (produto durável)
- Garantia legal (do CDC) + garantia contratual (da empresa)

4️⃣ **DIREITO À REPARAÇÃO:**
- Empresa causou dano? DEVE indenizar
- Danos materiais (prejuízo financeiro)
- Danos morais (constrangimento, humilhação, transtorno)

5️⃣ **PROTEÇÃO CONTRA COBRANÇAS ABUSIVAS:**
- Cobrou dívida que não existe? Indenização
- Negativou sem avisar? Indenização
- Ligações insistentes? Indenização

**IMPORTANTE:**
O Dr. Juliano é especialista em Direito do Consumidor e pode te ajudar com QUALQUER problema relacionado a compras, serviços, cobranças, negativações, etc!`,
    palavrasChave: JSON.stringify(["cdc", "código de defesa do consumidor", "direitos do consumidor", "lei 8078"]),
    prioridade: 10,
    ativo: true,
  },

  {
    categoria: "cdc-fundamentos",
    topico: "Quando posso processar uma empresa por danos morais?",
    conteudo: `**DANOS MORAIS - QUANDO CABE:**

✅ **VOCÊ TEM DIREITO A INDENIZAÇÃO POR DANOS MORAIS QUANDO:**

1️⃣ **INSCRIÇÃO INDEVIDA (SERASA/SPC):**
- Negativou seu nome sem dever
- Negativou sem avisar antes
- Manteve negativação após pagamento
- Valores: R$ 3.000 a R$ 15.000

2️⃣ **COBRANÇA VEXATÓRIA:**
- Ligações insistentes (várias por dia)
- Ameaças ou constrangimento
- Cobrança em local público (trabalho, vizinhos)
- Valores: R$ 2.000 a R$ 10.000

3️⃣ **PRODUTO/SERVIÇO DEFEITUOSO:**
- Causou transtorno grave
- Empresa se recusou a resolver
- Prejuízo significativo
- Valores: R$ 1.000 a R$ 8.000

4️⃣ **PROPAGANDA ENGANOSA:**
- Empresa mentiu sobre produto/serviço
- Você foi enganado
- Causou prejuízo
- Valores: R$ 2.000 a R$ 10.000

5️⃣ **DESCUMPRIMENTO DE CONTRATO:**
- Empresa não entregou o prometido
- Causou transtorno grave
- Você tentou resolver e empresa ignorou
- Valores: R$ 1.000 a R$ 8.000

**NÃO CABE DANOS MORAIS:**
❌ Mero aborrecimento (pequeno atraso, pequeno defeito)
❌ Situações sem gravidade
❌ Quando empresa resolveu rapidamente

**IMPORTANTE:**
Cada caso é único! O Dr. Juliano analisa seu caso e te diz se cabe indenização e quanto você pode receber.`,
    palavrasChave: JSON.stringify(["danos morais", "indenização", "quando cabe", "valores"]),
    prioridade: 10,
    ativo: true,
  },

  {
    categoria: "cdc-fundamentos",
    topico: "Como funciona o prazo de garantia?",
    conteudo: `**GARANTIA - COMO FUNCIONA:**

📅 **PRAZOS DE GARANTIA LEGAL (CDC):**

**PRODUTOS NÃO DURÁVEIS:** 30 dias
- Alimentos, cosméticos, produtos de limpeza
- Conta a partir da compra

**PRODUTOS DURÁVEIS:** 90 dias
- Eletrônicos, eletrodomésticos, móveis, roupas
- Conta a partir da compra

⚠️ **DEFEITO APARECEU DEPOIS:**
- Vício oculto (defeito que não dá pra ver na hora)
- Prazo conta a partir que descobriu o defeito
- Não a partir da compra!

🛡️ **GARANTIA CONTRATUAL (DA EMPRESA):**
- Empresa pode dar garantia ALÉM da legal
- Ex: CDC dá 90 dias, empresa dá 1 ano
- As duas somam! (90 dias + 1 ano = 1 ano e 3 meses)

✅ **SEUS DIREITOS QUANDO TEM DEFEITO:**

Você pode escolher:
1️⃣ **CONSERTAR** (empresa tem 30 dias)
2️⃣ **TROCAR** por produto novo
3️⃣ **DEVOLVER** e receber dinheiro de volta

**SE EMPRESA SE RECUSAR:**
- Você pode processar
- Pedir devolução do dinheiro
- Pedir indenização por danos morais
- Valores: R$ 2.000 a R$ 10.000

**IMPORTANTE:**
Guarde nota fiscal, comprovante, fotos do defeito!
O Dr. Juliano te ajuda a processar a empresa.`,
    palavrasChave: JSON.stringify(["garantia", "prazo", "defeito", "vício", "conserto", "troca"]),
    prioridade: 9,
    ativo: true,
  },

  {
    categoria: "cdc-fundamentos",
    topico: "Comprei pela internet e me arrependi, posso devolver?",
    conteudo: `**DIREITO DE ARREPENDIMENTO - COMPRAS ONLINE:**

✅ **SIM, VOCÊ PODE DEVOLVER!**

📱 **VALE PARA:**
- Compras pela internet
- Compras por telefone
- Compras por catálogo
- Compras fora do estabelecimento

📅 **PRAZO:**
- 7 dias corridos
- Conta a partir que recebeu o produto
- Ou a partir que assinou o contrato (serviços)

💰 **DEVOLUÇÃO DO DINHEIRO:**
- Empresa deve devolver 100% do valor
- Incluindo frete
- Imediatamente (não pode demorar)

📦 **PRODUTO:**
- Pode estar aberto (você pode testar!)
- Mas não pode estar danificado
- Devolva na embalagem original (se possível)

⚠️ **EMPRESA SE RECUSOU?**
- Você pode processar
- Pedir devolução do dinheiro
- Pedir indenização por danos morais
- Valores: R$ 2.000 a R$ 8.000

**IMPORTANTE:**
- Não precisa justificar por que está devolvendo
- É seu DIREITO!
- Empresa que se recusa está ERRADA

**COMO FAZER:**
1. Entre em contato com a empresa
2. Diga que quer exercer direito de arrependimento
3. Peça endereço para devolução
4. Envie produto de volta
5. Cobre devolução do dinheiro

Se empresa não devolver, procure o Dr. Juliano!`,
    palavrasChave: JSON.stringify(["arrependimento", "7 dias", "compra online", "internet", "devolver", "desistir"]),
    prioridade: 9,
    ativo: true,
  },

  {
    categoria: "cdc-fundamentos",
    topico: "Empresa não entregou produto no prazo, o que fazer?",
    conteudo: `**ATRASO NA ENTREGA - SEUS DIREITOS:**

⏰ **EMPRESA ATRASOU A ENTREGA:**

✅ **VOCÊ PODE ESCOLHER:**

1️⃣ **ESPERAR MAIS UM POUCO:**
- Empresa deve dar novo prazo
- Prazo razoável (não pode ser muito longo)

2️⃣ **CANCELAR E PEDIR DINHEIRO DE VOLTA:**
- Devolução INTEGRAL
- Incluindo frete
- Imediatamente

3️⃣ **ACEITAR PRODUTO SIMILAR:**
- Se empresa oferecer
- Mesmo preço ou menor
- Você não é obrigado a aceitar

💰 **INDENIZAÇÃO POR DANOS MORAIS:**

Pode caber se:
- Atraso causou transtorno grave
- Você perdeu compromisso importante
- Empresa não deu satisfação
- Valores: R$ 1.000 a R$ 5.000

**EXEMPLOS QUE CABEM INDENIZAÇÃO:**
- Comprou presente de aniversário e não chegou a tempo
- Comprou para casamento e não chegou
- Empresa prometeu urgente e atrasou muito
- Empresa ignorou suas reclamações

**O QUE FAZER:**

1. Entre em contato com empresa
2. Reclame no Reclame Aqui
3. Registre no Procon
4. Se não resolver: procure o Dr. Juliano

**IMPORTANTE:**
Guarde prints das conversas, comprovante de compra, prazo prometido!

O Dr. Juliano te ajuda a processar a empresa e receber indenização.`,
    palavrasChave: JSON.stringify(["atraso", "entrega", "não chegou", "prazo", "cancelar"]),
    prioridade: 9,
    ativo: true,
  },
];

async function seed() {
  console.log("🌱 Inserindo conhecimento sobre CDC...");
  
  for (const item of knowledgeItems) {
    await db.insert(aiKnowledge).values(item);
    console.log(`✅ ${item.topico}`);
  }
  
  console.log("\n🎉 Conhecimento sobre CDC inserido com sucesso!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Erro ao inserir conhecimento:", error);
  process.exit(1);
});
