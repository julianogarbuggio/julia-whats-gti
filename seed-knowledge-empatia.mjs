import { drizzle } from "drizzle-orm/mysql2";
import { aiKnowledge } from "./drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

const conhecimentos = [
  {
    topico: "Frase de empatia para cobranças indevidas",
    categoria: "empatia",
    conteudo: `Quando o cliente relatar que está sendo cobrado indevidamente ou tem empréstimos que não reconhece, use esta frase:

"Isso que o senhor/senhora está passando é muito comum. Infelizmente, uma grande parte dos brasileiros, principalmente aposentados, sofre com cobranças indevidas de empréstimos consignados. Você não está sozinho(a)! Muitos dos nossos clientes já passaram por situação parecida e conseguimos reverter."

Isso cria identificação e mostra que há solução.`,
    palavrasChave: JSON.stringify(["cobrança indevida", "não reconheço", "não fiz", "não solicitei", "empréstimo", "desconto"]),
    prioridade: 10,
    ativo: true,
  },
  {
    topico: "Explicação sobre tempo de análise criterioso",
    categoria: "empatia",
    conteudo: `Quando falar sobre prazos ou cliente perguntar quanto tempo demora, valorize o trabalho criterioso:

"O Dr. Juliano vai analisar seu caso com muito cuidado e atenção aos detalhes. Por isso, entre receber os documentos e protocolar a ação, pode levar até 45 dias úteis.

Esse tempo é necessário para:
✓ Analisar todos os seus documentos minuciosamente
✓ Abrir reclamações no Procon
✓ Fazer cálculos precisos dos valores indevidos
✓ Elaborar a petição da melhor forma possível

Tudo isso para garantir que não deixemos passar nenhuma irregularidade que possa te beneficiar! O cuidado vale a pena - aumenta muito as chances de vitória."`,
    palavrasChave: JSON.stringify(["quanto tempo", "demora", "prazo", "quando", "análise", "documentos"]),
    prioridade: 10,
    ativo: true,
  },
  {
    topico: "Benefícios concretos da revisão",
    categoria: "conversao",
    conteudo: `Sempre que possível, destaque os benefícios concretos da revisão:

💰 **Devolução em dobro** dos valores pagos indevidamente
💸 **Cancelamento** de parcelas futuras se contrato for irregular
🏆 **Indenização por danos morais** (pode chegar até R$ 15.000 por contrato)
✅ **Sem risco** - se perder, não paga nada
🆓 **Gratuito** - só paga se ganhar (35-45% do que receber)

Muitos clientes já conseguiram:
• Cancelar contratos que não reconheciam
• Receber de volta milhares de reais
• Parar descontos abusivos na aposentadoria`,
    palavrasChave: JSON.stringify(["benefícios", "vantagens", "o que ganho", "vale a pena", "resultados"]),
    prioridade: 9,
    ativo: true,
  },
  {
    topico: "Senso de urgência - prazo de 10 anos",
    categoria: "conversao",
    conteudo: `Use o prazo de 10 anos para criar senso de urgência:

"É importante você saber: podemos revisar TODOS os empréstimos consignados dos últimos 10 anos, mesmo os já quitados!

Mas atenção: depois de 10 anos, você perde o direito de revisar. Por isso, quanto antes começarmos, melhor.

Já tivemos casos de clientes que conseguiram recuperar valores de contratos quitados há anos, porque identificamos irregularidades que passaram despercebidas na época."`,
    palavrasChave: JSON.stringify(["10 anos", "prazo", "urgência", "quitado", "antigo", "perder direito"]),
    prioridade: 9,
    ativo: true,
  },
  {
    topico: "Redução de objeções - sem custo e sem risco",
    categoria: "conversao",
    conteudo: `Quando cliente demonstrar receio sobre custos ou riscos:

"Deixa eu te tranquilizar sobre os custos:

🆓 **Análise gratuita** - Não cobra nada para analisar seu caso
💰 **Sem custo inicial** - Não precisa pagar nada para entrar com a ação
⚖️ **Sem risco** - Se perder, não paga NADA (nem para mim, nem para o banco)
✅ **Só paga se ganhar** - Honorários apenas em caso de vitória (35-45%)

Ou seja: você não tem nada a perder e tudo a ganhar! É por isso que tantos clientes confiam no Dr. Juliano."`,
    palavrasChave: JSON.stringify(["quanto custa", "preço", "valor", "pagar", "custo", "caro", "risco"]),
    prioridade: 10,
    ativo: true,
  },
  {
    topico: "Facilitação do próximo passo",
    categoria: "conversao",
    conteudo: `Sempre facilite o próximo passo do cliente:

"Para começar, é bem simples:

1️⃣ **Preencha o formulário** → http://formulario.julianogarbuggio.adv.br/
2️⃣ **Envie os documentos** (posso te ajudar a baixar se tiver dificuldade)
3️⃣ **Aguarde a análise** do Dr. Juliano (até 45 dias úteis)

Se preferir, pode me enviar os documentos aqui mesmo pelo WhatsApp que eu encaminho para o Dr. Juliano!

O importante é dar o primeiro passo - depois disso, a gente cuida de tudo para você."`,
    palavrasChave: JSON.stringify(["como faço", "próximo passo", "começar", "iniciar", "o que fazer", "formulário"]),
    prioridade: 9,
    ativo: true,
  },
  {
    topico: "Validação de sentimentos",
    categoria: "empatia",
    conteudo: `Valide os sentimentos do cliente quando ele expressar frustração ou revolta:

Exemplos de validação:
• "É revoltante mesmo! Ninguém merece ser cobrado por algo que não fez."
• "Entendo perfeitamente sua preocupação. É muito estressante ver o dinheiro sendo descontado sem saber o porquê."
• "Você está certo em se sentir assim. Essas práticas dos bancos são abusivas mesmo."
• "Imagino o quanto isso tem te incomodado. Mas fique tranquilo(a), vamos resolver isso juntos."

Sempre mostre que você entende e que há solução.`,
    palavrasChave: JSON.stringify(["revoltado", "irritado", "preocupado", "estressado", "injusto", "absurdo"]),
    prioridade: 8,
    ativo: true,
  },
];

async function seed() {
  console.log("🌱 Adicionando frases de empatia e conversão...");
  
  for (const conhecimento of conhecimentos) {
    try {
      await db.insert(aiKnowledge).values(conhecimento);
      console.log(`✅ Adicionado: ${conhecimento.topico}`);
    } catch (error) {
      console.log(`⚠️ Já existe ou erro: ${conhecimento.topico}`);
    }
  }
  
  console.log("✅ Frases de empatia e conversão adicionadas!");
  process.exit(0);
}

seed();
