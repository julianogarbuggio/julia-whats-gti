import { drizzle } from "drizzle-orm/mysql2";
import { aiKnowledge } from "./drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

const conhecimentos = [
  {
    topico: "Assinatura digital da procuração - Conveniência e segurança",
    categoria: "atendimento_digital",
    conteudo: `A assinatura da procuração é feita de forma **100% digital e segura**! 📱

**Como funciona:**
• Você recebe o documento por e-mail ou WhatsApp
• Assina digitalmente pelo celular ou computador
• Tudo validado com certificação digital
• Mesma validade jurídica da assinatura presencial

**Vantagens:**
✅ Sem precisar ir ao escritório
✅ Assina de onde estiver, no seu tempo
✅ Processo rápido e prático
✅ Totalmente seguro e dentro da lei

É tudo pensado para o seu conforto, sem abrir mão da segurança! O Dr. Juliano utiliza plataformas certificadas que garantem a autenticidade da assinatura.`,
    palavrasChave: JSON.stringify(["procuração", "assinatura", "assinar", "digital", "online", "presencial", "escritório"]),
    prioridade: 9,
    ativo: true,
  },
  {
    topico: "Atendimento 100% online - Comodidade total",
    categoria: "atendimento_digital",
    conteudo: `Todo o atendimento é feito **100% online** para o seu conforto! 🏠💻

**O que você NÃO precisa fazer:**
❌ Ir ao escritório
❌ Enfrentar trânsito ou filas
❌ Tirar tempo do trabalho
❌ Gastar com deslocamento

**O que você FAZ:**
✅ Envia documentos por WhatsApp ou e-mail
✅ Assina procuração digitalmente
✅ Acompanha tudo pelo celular
✅ Recebe atualizações em tempo real

É tudo pensado para facilitar sua vida! Você cuida do seu caso sem sair de casa, com toda a segurança e profissionalismo que merece.`,
    palavrasChave: JSON.stringify(["online", "presencial", "ir ao escritório", "atendimento", "como funciona", "preciso ir"]),
    prioridade: 9,
    ativo: true,
  },
  {
    topico: "Segurança e uso dos dados e senhas",
    categoria: "seguranca",
    conteudo: `**Seus dados e senhas estão seguros! 🔒**

Quando você nos fornece login e senha (Meu INSS, GOV.BR, site da empregadora), saiba que:

✅ **Uso exclusivo para o processo**
• Utilizamos APENAS para baixar documentos necessários
• Não fazemos nenhuma outra operação
• Não compartilhamos com terceiros

✅ **Armazenamento seguro**
• Dados criptografados
• Acesso restrito apenas ao Dr. Juliano
• Seguimos a LGPD (Lei Geral de Proteção de Dados)

✅ **Recomendação importante**
• Após o protocolo da ação, recomendamos que você **troque suas senhas**
• É uma medida de segurança adicional
• Vamos te avisar quando for o momento ideal

Sua segurança é nossa prioridade! Trabalhamos com total transparência e responsabilidade.`,
    palavrasChave: JSON.stringify(["senha", "dados", "segurança", "login", "seguro", "confiável", "LGPD", "privacidade"]),
    prioridade: 10,
    ativo: true,
  },
  {
    topico: "Recomendação de troca de senhas após protocolo",
    categoria: "seguranca",
    conteudo: `**Importante: Troca de senhas após o protocolo** 🔐

Após protocolarmos sua ação na Justiça, **recomendamos fortemente** que você troque as senhas que nos forneceu:

📱 **Senhas para trocar:**
• Meu INSS / GOV.BR
• Site da empregadora (se forneceu)
• Consumidor.gov.br

⏰ **Quando trocar:**
• Vamos te avisar assim que a ação for protocolada
• Geralmente entre 30-45 dias após envio dos documentos

🛡️ **Por que trocar:**
• Medida adicional de segurança
• Boa prática de proteção de dados
• Sua tranquilidade em primeiro lugar

Não se preocupe - vamos te lembrar quando chegar o momento! E se precisarmos acessar novamente algo (muito raro), pedimos a nova senha.`,
    palavrasChave: JSON.stringify(["trocar senha", "mudar senha", "segurança", "depois", "protocolo", "ação protocolada"]),
    prioridade: 8,
    ativo: true,
  },
  {
    topico: "Tecnologia a favor do cliente",
    categoria: "atendimento_digital",
    conteudo: `O escritório do Dr. Juliano usa **tecnologia de ponta** para te atender melhor! 🚀

**Ferramentas que usamos:**
• WhatsApp para comunicação rápida
• Assinatura digital certificada
• Plataformas seguras de documentos
• Sistema de acompanhamento processual
• Inteligência artificial (eu, Jul.IA!) para atendimento 24/7

**Resultado:**
✅ Atendimento mais rápido
✅ Maior comodidade para você
✅ Processos mais eficientes
✅ Segurança garantida

Tudo isso sem perder o toque humano! Quando você precisar falar diretamente com o Dr. Juliano, ele está disponível. A tecnologia está aqui para facilitar, não para substituir o atendimento pessoal.`,
    palavrasChave: JSON.stringify(["tecnologia", "moderno", "inovação", "digital", "automação", "IA"]),
    prioridade: 7,
    ativo: true,
  },
];

async function seed() {
  console.log("🌱 Adicionando conhecimento sobre segurança digital...");
  
  for (const conhecimento of conhecimentos) {
    try {
      await db.insert(aiKnowledge).values(conhecimento);
      console.log(`✅ Adicionado: ${conhecimento.topico}`);
    } catch (error) {
      console.log(`⚠️ Já existe ou erro: ${conhecimento.topico}`);
    }
  }
  
  console.log("✅ Conhecimento sobre segurança digital adicionado!");
  process.exit(0);
}

seed();
