/**
 * Toques humanos para a Jul.IA
 * Saudações contextuais, aniversários e reconhecimento de retorno
 */

/**
 * Retorna saudação contextual baseada no horário
 */
export function getSaudacaoContextual(): string {
  const hora = new Date().getHours();
  
  if (hora >= 5 && hora < 12) {
    return "Bom dia";
  } else if (hora >= 12 && hora < 18) {
    return "Boa tarde";
  } else {
    return "Boa noite";
  }
}

/**
 * Verifica se hoje é aniversário do cliente
 */
export function isAniversarioHoje(dataNascimento: Date | null): boolean {
  if (!dataNascimento) return false;
  
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  
  return (
    hoje.getDate() === nascimento.getDate() &&
    hoje.getMonth() === nascimento.getMonth()
  );
}

/**
 * Gera mensagem de aniversário personalizada
 */
export function getMensagemAniversario(nome: string): string {
  return `🎉 *Parabéns pelo seu aniversário, ${nome}!* 🎂\n\nEspero que esteja sendo um dia muito especial! Que venha cheio de saúde, alegrias e realizações! 🎈✨`;
}

/**
 * Gera saudação personalizada para cliente que retorna
 */
export function getSaudacaoRetorno(nome: string, primeiraVez: boolean): string {
  const saudacao = getSaudacaoContextual();
  
  if (primeiraVez) {
    return `${saudacao}! 👋`;
  } else {
    return `${saudacao}, ${nome}! Que bom te ver de novo! 😊`;
  }
}

/**
 * Insights humanos - frases que mostram atenção
 */
export const INSIGHTS_HUMANOS = [
  "Entendo perfeitamente sua preocupação.",
  "Sei que essa situação pode ser estressante.",
  "Você está fazendo a coisa certa ao buscar seus direitos.",
  "Muitos clientes já passaram por isso e conseguimos ajudar.",
  "Fico feliz que tenha entrado em contato!",
  "Vamos resolver isso juntos, pode ficar tranquilo(a).",
  "Sua situação é mais comum do que imagina.",
  "É normal se sentir confuso(a) com tanta informação.",
];

/**
 * Gera contexto de saudação completo para o prompt
 */
export function gerarContextoSaudacao(
  nome: string | null,
  dataNascimento: Date | null,
  primeiraVez: boolean
): string {
  let contexto = "";
  
  // Verifica aniversário
  if (dataNascimento && isAniversarioHoje(dataNascimento) && nome) {
    contexto += `\n\n**IMPORTANTE: HOJE É O ANIVERSÁRIO DO CLIENTE!**\nComece a conversa com: ${getMensagemAniversario(nome)}\n\n`;
    return contexto;
  }
  
  // Saudação normal
  if (nome && !primeiraVez) {
    contexto += `\n**Cliente que retorna:** Use "${getSaudacaoRetorno(nome, false)}" no início da mensagem. Depois pergunte: "Como você tá?" ou "Tudo bem?"\n`;
  } else {
    contexto += `\n**Primeira conversa:** Use "${getSaudacaoContextual()}!" no início.

⚠️ **AVISO OBRIGATÓRIO NA PRIMEIRA MENSAGEM:**
Logo após a saudação, SEMPRE inclua este aviso:

"⚠️ Estou em fase de aprendizado e posso cometer erros ou dar respostas que não fazem sentido.

Se em algum momento você perceber que:
- Estou repetindo mensagens
- Minhas respostas não fazem nexo
- Não estou entendendo seu caso

É só escrever: \"ATENDIMENTO HUMANO\"

Que eu aviso o Dr. Juliano para assumir imediatamente! 🙋‍♂️"

Depois pergunte: "Tudo bem com você?" ou "Como foi seu dia?" para criar conexão humana. Use "você" (gênero neutro) até a pessoa falar o nome dela. NUNCA use "Lid" ou "Lead".\n`;
  }
  
  return contexto;
}
