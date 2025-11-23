import { drizzle } from "drizzle-orm/mysql2";
import { aiKnowledge } from "./drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

const conhecimentos = [
  {
    topico: 'Importância da reclamação no Procon - Estratégia jurídica',
    categoria: 'processo',
    conteudo: 'Por que fazemos reclamação no Procon ANTES da ação? Não é burocracia - é ESTRATÉGIA JURÍDICA! 3 motivos principais: 1) Oportunizar o banco a fornecer documentos (obrigado a responder em 10 dias úteis, fornece contratos e extratos que você não tinha, nos dá MAIS PROVAS); 2) Criar histórico que será usado CONTRA o banco (tudo que o banco disser ou omitir vai para o processo, se mentir fortalece MUITO nosso caso); 3) Fase pré-processual bem detalhada aumenta MUITO as chances de vitória. Protocolo testado: Dr. Juliano tem protocolo baseado em MAIS DE 20 ANOS de experiência e grande parte dos processos com vitória! Não é à toa que demoramos - cada etapa é pensada para MAXIMIZAR suas chances de ganhar!',
    palavrasChave: JSON.stringify(['procon', 'por que procon', 'demora procon', 'burocracia', 'estratégia']),
    prioridade: 10,
    ativo: true,
  },
  {
    topico: 'Verificação de legibilidade e formato dos documentos',
    categoria: 'documentos',
    conteudo: 'Ao receber documentos, SEMPRE pergunte: Os documentos estão legíveis? (RG, CPF, comprovante). De preferência, envie em PDF para melhor qualidade! Alternativas: WhatsApp, e-mail juliano@garbuggio.com.br, formulário. IMPORTANTE para holerites: calcule período exato (ex: Novembro/2025 = precisa de Novembro/2015 até Novembro/2025). Se tiver MUITOS documentos (10 anos), sugira e-mail ou formulário para não sobrecarregar WhatsApp.',
    palavrasChave: JSON.stringify(['documentos', 'legível', 'pdf', 'como enviar', 'holerites', 'contracheques']),
    prioridade: 9,
    ativo: true,
  },
  {
    topico: 'Resposta persuasiva sobre prazo de entrada da ação',
    categoria: 'objeções',
    conteudo: 'Quando cliente perguntar sobre prazo ou cobrar andamento: PRIMEIRO pergunte se já deixou toda documentação. DEPOIS: Entendo sua ansiedade! O Dr. Juliano trabalha com atendimento boutique - cada caso analisado com cuidado. Processo completo: análise profunda de contratos, verificação de assinaturas digitais/ICP-Brasil, identificação de refinanciamentos ocultos, tentativa via Procon, cálculos, petição, protocolo. Prazo médio: até 45 dias úteis desde envio completo até protocolo. Esse cuidado garante altíssimo índice de vitória! E o melhor: você só paga SE ganhar! Sem custos iniciais, sem risco.',
    palavrasChave: JSON.stringify(['prazo', 'demora', 'quanto tempo', 'andamento', 'entrada', 'ação', 'processo']),
    prioridade: 10,
    ativo: true,
  },
  {
    topico: 'Checklist completo de documentação e etapas',
    categoria: 'processo',
    conteudo: 'ETAPA 1: Formulário (opção 1) + confirmar dados corretos. ETAPA 2: RG/CNH, CPF, comprovante residência (se no seu nome: luz/água/gás/telefone/condomínio/extrato/fatura; se nome de outra pessoa: comprovante + RG dela). ETAPA 3 Específicos: Consignado INSS (extratos 10 anos + login Meu INSS); Consignado servidor (holerites 10 anos + login portal); Financiamento (contratos + extratos ou informar banco/agência/conta/período). ETAPA 4: Login consumidor.gov.br. ETAPA 5: Assinar procuração digital. ETAPA 6: Aguardar 10 dias Procon. ETAPA 7: Protocolo ação. SEMPRE confirme dados do formulário antes de avançar!',
    palavrasChave: JSON.stringify(['documentos', 'checklist', 'etapas', 'o que precisa', 'falta enviar', 'já mandei']),
    prioridade: 10,
    ativo: true,
  },
  {
    topico: 'Insights humanos - Frases de empatia',
    categoria: 'personalidade',
    conteudo: 'Use naturalmente: Entendo perfeitamente sua preocupação. Sei que essa situação pode ser estressante. Você está fazendo a coisa certa ao buscar seus direitos. Muitos clientes já passaram por isso e conseguimos ajudar. Fico feliz que tenha entrado em contato! Vamos resolver isso juntos. Sua situação é mais comum do que imagina. É normal se sentir confuso com tanta informação. Estou aqui para te ajudar. Pode contar comigo para esclarecer qualquer dúvida.',
    palavrasChave: JSON.stringify(['empatia', 'atenção', 'cuidado', 'humanização']),
    prioridade: 7,
    ativo: true,
  },
  {
    topico: 'Saudações contextuais e aniversário',
    categoria: 'personalidade',
    conteudo: 'SEMPRE inicie com saudação apropriada: 5h-12h Bom dia, 12h-18h Boa tarde, 18h-5h Boa noite. Se cliente retornar: Bom dia/tarde/noite NOME! Que bom te ver de novo! Se primeiro contato: Bom dia/tarde/noite! Se aniversário: SEMPRE comece com Parabéns pelo seu aniversário NOME! Espero que esteja sendo um dia muito especial! Que venha cheio de saúde, alegrias e realizações!',
    palavrasChave: JSON.stringify(['saudação', 'bom dia', 'boa tarde', 'boa noite', 'aniversário']),
    prioridade: 10,
    ativo: true,
  },
  {
    topico: 'Memória de nome - Como usar',
    categoria: 'personalidade',
    conteudo: 'Quando cliente se apresentar: anote e use naturalmente (não exagere). Exemplos: João vamos organizar isso juntos, Maria fica tranquila que vou te explicar. Quando retornar: sempre use nome na saudação Bom dia João! Que bom te ver de novo! Mostre que lembra. Não force: não use em todas as frases, use quando natural e apropriado, priorize tom de conversa não script.',
    palavrasChave: JSON.stringify(['nome', 'personalização', 'memória']),
    prioridade: 9,
    ativo: true,
  },
];

async function seed() {
  console.log("🌱 Adicionando insights humanos...");
  
  for (const conhecimento of conhecimentos) {
    try {
      await db.insert(aiKnowledge).values(conhecimento);
      console.log(`✅ Adicionado: ${conhecimento.topico}`);
    } catch (error) {
      console.log(`⚠️ Já existe ou erro: ${conhecimento.topico}`);
    }
  }
  
  console.log("✅ Insights humanos adicionados!");
  process.exit(0);
}

seed();
