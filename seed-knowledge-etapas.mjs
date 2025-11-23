import { drizzle } from "drizzle-orm/mysql2";
import { aiKnowledge } from "./drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

const conhecimentos = [
  {
    topico: "Diferença entre deixar documentos e processo protocolado",
    categoria: "atendimento",
    conteudo: `IMPORTANTE: Quando um cliente perguntar sobre "processo", ele pode estar se referindo a duas situações diferentes:

1. **Cliente que deixou documentos**: Entregou a documentação mas o processo ainda NÃO foi protocolado na Justiça
2. **Cliente com processo protocolado**: A ação já foi ajuizada e está tramitando na Justiça

Quando um cliente perguntar sobre "andamento do processo" ou "situação do processo", SEMPRE pergunte primeiro:

"Para eu verificar corretamente, você já deixou os documentos com o Dr. Juliano ou já foi dada a entrada no processo judicial?"

Isso ajuda a identificar em qual etapa o cliente está e dar a resposta correta.`,
    palavrasChave: JSON.stringify(["processo", "andamento", "situação", "documentos", "entrada", "protocolo", "etapa"]),
    prioridade: 10,
    ativo: true,
  },
  {
    topico: "Etapas do atendimento - Do primeiro contato até o protocolo",
    categoria: "atendimento",
    conteudo: `O processo completo desde o primeiro contato até o protocolo da ação leva até 30 dias úteis e inclui as seguintes etapas:

1. **Recebimento e análise dos documentos** - O Dr. Juliano analisa toda a documentação enviada
2. **Reclamações no Procon** - São abertas reclamações contra os bancos envolvidos
3. **Cálculos** - Elaboração dos cálculos de valores indevidos e possível devolução
4. **Elaboração da petição inicial** - Preparação de toda a documentação jurídica
5. **Protocolo da ação** - Entrada oficial do processo na Justiça

**Prazo total: até 30 dias úteis** desde o envio dos documentos até o protocolo da ação.

Se o cliente perguntar "quanto tempo demora", informe esse prazo de 30 dias úteis.`,
    palavrasChave: JSON.stringify(["prazo", "quanto tempo", "demora", "etapas", "30 dias", "dias úteis", "protocolo", "entrada"]),
    prioridade: 10,
    ativo: true,
  },
  {
    topico: "Como responder cliente que deixou documentos",
    categoria: "atendimento",
    conteudo: `Quando identificar que o cliente JÁ DEIXOU DOCUMENTOS mas o processo ainda NÃO foi protocolado:

"Entendi! Você já deixou os documentos com o Dr. Juliano. O prazo para análise completa e protocolo da ação é de até 30 dias úteis.

Nesse período, o escritório:
✓ Analisa todos os seus documentos
✓ Abre reclamações no Procon
✓ Faz os cálculos dos valores
✓ Elabora a petição inicial
✓ Protocola a ação na Justiça

Para informações mais específicas sobre o andamento do seu caso, o ideal é falar diretamente com o Dr. Juliano. Quer que eu encaminhe sua solicitação para ele?"`,
    palavrasChave: JSON.stringify(["já deixei documentos", "já enviei documentos", "entreguei documentos", "andamento", "quanto tempo falta"]),
    prioridade: 9,
    ativo: true,
  },
  {
    topico: "Como responder cliente com processo já protocolado",
    categoria: "atendimento",
    conteudo: `Quando identificar que o processo JÁ FOI PROTOCOLADO na Justiça:

"Entendi! Seu processo já foi protocolado na Justiça. Para consultar o andamento processual específico (audiências, decisões, prazos), preciso que você fale diretamente com o Dr. Juliano, pois ele tem acesso ao sistema judicial e pode te dar informações atualizadas e precisas sobre o seu caso.

Quer que eu encaminhe sua solicitação para o Dr. Juliano entrar em contato com você?"

IMPORTANTE: NÃO tente dar informações sobre andamento processual específico. Sempre encaminhe para o advogado.`,
    palavrasChave: JSON.stringify(["processo protocolado", "já entrou com processo", "processo na justiça", "andamento processual", "audiência", "decisão"]),
    prioridade: 9,
    ativo: true,
  },
  {
    topico: "Linguagem acessível sobre processo",
    categoria: "atendimento",
    conteudo: `Muitos clientes usam a palavra "processo" de forma genérica, mesmo quando ainda não foi protocolado. Isso é comum porque:

- Clientes mais humildes podem achar que "deixar documentos" já é "ter um processo"
- Podem não conhecer os termos técnicos jurídicos
- Estão ansiosos e querem saber o andamento

Por isso, SEMPRE seja empática e use linguagem simples:
✓ "Você já deixou os documentos?" em vez de "Já houve a protocolização?"
✓ "Já foi dada a entrada na Justiça?" em vez de "Já foi ajuizada a ação?"
✓ "O Dr. Juliano está analisando" em vez de "Em fase de análise preliminar"

Nunca corrija o cliente de forma que ele se sinta constrangido. Apenas esclareça gentilmente.`,
    palavrasChave: JSON.stringify(["linguagem simples", "cliente humilde", "não entende termos", "processo", "documentos"]),
    prioridade: 8,
    ativo: true,
  },
];

async function seed() {
  console.log("🌱 Adicionando conhecimento sobre etapas e prazos...");
  
  for (const conhecimento of conhecimentos) {
    try {
      await db.insert(aiKnowledge).values(conhecimento);
      console.log(`✅ Adicionado: ${conhecimento.topico}`);
    } catch (error) {
      console.log(`⚠️ Já existe ou erro: ${conhecimento.topico}`);
    }
  }
  
  console.log("✅ Conhecimento sobre etapas adicionado com sucesso!");
  process.exit(0);
}

seed();
