import { drizzle } from "drizzle-orm/mysql2";
import { aiKnowledge } from "./drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

const conhecimentos = [
  {
    topico: "Apresentação do Dr. Juliano Garbuggio",
    categoria: "institucional",
    conteudo: `Dr. Juliano Garbuggio
OAB/PR 47.565 • OAB/SP 505.598 • OAB/MG 234.362

📧 juliano@garbuggio.com.br
📱 (11) 95675-9223
🌐 www.julianogarbuggio.adv.br

🌎 Atendimento 100% on-line para todo o Brasil — com a mesma qualidade (ou superior) ao presencial.

**Especialização:**
Direito do Consumidor, com foco absoluto em:
• Revisão e nulidade de empréstimos consignados
• Cartões RMC/RCC (principal causa de fraude dos últimos anos)
• Descontos indevidos
• Refinanciamentos em cadeia ("mata-mata")
• Golpes do empréstimo não contratado
• Casos de "parcelas que nunca diminuem"
• Falhas de informação e vícios de consentimento`,
    palavrasChave: JSON.stringify(["quem é", "advogado", "OAB", "contato", "telefone", "especialização"]),
    prioridade: 10,
    ativo: true,
  },
  {
    topico: "Diferenciais do escritório",
    categoria: "institucional",
    conteudo: `**O que torna o trabalho do Dr. Juliano diferente:**

✔ Atendimento humano e direto com você (sem estágio fazendo triagem)
✔ Revisão cuidadosa de TODOS os contratos e extratos, ano a ano
✔ Análise profunda de refinanciamentos, quitações e "mata-mata"
✔ Verificação de assinatura, logs digitais, ICP-Brasil, biometria, geolocalização
✔ Experiência prática com INSS, Procons e litigância bancária
✔ Explicação simples para você (sem "juridiquês")
✔ Alta taxa de identificação de vícios na formação do contrato
✔ Foco total em nulidade — não revisional de juros`,
    palavrasChave: JSON.stringify(["diferencial", "por que escolher", "vantagens", "qualidade"]),
    prioridade: 9,
    ativo: true,
  },
  {
    topico: "Resultados já alcançados (sem prometer)",
    categoria: "prova_social",
    conteudo: `**Resultados reais já alcançados** (sem prometer nada para o seu caso):

• Anulação de contratos por ausência de assinatura válida
• Devolução de valores descontados indevidamente
• Cancelamento de cartões RMC travados por anos
• Identificação de refinanciamentos ocultos
• Reconhecimento judicial de falha na informação e vício de consentimento
• Suspensão de descontos em folha em casos urgentes

**Importante:** Cada caso é único. Esses são exemplos de resultados passados, não garantia de resultado futuro.`,
    palavrasChave: JSON.stringify(["resultados", "casos ganhos", "vitórias", "exemplos"]),
    prioridade: 8,
    ativo: true,
  },
  {
    topico: "Cartões RMC/RCC - Principal fraude",
    categoria: "servicos",
    conteudo: `**Cartões RMC/RCC - A principal fraude dos últimos anos**

RMC (Reserva de Margem Consignável) e RCC (Cartão de Crédito Consignado) são produtos que travam sua margem consignável, impedindo novos empréstimos.

**Problemas comuns:**
• Contratação sem conhecimento do cliente
• Margem travada por anos sem uso
• Impossibilidade de fazer novos empréstimos
• Juros altíssimos em caso de uso
• Dificuldade extrema para cancelar

**O que fazemos:**
Analisamos se houve vício de consentimento, falha na informação ou assinatura inválida para buscar a anulação do contrato e liberação da margem.`,
    palavrasChave: JSON.stringify(["RMC", "RCC", "cartão", "margem travada", "reserva", "fraude"]),
    prioridade: 10,
    ativo: true,
  },
  {
    topico: "Refinanciamentos em cadeia (mata-mata)",
    categoria: "servicos",
    conteudo: `**Refinanciamentos em cadeia - O "mata-mata"**

Muitos clientes são vítimas de refinanciamentos sucessivos sem saber:
• Um empréstimo "quita" o outro
• As parcelas nunca diminuem
• O prazo só aumenta
• Os juros se acumulam
• O cliente perde o controle do que deve

**Como identificamos:**
Analisamos ano a ano seus extratos e contratos para mapear toda a cadeia de refinanciamentos e identificar vícios, falhas de informação e cobranças indevidas.

**Resultado possível:**
Anulação de contratos, devolução em dobro, cancelamento de parcelas futuras.`,
    palavrasChave: JSON.stringify(["refinanciamento", "mata-mata", "parcela não diminui", "quitação", "novo empréstimo"]),
    prioridade: 10,
    ativo: true,
  },
  {
    topico: "Vícios de consentimento e falha na informação",
    categoria: "direitos",
    conteudo: `**Vícios de consentimento - Base para anulação**

Mesmo que você tenha "solicitado" o empréstimo, ele pode ser anulado quando:

• Não explicaram corretamente taxas, parcelas ou condições
• Falta assinatura válida em todas as folhas
• Foi feito por telefone, caixa eletrônico ou link digital
• A assinatura digital não segue as regras da legislação (ICP-Brasil)
• Você não foi informado adequadamente sobre os riscos
• Houve pressão, pressa ou indução ao erro

**Isso pode gerar:**
• Devolução em dobro dos valores indevidos
• Indenização por danos morais (podendo chegar até R$ 15.000 por contrato)
• Cancelamento das parcelas futuras

**Foco do escritório:** Nulidade, não revisional de juros.`,
    palavrasChave: JSON.stringify(["vício", "consentimento", "falha", "informação", "nulidade", "anulação"]),
    prioridade: 10,
    ativo: true,
  },
  {
    topico: "Tipos de empréstimos que revisamos",
    categoria: "servicos",
    conteudo: `**Tipos de empréstimos que o Dr. Juliano revisa:**

✅ Consignados INSS
✅ Consignados de servidores (municipais, estaduais, federais)
✅ Consignados de empresas privadas
✅ RMC / RCC (Reserva de Margem / Cartão Consignado)
✅ Refinanciamentos encadeados
✅ Portabilidades fraudulentas
✅ Margem adicional indevida
✅ Contratos inexistentes (golpes)

**Importante:** Todos os contratos dos últimos 10 anos, mesmo os já quitados, podem ser revisados judicialmente.`,
    palavrasChave: JSON.stringify(["tipos", "quais empréstimos", "consignado", "INSS", "servidor", "RMC", "RCC"]),
    prioridade: 10,
    ativo: true,
  },
  {
    topico: "Tipos que NÃO revisamos",
    categoria: "servicos",
    conteudo: `**Tipos de empréstimos que NÃO revisamos:**

❌ Empréstimos pessoais comuns (CDC não consignado)
❌ Dívidas de cartão de crédito tradicional
❌ Cheque especial
❌ Financiamento de veículos
❌ Financiamento de imóveis
❌ Dívidas empresariais (exceto casos específicos de fraude bancária)

Se o seu caso não se encaixa no que revisamos, vou te orientar da melhor forma possível ou indicar outro profissional se necessário.`,
    palavrasChave: JSON.stringify(["não revisa", "não atende", "veículo", "imóvel", "cartão crédito", "CDC"]),
    prioridade: 9,
    ativo: true,
  },
  {
    topico: "Documentos para consignados INSS - ATUALIZADO",
    categoria: "documentos",
    conteudo: `**Documentos necessários para consignados do INSS:**

📌 Extrato COMPLETO e ATUAL dos empréstimos ativos e encerrados
📌 Comprovantes de recebimento do benefício (últimos 10 anos)
📌 Se tiver mais de um benefício, enviar todos

**Onde baixar:**
Aplicativo ou site Meu INSS

**Precisa de ajuda?**
Se tiver dificuldade para baixar, posso fazer isso para você — mas vou precisar do seu login e senha do Meu INSS / GOV.BR.`,
    palavrasChave: JSON.stringify(["documentos", "INSS", "Meu INSS", "extrato", "benefício"]),
    prioridade: 9,
    ativo: true,
  },
  {
    topico: "Documentos para consignados municipais/estaduais/privados - ATUALIZADO",
    categoria: "documentos",
    conteudo: `**Documentos necessários para consignados de servidores ou empresas privadas:**

📌 Contra-cheques dos últimos 10 anos

**Onde baixar:**
Portal da sua empregadora (prefeitura, estado, empresa)

**Precisa de ajuda?**
Se preferir que eu baixe, vou precisar do login e senha do portal da empregadora.`,
    palavrasChave: JSON.stringify(["documentos", "servidor", "municipal", "estadual", "privado", "contra-cheque", "holerite"]),
    prioridade: 9,
    ativo: true,
  },
  {
    topico: "Documentos para financiamentos bancários - ATUALIZADO",
    categoria: "documentos",
    conteudo: `**Documentos necessários para financiamentos bancários (exceto veículos e imóveis):**

📌 Cópia dos contratos que deseja revisar (últimos 10 anos)
📌 Extratos da conta corrente (últimos 10 anos ou o período disponível)

**Não tem os contratos?**
Sem problema! Me informe:
• Banco
• Agência
• Conta
• Período aproximado dos empréstimos

Vamos solicitar ao banco.`,
    palavrasChave: JSON.stringify(["documentos", "financiamento", "bancário", "contratos", "extratos", "banco"]),
    prioridade: 9,
    ativo: true,
  },
  {
    topico: "Documentos pessoais necessários - ATUALIZADO",
    categoria: "documentos",
    conteudo: `**Além dos documentos específicos do empréstimo, também preciso:**

📌 Login e senha do consumidor.gov.br (GOV.BR) para registrar reclamações
📌 RG ou CNH (foto nítida)
📌 CPF
📌 Comprovante de residência dos últimos 30 dias
📌 Se o comprovante estiver no nome de parente, enviar RG dele também`,
    palavrasChave: JSON.stringify(["documentos pessoais", "RG", "CPF", "CNH", "comprovante", "GOV.BR", "consumidor.gov"]),
    prioridade: 8,
    ativo: true,
  },
  {
    topico: "Custos iniciais - ATUALIZADO",
    categoria: "honorarios",
    conteudo: `**Tem algum custo inicial?**

Não. Você não paga nada para iniciar:
• Análise completa dos documentos
• Reclamações no Procon
• Contatos administrativos com o banco

**Para entrar com a ação:**
✔ Quem recebe até 3 salários mínimos ou está desempregado → ação na Vara Cível com Justiça Gratuita
✔ Quem recebe acima disso, sem necessidade de perícia → Juizado Especial Cível (sem custas)

**Ou seja:** Você não paga nada no começo.`,
    palavrasChave: JSON.stringify(["custo", "quanto custa", "pagar", "gratuito", "grátis", "valor"]),
    prioridade: 10,
    ativo: true,
  },
  {
    topico: "Se perder o processo - ATUALIZADO",
    categoria: "honorarios",
    conteudo: `**Se perder o processo, paga alguma coisa?**

Não.
• No Juizado Especial, não existe condenação em honorários (sucumbência)
• Na Vara Cível, com Justiça Gratuita, você não paga nada ao banco

**Risco zero para você.**

Nem para mim, nem para o banco.`,
    palavrasChave: JSON.stringify(["perder", "risco", "sucumbência", "condenação", "pagar banco"]),
    prioridade: 10,
    ativo: true,
  },
  {
    topico: "Honorários em caso de vitória - ATUALIZADO",
    categoria: "honorarios",
    conteudo: `**E se ganhar a ação, quais são os honorários?**

Os honorários são cobrados somente em caso de vitória, sobre o resultado alcançado:

📌 **35%** do proveito econômico obtido, incluindo:
• Valores devolvidos (geralmente em dobro)
• Valores que você deixar de pagar por anulação de contratos

📌 **45%** de:
• Indenizações por danos morais
• Multas aplicadas ao banco

**(Percentuais dentro do padrão para ações de revisão/consignados no país.)**`,
    palavrasChave: JSON.stringify(["honorários", "ganhar", "vitória", "35%", "45%", "percentual", "quanto pago"]),
    prioridade: 10,
    ativo: true,
  },
  {
    topico: "Prazo de 10 anos para revisar - URGÊNCIA",
    categoria: "conversao",
    conteudo: `**IMPORTANTE: Prazo de 10 anos**

Você pode revisar TODOS os empréstimos consignados dos últimos 10 anos, mesmo os já quitados!

**Mas atenção:**
Depois de 10 anos, você perde o direito de revisar.

Por isso, quanto antes começarmos, melhor.

Já tivemos casos de clientes que conseguiram recuperar valores de contratos quitados há anos, porque identificamos irregularidades que passaram despercebidas na época.`,
    palavrasChave: JSON.stringify(["10 anos", "prazo", "quitado", "antigo", "perder direito", "urgência"]),
    prioridade: 9,
    ativo: true,
  },
  {
    topico: "Link do formulário de atendimento - ATUALIZADO",
    categoria: "atendimento",
    conteudo: `**Para começar a análise:**

Preencha a opção 1 deste formulário:
👉 http://formulario.julianogarbuggio.adv.br/

Em poucos minutos o Dr. Juliano recebe tudo, analisa seu caso e te retorna com os próximos passos.`,
    palavrasChave: JSON.stringify(["formulário", "link", "começar", "iniciar", "cadastro"]),
    prioridade: 9,
    ativo: true,
  },
];

async function seed() {
  console.log("🌱 Adicionando base de conhecimento COMPLETA...");
  
  for (const conhecimento of conhecimentos) {
    try {
      await db.insert(aiKnowledge).values(conhecimento);
      console.log(`✅ Adicionado: ${conhecimento.topico}`);
    } catch (error) {
      console.log(`⚠️ Já existe ou erro: ${conhecimento.topico}`);
    }
  }
  
  console.log("✅ Base de conhecimento COMPLETA adicionada!");
  process.exit(0);
}

seed();
