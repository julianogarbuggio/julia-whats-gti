import { drizzle } from "drizzle-orm/mysql2";
import { aiKnowledge } from "./drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

const conhecimentos = [
  {
    topico: 'GOLPE: Indenização por sobrenome português - FALSO!',
    categoria: 'seguranca',
    conteudo: '🚨 ATENÇÃO: É GOLPE! Não existe indenização por sobrenome português ou nacionalidade! O Dr. Juliano NUNCA fez esse tipo de processo e NUNCA fará! Anúncios no Facebook/Instagram usando o nome dele são FALSOS! O Dr. Juliano é focado EXCLUSIVAMENTE em empréstimos consignados e revisão de contratos bancários. Se você viu anúncio sobre sobrenome português, é golpe usando indevidamente o nome dele. MAS JÁ QUE ESTÁ AQUI: Por acaso você tem empréstimo consignado? O Dr. Juliano É ESPECIALISTA nisso! Fazemos revisão de consignados INSS, servidores públicos, privados e financiamentos bancários gerais (exceto veículos/imóveis). Posso te ajudar com isso?',
    palavrasChave: JSON.stringify(['sobrenome português', 'indenização', 'nacionalidade', 'facebook', 'instagram', 'meta', 'anúncio']),
    prioridade: 10,
    ativo: true,
  },
  {
    topico: 'ALERTA: Golpe do Falso Advogado - Números Oficiais',
    categoria: 'seguranca',
    conteudo: 'NÚMEROS OFICIAIS DO DR. JULIANO: (11) 95675-9223 (preferencial) e (44) 99986-9223. QUALQUER OUTRO NÚMERO É GOLPE! Se alguém te contactar por outro número dizendo ser do escritório, mesmo com foto do Dr. Juliano, É GOLPE! Não passe dados, não pague nada. CNPJ oficial: 35.142.789/0001-08. Se houver pagamento (raro), será SOMENTE via PIX para este CNPJ. Nunca enviamos boletos por e-mail nem pedimos depósitos em contas de terceiros.',
    palavrasChave: JSON.stringify(['golpe', 'outro número', 'outro telefone', 'me ligaram', 'falso advogado', 'número diferente']),
    prioridade: 10,
    ativo: true,
  },
  {
    topico: 'Golpe do Falso Advogado - Orientações e Links da OAB',
    categoria: 'seguranca',
    conteudo: 'CUIDADO COM GOLPE DO FALSO ADVOGADO! Golpistas clonam fotos e se passam por advogados. NÃO É PORQUE TEM FOTO DO ADVOGADO QUE É VERDADEIRO! Sempre confira: 1) Número oficial (11) 95675-9223 ou (44) 99986-9223; 2) CNPJ 35.142.789/0001-08; 3) OABs: SP 505.598, PR 47.565, MG 234.362. Links sobre golpe: OAB/SP https://www.oabsp.org.br/servicos-consulta/consulta-de-advogados, OAB/PR https://www.oabpr.org.br/, OAB/MG https://www.oabmg.org.br/. Se receber contato suspeito, confirme SEMPRE pelos números oficiais antes de passar qualquer dado ou pagar qualquer coisa!',
    palavrasChave: JSON.stringify(['golpe', 'segurança', 'falso advogado', 'cuidado', 'fraude', 'clone']),
    prioridade: 10,
    ativo: true,
  },
  {
    topico: 'Como identificar golpe do falso advogado',
    categoria: 'seguranca',
    conteudo: 'SINAIS DE GOLPE: 1) Contato por número diferente dos oficiais; 2) Pedido urgente de pagamento; 3) Boleto por e-mail; 4) Pedido de depósito em conta pessoal; 5) Pressão para decidir rápido. O QUE FAZER: Desligue, bloqueie o número e entre em contato IMEDIATAMENTE pelos números oficiais (11) 95675-9223 ou (44) 99986-9223 para confirmar. NUNCA passe dados pessoais ou faça pagamentos sem confirmar pelos canais oficiais. O Dr. Juliano NUNCA liga para clientes - fala apenas por WhatsApp nos números oficiais.',
    palavrasChave: JSON.stringify(['como identificar golpe', 'sinais de golpe', 'o que fazer', 'suspeito', 'desconfiar']),
    prioridade: 9,
    ativo: true,
  },
];

async function seed() {
  console.log("🚨 Adicionando conhecimento sobre golpe do falso advogado...");
  
  for (const conhecimento of conhecimentos) {
    try {
      await db.insert(aiKnowledge).values(conhecimento);
      console.log(`✅ Adicionado: ${conhecimento.topico}`);
    } catch (error) {
      console.log(`⚠️ Já existe ou erro: ${conhecimento.topico}`);
    }
  }
  
  console.log("✅ Conhecimento sobre golpe adicionado!");
  process.exit(0);
}

seed();
