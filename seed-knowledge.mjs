import { drizzle } from "drizzle-orm/mysql2";
import { aiKnowledge } from "./drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

const conhecimentos = [
  {
    topico: "Contratos que revisamos",
    categoria: "servicos",
    conteudo: `Reviso todos os contratos de empréstimos consignados e financiamentos bancários pessoais ou empresariais, exceto financiamentos de veículos e imóveis.

Qualquer contrato dos últimos 10 anos, mesmo os já quitados, pode ser revisado judicialmente.

Quando a ação é ganha, normalmente os valores cobrados indevidamente são devolvidos em dobro pelo banco.`,
    palavrasChave: JSON.stringify(["contratos", "empréstimos", "consignados", "financiamentos", "revisão", "10 anos", "quitados"]),
    prioridade: 10,
    ativo: true,
  },
  {
    topico: "Motivos de anulação de contratos",
    categoria: "direitos",
    conteudo: `Mesmo que você tenha solicitado o empréstimo, ele pode ser anulado quando:
• não explicaram corretamente taxas, parcelas ou condições;
• falta assinatura em todas as folhas;
• foi feito por telefone, caixa eletrônico ou link digital;
• a assinatura digital não segue as regras da legislação.

Isso pode gerar:
• Devolução em dobro dos valores indevidos;
• Indenização por danos morais (podendo chegar até R$ 15.000,00 por contrato);
• Cancelamento das parcelas futuras.`,
    palavrasChave: JSON.stringify(["anulação", "motivos", "irregularidades", "assinatura", "digital", "devolução", "danos morais", "cancelamento"]),
    prioridade: 10,
    ativo: true,
  },
  {
    topico: "Processo de trabalho",
    categoria: "servicos",
    conteudo: `O que eu faço por você:
1. Abro reclamações no Procon contra os bancos envolvidos;
2. Faço análise completa dos extratos do INSS e dos contratos (ou dos documentos fornecidos pela sua empregadora/bancos);
3. Se não houver acordo, ingresso com ação judicial pedindo devolução, cancelamento e indenização.`,
    palavrasChave: JSON.stringify(["processo", "procon", "análise", "ação judicial", "acordo"]),
    prioridade: 8,
    ativo: true,
  },
  {
    topico: "Custos do serviço",
    categoria: "honorarios",
    conteudo: `A análise, orientação e reclamações no Procon são gratuitas.

Para entrar com a ação:
• Pelo Juizado Especial Cível, não há custas;
• Pela Vara Cível, com Justiça Gratuita, você também não paga custas.

Se perder, não paga nada - nem para mim, nem para o banco.
(Juizado não tem sucumbência, e na Vara Cível, com Justiça Gratuita, também não paga honorários ao banco.)`,
    palavrasChave: JSON.stringify(["custos", "gratuito", "custas", "perder", "sucumbência"]),
    prioridade: 9,
    ativo: true,
  },
  {
    topico: "Honorários em caso de vitória",
    categoria: "honorarios",
    conteudo: `Se ganhar, os honorários são:

📌 35% do proveito econômico, incluindo:
• valores devolvidos (em dobro);
• valores economizados com cancelamento/anulação das parcelas.

📌 45% de:
• danos morais;
• multas aplicadas ao banco.`,
    palavrasChave: JSON.stringify(["honorários", "ganhar", "vitória", "35%", "45%", "proveito econômico", "danos morais"]),
    prioridade: 9,
    ativo: true,
  },
  {
    topico: "Documentos para consignados do INSS",
    categoria: "documentos",
    conteudo: `Para consignados do INSS, preciso de:
• Extrato completo e atualizado de empréstimos ativos e encerrados;
• Comprovantes de recebimento do benefício (últimos 10 anos);
• Se tiver mais de um benefício, enviar todos.

Esses documentos podem ser baixados no aplicativo Meu INSS.
Se tiver dificuldade, posso baixar para você — basta me enviar login e senha.`,
    palavrasChave: JSON.stringify(["documentos", "INSS", "consignado", "extrato", "Meu INSS", "benefício"]),
    prioridade: 7,
    ativo: true,
  },
  {
    topico: "Documentos para consignados municipais, estaduais ou privados",
    categoria: "documentos",
    conteudo: `Para consignados municipais, estaduais ou de empresas privadas, preciso de:
• Contra-cheques dos últimos 10 anos.

Eles podem ser baixados no site da sua empregadora.
Se preferir que eu baixe, preciso do login e senha.`,
    palavrasChave: JSON.stringify(["documentos", "municipal", "estadual", "privado", "contra-cheque", "empregadora"]),
    prioridade: 7,
    ativo: true,
  },
  {
    topico: "Documentos para financiamentos bancários",
    categoria: "documentos",
    conteudo: `Para financiamentos bancários (exceto veículos), preciso de:
• Cópia dos contratos que deseja revisar (últimos 10 anos);
• Extratos da conta corrente do período correspondente.

Se não tiver os contratos, basta informar:
➡️ banco, agência e conta onde os empréstimos foram feitos.`,
    palavrasChave: JSON.stringify(["documentos", "financiamento", "bancário", "contratos", "extratos", "banco", "agência", "conta"]),
    prioridade: 7,
    ativo: true,
  },
  {
    topico: "Documentos pessoais necessários",
    categoria: "documentos",
    conteudo: `Além dos documentos específicos do empréstimo, também preciso:
• Login e senha do consumidor.gov.br / GOV.BR para registrar as reclamações;
• RG/CPF ou CNH (foto nítida);
• Comprovante de residência dos últimos 30 dias.`,
    palavrasChave: JSON.stringify(["documentos pessoais", "consumidor.gov.br", "GOV.BR", "RG", "CPF", "CNH", "comprovante residência"]),
    prioridade: 7,
    ativo: true,
  },
];

async function seed() {
  console.log("🌱 Populando base de conhecimento...");
  
  for (const conhecimento of conhecimentos) {
    try {
      await db.insert(aiKnowledge).values(conhecimento);
      console.log(`✅ Adicionado: ${conhecimento.topico}`);
    } catch (error) {
      console.log(`⚠️ Já existe ou erro: ${conhecimento.topico}`);
    }
  }
  
  console.log("✅ Base de conhecimento populada com sucesso!");
  process.exit(0);
}

seed();
