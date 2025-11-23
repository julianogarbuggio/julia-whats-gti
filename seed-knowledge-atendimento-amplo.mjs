import { drizzle } from "drizzle-orm/mysql2";
import { aiKnowledge } from "./drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

const conhecimentos = [
  {
    topico: 'Atendimento amplo - Direito do Consumidor em geral',
    categoria: 'servicos',
    conteudo: 'O Dr. Juliano atende AMPLA GAMA de ações de Direito do Consumidor! Especialização principal: empréstimos consignados e revisão bancária. MAS TAMBÉM atendemos: problemas com produtos/serviços defeituosos, cobranças indevidas, negativação indevida, planos de saúde, telefonia, internet, energia elétrica, água, compras online, entregas não realizadas, garantia, troca/devolução, propaganda enganosa, venda casada, cláusulas abusivas, e muito mais! Se for Direito do Consumidor, PROVAVELMENTE fazemos! Sempre pergunte o problema específico do cliente e diga: Vou anotar tudo e encaminhar para análise do Dr. Juliano!',
    palavrasChave: JSON.stringify(['direito do consumidor', 'problema', 'reclamação', 'defeito', 'cobrança', 'negativação', 'plano de saúde']),
    prioridade: 9,
    ativo: true,
  },
  {
    topico: 'NUNCA recusar cliente - Estratégia de encaminhamento',
    categoria: 'atendimento',
    conteudo: 'REGRA DE OURO: NUNCA diga NÃO ao cliente! NUNCA diga que não atendemos! Mesmo que seja área diferente (trabalhista, família, criminal, cível), SEMPRE diga: Vou encaminhar seu caso para o time do Dr. Juliano Garbuggio avaliar! Ou: Vou passar suas informações para análise! Estratégia: 1) Ouvir o problema; 2) Coletar informações básicas; 3) Dizer que vai encaminhar; 4) Notificar Dr. Juliano. NUNCA perder cliente! Se não for nossa área principal, o time avalia e decide - mas NUNCA recuse diretamente!',
    palavrasChave: JSON.stringify(['não atendo', 'não faço', 'outra área', 'trabalhista', 'família', 'criminal', 'cível']),
    prioridade: 10,
    ativo: true,
  },
  {
    topico: 'Como perguntar sobre o problema do cliente',
    categoria: 'atendimento',
    conteudo: 'Sempre comece perguntando: Qual problema você está enfrentando? ou O que aconteceu? ou Como posso te ajudar? NÃO assuma que é empréstimo consignado! Cliente pode ter: problema com produto, serviço, cobrança, negativação, plano de saúde, telefonia, etc. Depois de ouvir: Se Direito Consumidor → Provavelmente atendemos! Vou anotar tudo. Se outra área → Vou encaminhar para o time avaliar! Sempre coletar: nome, problema resumido, urgência. NUNCA dizer que não fazemos!',
    palavrasChave: JSON.stringify(['qual problema', 'o que aconteceu', 'como ajudar', 'preciso de ajuda']),
    prioridade: 9,
    ativo: true,
  },
];

async function seed() {
  console.log("🌐 Adicionando conhecimento sobre atendimento amplo...");
  
  for (const conhecimento of conhecimentos) {
    try {
      await db.insert(aiKnowledge).values(conhecimento);
      console.log(`✅ Adicionado: ${conhecimento.topico}`);
    } catch (error) {
      console.log(`⚠️ Já existe ou erro: ${conhecimento.topico}`);
    }
  }
  
  console.log("✅ Conhecimento sobre atendimento amplo adicionado!");
  process.exit(0);
}

seed();
