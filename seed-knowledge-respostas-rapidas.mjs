import { drizzle } from "drizzle-orm/mysql2";
import { aiKnowledge } from "./drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

const conhecimentos = [
  {
    topico: "Resposta rápida - Quanto tempo demora o processo",
    categoria: "respostas_rapidas",
    conteudo: `**Quanto tempo demora um processo de revisão?**

O tempo varia bastante, mas vou te dar uma ideia:

⏱️ **Fase administrativa (antes da ação):**
• Análise dos documentos: 24-72 horas
• Reclamação no Procon: 15-30 dias
• Resposta do banco: 10 dias úteis

⚖️ **Fase judicial (depois de entrar com ação):**
• Depende muito do juiz e da comarca
• Alguns casos: 6 meses a 1 ano
• Outros casos: 1 a 2 anos
• Casos urgentes: possível liminar em dias

**Importante:** O Dr. Juliano sempre busca resolver da forma mais rápida possível, mas o tempo final depende do Judiciário.`,
    palavrasChave: JSON.stringify(["quanto tempo", "demora", "prazo", "duração", "quando sai"]),
    prioridade: 10,
    ativo: true,
  },
  {
    topico: "Resposta rápida - Posso fazer empréstimo durante o processo",
    categoria: "respostas_rapidas",
    conteudo: `**Posso fazer novo empréstimo enquanto o processo está correndo?**

Depende da sua margem disponível:

✅ **Se sua margem estiver livre:**
Sim, pode fazer novos empréstimos normalmente. O processo não impede.

⚠️ **Se sua margem estiver travada:**
Não consegue até resolver a situação. Por isso é importante anular contratos irregulares - para liberar sua margem.

💡 **Dica importante:**
Se você está com dificuldade financeira e precisa de empréstimo urgente, avise o Dr. Juliano. Em alguns casos é possível pedir liminar para suspender descontos e liberar margem mais rápido.`,
    palavrasChave: JSON.stringify(["novo empréstimo", "posso fazer", "durante processo", "margem", "consignado novo"]),
    prioridade: 9,
    ativo: true,
  },
  {
    topico: "Resposta rápida - O que acontece se o banco me ligar",
    categoria: "respostas_rapidas",
    conteudo: `**O banco ligou oferecendo acordo. O que faço?**

⚠️ **CUIDADO!** Bancos costumam ligar tentando fazer você:
• Assumir que conhecia o contrato
• Aceitar acordo desvantajoso
• Desistir da ação

✅ **O que você DEVE fazer:**
1. Seja educado, mas NÃO assuma nada
2. Diga: "Quero apenas os extratos e contratos dos últimos 10 anos"
3. Diga: "Quero cancelamento de contratos irregulares e devolução em dobro"
4. Se insistirem, passe o contato do Dr. Juliano: (11) 95675-9223

❌ **O que você NÃO deve fazer:**
• Não aceite acordo sem falar com o Dr. Juliano
• Não assine nada
• Não confirme que "sabia do empréstimo"
• Não dê novas senhas ou dados

**Qualquer dúvida, me avise imediatamente!**`,
    palavrasChave: JSON.stringify(["banco ligou", "ligação", "acordo", "proposta", "contato banco"]),
    prioridade: 10,
    ativo: true,
  },
  {
    topico: "Resposta rápida - Preciso ir ao escritório",
    categoria: "respostas_rapidas",
    conteudo: `**Preciso ir ao escritório presencialmente?**

Não! 🏠

**Tudo é 100% online:**
✅ Envio de documentos: WhatsApp ou e-mail
✅ Assinatura da procuração: digital (pelo celular)
✅ Acompanhamento: WhatsApp e e-mail
✅ Reuniões (se necessário): videochamada

**Vantagens:**
• Você economiza tempo e dinheiro
• Não precisa enfrentar trânsito
• Atendimento para todo o Brasil
• Mesma qualidade (ou superior) ao presencial

O Dr. Juliano atende clientes de todo o Brasil sem necessidade de encontro presencial!`,
    palavrasChave: JSON.stringify(["presencial", "ir ao escritório", "preciso ir", "encontro", "reunião"]),
    prioridade: 9,
    ativo: true,
  },
  {
    topico: "Resposta rápida - Como envio os documentos",
    categoria: "respostas_rapidas",
    conteudo: `**Como envio os documentos?**

Super fácil! Você tem 3 opções:

📱 **Opção 1 - WhatsApp (mais rápido)**
Mande os documentos aqui mesmo neste chat. Pode ser:
• Fotos
• PDFs
• Prints de tela

📧 **Opção 2 - E-mail**
juliano@garbuggio.com.br

🌐 **Opção 3 - Formulário**
http://formulario.julianogarbuggio.adv.br/

**Precisa de ajuda para baixar?**
Se tiver dificuldade para baixar extratos do Meu INSS ou portal da empregadora, posso fazer isso para você. Só preciso do login e senha.

**Fique tranquilo:** Seus dados são seguros e usados apenas para o processo!`,
    palavrasChave: JSON.stringify(["como envio", "enviar documentos", "mandar", "onde mando"]),
    prioridade: 10,
    ativo: true,
  },
  {
    topico: "Resposta rápida - Meu caso tem chance",
    categoria: "respostas_rapidas",
    conteudo: `**Meu caso tem chance de ganhar?**

Essa é a pergunta que todo mundo faz! 😊

**A resposta honesta:**
Só consigo te dizer depois que o Dr. Juliano analisar seus documentos.

**Mas posso te adiantar:**
📊 Cerca de 70% dos casos analisados apresentam alguma irregularidade
🎯 Cartões RMC/RCC: 85% têm vícios
📈 Refinanciamentos em cadeia: 90% apresentam falhas

**Sinais positivos (não é garantia):**
✅ Você não lembra de ter contratado
✅ Parcelas que nunca diminuem
✅ Margem travada por cartão RMC
✅ Contrato digital sem certificação
✅ Não te explicaram direito na hora

**Próximo passo:**
Vamos organizar seus documentos e o Dr. Juliano faz uma análise profunda. Aí sim ele consegue te dizer com mais precisão!`,
    palavrasChave: JSON.stringify(["tem chance", "vou ganhar", "possibilidade", "vale a pena", "acha que"]),
    prioridade: 10,
    ativo: true,
  },
];

async function seed() {
  console.log("🌱 Adicionando respostas rápidas personalizadas...");
  
  for (const conhecimento of conhecimentos) {
    try {
      await db.insert(aiKnowledge).values(conhecimento);
      console.log(`✅ Adicionado: ${conhecimento.topico}`);
    } catch (error) {
      console.log(`⚠️ Já existe ou erro: ${conhecimento.topico}`);
    }
  }
  
  console.log("✅ Respostas rápidas adicionadas!");
  process.exit(0);
}

seed();
