import { drizzle } from "drizzle-orm/mysql2";
import { aiKnowledge } from "./drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

const conhecimentos = [
  {
    topico: "Mensagem inicial com opções de atendimento",
    categoria: "mensagens_padrao",
    conteudo: `Olá! Sou a *Jul.IA,* assistente virtual do escritório *Juliano Garbuggio*, especializado em Direito do Consumidor. Estou aqui para te ajudar! 

*Qual tipo de problema você tem?*
1️⃣ Revisão de Empréstimo Consignado 
2️⃣ Outro caso de Direito do Consumidor 
3️⃣ Direito Médico 
4️⃣ Direito Digital (conta suspensa/excluída) 
5️⃣ Outra dúvida`,
    palavrasChave: JSON.stringify(["boas vindas", "início", "menu", "opções", "primeiro contato"]),
    prioridade: 10,
    ativo: true,
  },
  {
    topico: "Aviso sobre golpes e números oficiais",
    categoria: "seguranca",
    conteudo: `⚠️ CUIDADO COM GOLPE DO "FALSO ADVOGADO" ⚠️

🚨 Atenção: Eu e meu escritório usamos apenas dois números oficiais:
📱 (44) 99986-9223
📞 (11) 95675-9223 (preferencial)

Qualquer outro número é golpe.
Eu nunca peço dinheiro nem envio boletos.

💰 Se houver pagamento, será somente via PIX para:
🏢 Juliano Garbuggio Sociedade Individual de Advocacia
📜 CNPJ 35.142.789/0001-08

⚖️ Juliano Garbuggio
OAB/PR 47.565 • OAB/SP 505.598 • OAB/MG 234.362
🌐 www.julianogarbuggio.adv.br
📧 juliano@garbuggio.com.br
📸 @julianogarbuggio.adv`,
    palavrasChave: JSON.stringify(["golpe", "falso advogado", "números oficiais", "segurança", "CNPJ", "PIX"]),
    prioridade: 10,
    ativo: true,
  },
  {
    topico: "Informações sobre ações protocoladas",
    categoria: "atendimento",
    conteudo: `📌 INFORMAÇÕES IMPORTANTES SOBRE SUA AÇÃO ⚖️

Suas ações revisionais foram protocoladas com sucesso. 🙏
A partir de agora, fique atento(a) a golpes:

🚫 Eu nunca ligo para clientes — falo apenas por WhatsApp.
🚫 Não envio boletos por e-mail.
🚫 Não peço depósitos em contas de terceiros.

✅ Contatos oficiais:
📱 (44) 99986-9223
📱 (11) 95675-9223

💳 Se houver custas (raro), o pagamento é sempre via PIX – CNPJ 35.142.789/0001-08

📎 Dúvidas? Fale somente por um desses números oficiais.
⚠️ Cuidado com mensagens falsas em meu nome.

🤝 Juliano Garbuggio
OAB/PR 47.565 • OAB/SP 505.598 • OAB/MG 234.362
🌐 www.julianogarbuggio.adv.br`,
    palavrasChave: JSON.stringify(["ação protocolada", "processo protocolado", "protocolo", "golpes", "cuidados"]),
    prioridade: 9,
    ativo: true,
  },
  {
    topico: "Tipos de desconto de empréstimo consignado",
    categoria: "qualificacao",
    conteudo: `Preciso saber também se os seus *empréstimos* são descontados em/no:

1️⃣ INSS 
2️⃣ Prefeitura/Estado
3️⃣ Empresa Privada 
4️⃣ desconto na conta corrente`,
    palavrasChave: JSON.stringify(["tipo desconto", "INSS", "prefeitura", "estado", "empresa privada", "conta corrente"]),
    prioridade: 8,
    ativo: true,
  },
  {
    topico: "Prazo de 45 dias úteis para protocolo da ação",
    categoria: "prazos",
    conteudo: `📌 *Prazo e andamento da Revisão de Empréstimo Consignado*

A revisão passa por várias etapas: coleta de documentos, reclamação no Procon, análise dos contratos e cálculos antes do protocolo da ação. ⚖️

⏱️ Prazo médio para ajuizar: até 45 dias úteis após assinatura e envio dos documentos. Pode variar conforme a complexidade do caso.

🕐 Duração do processo: depende do juiz — alguns encerram em poucos meses, outros em até 2 anos.

💡 Importante: só recebo percentual se o cliente ganhar — então meu interesse é resolver o quanto antes.

🎯 Nosso foco: cancelar contratos indevidos, parar descontos e buscar devolução em dobro + indenização.`,
    palavrasChave: JSON.stringify(["prazo", "45 dias", "quanto tempo", "demora", "protocolo", "duração processo"]),
    prioridade: 10,
    ativo: true,
  },
  {
    topico: "Reclamação no Procon registrada",
    categoria: "procon",
    conteudo: `📢 Olá, tudo bem?

Sua reclamação no PROCON já foi registrada.
O banco tem *10 dias para responder*. Se não resolver, entraremos com a ação após esta data.

Se o banco contatar você, CUIDADO:
⛔️ Podem querer forçar vc assumir que estava ciente dos empréstimos. Não caia nessa! Apenas informe que deseja:
• Extratos e contratos dos últimos 10 anos
• Cancelamento de contratos irregulares e devolução em dobro

Se continuarem insistindo passem o meu contato para tratar sobre isso.

📧 Chegará um e-mail do Consumidor.gov.br (protocolo) — pode apagar.

Demais e-mails, encaminhe para juliano@garbuggio.com.br.`,
    palavrasChave: JSON.stringify(["procon", "reclamação", "banco", "10 dias", "consumidor.gov.br"]),
    prioridade: 9,
    ativo: true,
  },
  {
    topico: "Honorários detalhados em caso de vitória",
    categoria: "honorarios",
    conteudo: `🏆 E SE GANHAR, COMO FUNCIONAM OS HONORÁRIOS?

Em caso de vitória:

💸 35% do que deixar de pagar (se o contrato for declarado indevido);
💰 40% do que receber de volta (valores pagos indevidamente);
🏅 45% sobre indenizações morais e multas aplicadas ao banco.`,
    palavrasChave: JSON.stringify(["honorários", "ganhar", "vitória", "35%", "40%", "45%", "percentual"]),
    prioridade: 9,
    ativo: true,
  },
  {
    topico: "Sem custos se perder o processo",
    categoria: "honorarios",
    conteudo: `⚖️ E SE PERDER O PROCESSO, PAGO ALGUMA COISA?

*Não!* 🙅‍♂️
Se a ação for no Juizado, não há condenação em honorários.
E se for na Vara Cível com Justiça Gratuita, também não paga nada nem ao advogado do banco.
Ou seja: sem risco pra você.`,
    palavrasChave: JSON.stringify(["perder", "custos", "risco", "juizado", "justiça gratuita", "sem custo"]),
    prioridade: 9,
    ativo: true,
  },
  {
    topico: "Sem custos iniciais",
    categoria: "honorarios",
    conteudo: `Não 💰
A ação é sem custo inicial pra você.
Se tiver direito à Justiça Gratuita, não há custas nem risco de pagar honorários ao banco. Eu te explico direitinho quando formos entrar 😉`,
    palavrasChave: JSON.stringify(["custo inicial", "quanto custa", "preciso pagar", "gratuito"]),
    prioridade: 9,
    ativo: true,
  },
  {
    topico: "Tempo de duração do processo",
    categoria: "prazos",
    conteudo: `O *tempo de uma ação destas* varia conforme o tribunal ⏳
Normalmente, ações desse tipo demoram de alguns meses a cerca de 1 ano, dependendo do volume de processos do juiz.
Mas pode ficar tranquilo(a): sempre que houver novidade importante, eu aviso.`,
    palavrasChave: JSON.stringify(["tempo", "duração", "quanto tempo demora", "1 ano", "meses"]),
    prioridade: 8,
    ativo: true,
  },
  {
    topico: "Revisão de contratos dos últimos 10 anos",
    categoria: "servicos",
    conteudo: `🙌🏻Vc sabia que podemos *revisar todos os empréstimos consignados dos últimos 10 anos* mesmo que vc tenha solicitado?`,
    palavrasChave: JSON.stringify(["10 anos", "revisar", "contratos antigos", "mesmo solicitado"]),
    prioridade: 8,
    ativo: true,
  },
  {
    topico: "Link do formulário de atendimento",
    categoria: "atendimento",
    conteudo: `Para iniciar atendimento de consignados:
👉 http://formulario.julianogarbuggio.adv.br/`,
    palavrasChave: JSON.stringify(["formulário", "link", "iniciar atendimento", "cadastro"]),
    prioridade: 7,
    ativo: true,
  },
  {
    topico: "Mensagem de encerramento",
    categoria: "mensagens_padrao",
    conteudo: `💬 Agradeço o contato! Qualquer coisa, é só me chamar. E pode deixar: assim que tiver novidades, te passo! 📲✨`,
    palavrasChave: JSON.stringify(["encerramento", "despedida", "obrigado", "tchau"]),
    prioridade: 7,
    ativo: true,
  },
];

async function seed() {
  console.log("🌱 Adicionando frases prontas na base de conhecimento...");
  
  for (const conhecimento of conhecimentos) {
    try {
      await db.insert(aiKnowledge).values(conhecimento);
      console.log(`✅ Adicionado: ${conhecimento.topico}`);
    } catch (error) {
      console.log(`⚠️ Já existe ou erro: ${conhecimento.topico}`);
    }
  }
  
  console.log("✅ Frases prontas adicionadas com sucesso!");
  process.exit(0);
}

seed();
