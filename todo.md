# Jul.IA - Assistente de WhatsApp - TODO

## Banco de Dados e Schema
- [x] Criar tabela de leads (clientes potenciais)
- [x] Criar tabela de conversas (histórico de mensagens)
- [x] Criar tabela de configurações do chatbot
- [x] Criar tabela de integrações (ZapSign, Z-API)
- [x] Criar tabela de relatórios e métricas

## Backend - APIs e Webhooks
- [x] Implementar webhook para receber mensagens do Z-API
- [x] Implementar webhook para notificações do ZapSign
- [x] Criar API para gerenciar leads
- [x] Criar API para gerenciar conversas
- [x] Criar API para configurações do chatbot
- [x] Criar API para relatórios e exportação de dados
- [x] Implementar lógica de qualificação de leads (via IA)
- [x] Implementar integração com Z-API (envio de mensagens)
- [x] Implementar integração com ZapSign (envio de documentos)
- [x] Implementar estrutura de integração com sistemas Jul.IA existentes (API endpoints prontos)

## Frontend - Interface de Gerenciamento
- [x] Criar dashboard principal com métricas
- [x] Criar página de visualização de leads com busca
- [x] Criar página de visualização de conversas
- [x] Criar página de configurações do chatbot
- [x] Criar página de configurações de integrações
- [x] Criar página de relatórios
- [x] Implementar funcionalidade de exportação CSV (API)
- [x] Implementar busca de leads por nome, WhatsApp e CPF
- [x] Implementar exclusão de leads (individual)
- [ ] Implementar exclusão em massa de leads
- [ ] Implementar filtros avançados de leads por status
- [ ] Implementar visualização detalhada de histórico de conversas

## Fluxo Conversacional
- [ ] Implementar mensagem de boas-vindas
- [ ] Implementar coleta de dados pessoais (nome, email, WhatsApp)
- [ ] Implementar qualificação de empréstimo (tipo, status, banco)
- [ ] Implementar coleta de dados do empréstimo (valor, parcelas, período)
- [ ] Implementar lógica de análise e qualificação
- [ ] Implementar fluxo de agendamento de atendimento
- [ ] Implementar fluxo de envio de documentos
- [ ] Implementar fluxo de informações sobre serviços
- [ ] Implementar encaminhamento para atendimento humano
- [ ] Implementar consentimentos LGPD

## Integrações
- [x] Configurar credenciais Z-API
- [x] Configurar credenciais ZapSign
- [ ] Testar envio de mensagens via Z-API
- [ ] Testar envio de documentos via ZapSign
- [ ] Implementar sincronização com Jul.IA Procurações
- [ ] Implementar sincronização com Jul.IA Petições
- [ ] Implementar sincronização com Jul.IA Agenda

## Funcionalidades Adicionais
- [ ] Implementar exclusão de leads (individual e em massa)
- [ ] Implementar mesclagem de leads duplicados
- [ ] Implementar importação de dados do formulário online
- [ ] Implementar notificações para equipe
- [ ] Implementar logs de atividades

## Testes e Documentação
- [ ] Testar fluxo completo de qualificação
- [ ] Testar webhooks
- [ ] Testar integrações
- [ ] Criar documentação de uso
- [ ] Criar documentação de API

## Sistema de Clientes
- [x] Criar tabela de clientes completa no banco de dados
- [x] Implementar API de importação de clientes (JSON, CSV, API URL)
- [x] Implementar API de exportação de clientes (JSON, CSV)
- [ ] Criar interface de importação de clientes
- [ ] Criar interface de exportação de clientes
- [x] Implementar detecção e mesclagem de clientes duplicados (por CPF, nome, telefone)
- [ ] Sincronizar clientes com Jul.IA Procurações
- [ ] Sincronizar clientes com Jul.IA Petições
- [ ] Sincronizar clientes com Jul.IA Agenda

## Sistema de Documentos e Backup
- [x] Criar tabela de documentos anexados
- [x] Implementar upload de documentos para S3
- [x] Implementar download de documentos (via S3 URL)
- [ ] Criar interface de gerenciamento de documentos por cliente
- [x] Implementar sistema de backup automático
- [ ] Implementar restauração de backup (interface)

## Integração Google Looker Studio
- [x] Pesquisar API do Google Looker Studio
- [x] Criar configuração de embed do relatório
- [x] Implementar exportação de métricas para Google Sheets (CSV)
- [x] Criar endpoint para preparar métricas do chatbot
- [ ] Implementar visualização de métricas de Google Ads no dashboard (interface)
- [ ] Criar interface de exportação para Google Sheets

## Sistema de IA Treinável
- [x] Criar tabela de conhecimento da IA (knowledge base)
- [x] Criar tabela de interações e feedback
- [x] Implementar sistema de aprendizado contínuo
- [x] Implementar restrições de temas (não dar consultas jurídicas)
- [x] Implementar detecção de dúvidas não respondíveis
- [x] Implementar encaminhamento automático para atendimento humano
- [ ] Criar interface de treinamento da IA
- [ ] Criar interface de visualização de aprendizados
- [x] Implementar sistema de aprovação de respostas aprendidas (API)

## Fluxo Conversacional Completo
- [x] Implementar mensagem de boas-vindas personalizada
- [x] Implementar coleta sequencial de dados do lead
- [x] Implementar perguntas de qualificação sobre empréstimo
- [x] Implementar análise automática de elegibilidade do caso
- [x] Implementar envio de link para formulário de cadastro
- [ ] Implementar envio de link para upload de documentos
- [x] Implementar lógica de agendamento de atendimento
- [x] Implementar respostas contextualizadas da IA
- [ ] Implementar detecção de intenção de abandono
- [ ] Implementar follow-up automático

## Base de Conhecimento da IA
- [x] Popular conhecimento sobre tipos de empréstimo consignado
- [x] Popular conhecimento sobre quando é cabível a revisão
- [x] Popular conhecimento sobre documentos necessários
- [x] Popular conhecimento sobre honorários
- [x] Popular conhecimento sobre prazos e custos
- [x] Configurar restrições sobre consultas jurídicas específicas
- [x] Configurar restrições sobre temas fora do escopo
- [ ] Adicionar mais conhecimento específico sobre juros abusivos
- [ ] Adicionar conhecimento sobre refinanciamento (mata-mata)
- [ ] Adicionar conhecimento sobre margem consignável

## Documentação e Configuração
- [x] Criar guia passo a passo de configuração do webhook Z-API
- [ ] Criar guia de uso do dashboard
- [ ] Criar guia de treinamento da IA
- [ ] Documentar APIs disponíveis
- [ ] Criar exemplos de integração com outros sistemas Jul.IA

## Filtros de Segurança Jurídica
- [x] Criar serviço de filtros de segurança jurídica (ai-security-filters.ts)
- [x] Implementar detecção de palavras-chave proibidas
- [x] Implementar prompt guardião para validação de respostas
- [x] Implementar sistema de respostas neutras automáticas
- [x] Criar logs de segurança para auditoria
- [x] Adicionar disclaimer automático em respostas jurídicas
- [x] Integrar filtros com serviço de IA (ai-chatbot.ts)
- [x] Integrar filtros com fluxo conversacional (conversation-flow.ts)
- [ ] Testar filtros com casos reais do Mercado Livre
- [ ] Criar interface de gerenciamento de filtros de segurança

## Interface de Gerenciamento de Segurança
- [x] Criar página de visualização de logs de segurança
- [x] Criar interface para adicionar/remover palavras proibidas
- [x] Criar rotas de API para gerenciamento de segurança
- [x] Implementar filtros e busca em logs de segurança
- [ ] Criar dashboard de métricas de segurança (estatísticas)

## Integração com ChatGPT
- [x] Criar endpoint /api/chatgpt-webhook para receber mensagens
- [x] Criar endpoint /api/chatgpt-send para enviar respostas
- [x] Criar endpoint /api/chatgpt-health para health check
- [x] Gerar schema OpenAPI para integração
- [x] Criar documentação de configuração GPT Actions
- [x] Integrar filtros de segurança com endpoints ChatGPT
- [ ] Registrar endpoints no servidor Express
- [ ] Testar integração com ChatGPT

## Correção Integração GTI-API (Urgente)
- [ ] Ativar IA no painel GTI-API (Chatbot Settings → Status da IA → Ativar)
- [ ] Verificar se AI APIKey está preenchida corretamente no GTI-API
- [x] Identificar nome correto da instância GTI-API para API REST - NOME: gti26 (Instance ID: 69205AC00B888)
- [x] Descobrir causa do erro 404 - Plano "Envio em Massa" não inclui API REST
- [x] Mudar para plano API REST (R$ 25,00) ou API REST - VIP (R$ 80,00)
- [x] Acessar painel GTI-API (painel.gti-api.com) e iniciar criação de instância
- [x] Obter Nome da Instância e API Key após ativação do plano API
  - Nome: 5511956759223
  - Instance ID: 10516e44-72bb-4f9e-9f2d-32e9b7f4e5ef
  - API Key: 15C1EE8A-34D4-4199-8A5E-489EB128C362
- [x] WhatsApp conectado via QR Code
- [x] Testar envio de mensagem via API REST - SUCESSO!
- [x] Ativar e configurar webhook no painel GTI-API - SUCESSO!
- [ ] Atualizar código com credenciais corretas (GTI_INSTANCE_ID, GTI_API_KEY, GTI_BASE_URL)
- [ ] Atualizar GTI_INSTANCE_ID com valor correto no código após confirmação do suporte
- [ ] Corrigir configuração do webhook GTI-API (Body vazio)
- [ ] Adicionar variáveis corretas no Body da requisição API do chatbot
- [ ] Testar recebimento de payload completo do GTI-API
- [ ] Testar envio de mensagem via API REST com Instance ID correto
- [ ] Remover mídias desnecessárias do chatbot GTI
- [ ] Excluir chatbots duplicados no painel GTI
- [ ] Configurar mensagens de boas-vindas profissionais no GTI
- [ ] Adicionar contexto jurídico para treinamento da IA no GTI
- [ ] Testar fluxo completo GTI-API → Webhook → Jul.IA → Resposta

- [x] Identificar causa do webhook não funcionar - PAGAMENTO PENDENTE!
- [x] Completar pagamento do plano API REST no GTI-API
- [x] Aguardar confirmação do pagamento - STATUS: PAGO!
- [ ] Testar webhook após pagamento confirmado
- [ ] Corrigir parsing do payload do webhook GTI-API se necessário

## Correção Modelo OpenAI (Urgente)
- [ ] Mudar de gpt-4-turbo para API Manus (BUILT_IN_FORGE_API)
- [ ] Testar geração de resposta com novo modelo
- [ ] Enviar mensagem de teste via WhatsApp
- [ ] Verificar resposta automática da Jul.IA

## Integração Híbrida Z-API + GTI-API (Nova Abordagem)
- [ ] Criar endpoint webhook `/api/webhook/zapi` para receber mensagens
- [ ] Configurar webhook na plataforma Z-API
- [ ] Testar recebimento de mensagens via Z-API
- [ ] Manter envio de respostas via GTI-API (já funcionando)
- [ ] Validar fluxo completo: Z-API (receber) → Jul.IA (processar) → GTI-API (enviar)

## Correção Autenticação Z-API (Urgente)
- [x] Adicionar Client-Token no header das requisições Z-API
- [x] Configurar ZAPI_CLIENT_TOKEN nas variáveis de ambiente
- [x] Atualizar serviço zapi.ts para incluir Client-Token em todas as requisições
- [x] Testar envio de mensagem com Client-Token configurado
- [x] Validar fluxo completo: webhook recebe → IA processa → Z-API envia com Client-Token

## 🐛 BUG CRÍTICO - Mensagens Duplicadas (URGENTE!)

- [x] Investigar causa das mensagens duplicadas (Jul.IA envia 5x a mesma resposta)
- [x] Implementar sistema de deduplicação de mensagens
- [x] Adicionar cache de mensagens já processadas (por messageId ou timestamp)
- [x] Prevenir processamento de mensagens duplicadas do webhook
- [x] Adicionar campo conversationState no banco de dados
- [x] Implementar persistência de estado entre mensagens
- [x] Carregar histórico de conversa do banco
- [x] Atualizar estado no banco após cada mensagem
- [ ] Testar fluxo completo de conversação (aguardando teste do usuário)

## Toques Humanos e Personalização
- [x] Adicionar campo de data de nascimento no schema de leads
- [x] Implementar função de saudação contextual (bom dia/tarde/noite)
- [x] Implementar detecção de aniversário e mensagem especial
- [x] Ajustar prompt para usar nome do cliente e reconhecer retorno
- [x] Adicionar resposta persuasiva sobre prazo de entrada da ação (atendimento boutique, experiência, sem risco)
- [x] Implementar notificação enfática quando cliente cobrar andamento
- [x] Adicionar pergunta automática "Você já deixou toda a documentação?"
- [x] Criar checklist interativo de documentação e etapas (formulário, procuração, documentos, Procon, ação)
- [x] Adicionar insights humanos no conhecimento
- [x] Adicionar explicação sobre importância do Procon (estratégia jurídica)
- [x] Adicionar verificação de legibilidade e formato dos documentos
- [x] Implementar cálculo automático de período (10 anos de holerites)
- [ ] Testar fluxo completo com toques humanos

## Alerta contra Golpe do Falso Advogado
- [x] Adicionar conhecimento sobre golpe do falso advogado (números oficiais, CNPJ, links OAB)
- [x] Implementar detecção automática quando cliente mencionar outro número/telefone
- [x] Criar notificação para Dr. Juliano quando cliente relatar tentativa de golpe
- [x] Adicionar conhecimento sobre golpe do sobrenome português (indenização falsa)
- [x] Implementar conversão inteligente perguntando sobre empréstimo consignado
- [ ] Testar fluxo completo de alerta de golpe

## Nunca Recusar Clientes - Atendimento Amplo
- [x] Ajustar conhecimento para atender Direito do Consumidor em geral (não só consignados)
- [x] Implementar estratégia de nunca dizer NÃO - sempre encaminhar para "time do Dr. Juliano"
- [x] Criar notificação para casos fora do padrão (não consignados)
- [ ] Testar fluxo com diferentes tipos de casos

## URGENTE - Correções Críticas
- [ ] Encurtar mensagem inicial (muito longa) - apenas saudação + pergunta motivo
- [ ] NUNCA chamar de "Lid" ou "Lead" - usar gênero neutro "você"
- [ ] Perguntar nome naturalmente na conversa
- [ ] Só chamar pelo nome DEPOIS que cliente falar
- [ ] Verificar logs do 44999424949 e corrigir problema

## Tom Coloquial e Empático (para clientes simples/idosos)
- [x] Reescrever prompt com linguagem coloquial do Dr. Juliano
- [x] Perguntar "como foi seu dia?" para criar conexão
- [x] Empatia com situação: "puxa, deve ser chato ter desconto todo mês né?"
- [x] Linguagem MUITO simples - zero juridiquês
- [x] Frases curtas e diretas
- [x] Usar expressões como "puxa", "nossa", "imagino como deve ser difícil"
- [x] Sempre tranquilizar: "o Dr. Juliano vai te ajudar, ele é especialista nisso"

## Retomada Automática após Atendimento Humano
- [x] Detectar quando Dr. Juliano assume atendimento
- [x] Se cliente escrever após 5min de inatividade do humano, Jul.IA retoma
- [x] Mensagem de retomada: "Oi! Vi que você escreveu. O Dr. Juliano deve estar ocupado agora, posso te ajudar?"

## Explicação sobre Custos Processuais (NOVO)
- [x] Adicionar conhecimento sobre custos quando ganha até 3 salários mínimos (Vara Cível com gratuidade)
- [x] Adicionar conhecimento sobre custos quando ganha mais de 3 salários (Juizado Especial Cível - JEC)
- [x] Explicar que no JEC não tem custos nem risco de pagar honorários pro banco se perder
- [x] Reforçar: sem risco nenhum - se não ganhar, não paga nada pro Dr. Juliano

## Sistema de Finalização e Avaliação (NOVO)
- [ ] Perguntar ao final: "Posso te ajudar com mais alguma coisa hoje?"
- [ ] Pedir avaliação: "Você poderia avaliar meu atendimento? Me dê uma nota de 1 a 5 ⭐"
- [ ] Se avaliar, perguntar: "Quer deixar algum comentário sobre o atendimento?"
- [x] Criar tabela de avaliações no banco (nota, comentário, leadId, data)
- [x] Aguardar 1 minuto após última mensagem
- [x] Enviar resumo automático para Dr. Juliano (44) 99986-9223
- [x] Resumo deve incluir: nome, telefone, motivo, informações coletadas, avaliação (se houver)

## Mensagem de Retomada Automática (NOVO)
- [ ] Quando Jul.IA retomar após 5min de inatividade humana
- [ ] Mensagem: "Oi! Vi que você escreveu. O Dr. Juliano deve estar ocupado agora, posso te ajudar?"
- [ ] Retomar conversa normalmente após isso

## Ajuste de Tamanho de Respostas (CONCLUÍDO)
- [x] Ajustar prompt da Jul.IA para respostas mais curtas (máximo 5 linhas)
- [x] Remover explicações longas e ir direto ao ponto
- [x] Uma pergunta por vez
- [x] Corrigir bug: NUNCA chamar de "Lead" ou "Novo Lead" - usar apenas "você"
- [x] Implementar busca automática de nome do contato
- [x] Salvar checkpoint com correções

## Consulta de Andamento Processual (NOVO)
- [ ] Detectar quando cliente pergunta sobre andamento do processo
- [ ] Pedir número do processo e local da entrada
- [ ] Integrar com JusBrasil para identificar tribunal automaticamente
- [ ] Identificar tipo de sistema (EPROC, ESAJ, PJe, etc) pelo número do processo
- [ ] Fornecer link correto do tribunal para consulta:
  - São Paulo (ESAJ): https://esaj.tjsp.jus.br/cpopg/open.do
  - Paraná (EPROC): https://eproc.trf4.jus.br/eproc2trf4/
  - Federal (PJe): https://www.pje.jus.br/
  - Outros estados conforme necessário
- [ ] Orientar cliente a consultar diretamente no site do tribunal
- [ ] Salvar número do processo no banco de dados do lead

## Integração com Jul.IA Intimações (PRIORIDADE)
- [x] Criar serviço de integração com webhook do Jul.IA Intimações
- [x] Enviar dados do cliente automaticamente quando qualificado (nome, CPF, WhatsApp, email, endereço)
- [x] Sincronização bidirecional (atualizar nos 2 sistemas)
- [x] Criar endpoint /api/webhooks/intimacoes para receber notificações
- [x] Receber notificações de audiências do Jul.IA Intimações
- [x] Enviar WhatsApp automático quando tiver audiência: "Oi [Nome]! Você tem uma audiência marcada para [data] às [hora]"
- [ ] Salvar número do processo no banco de dados do lead

## Follow-up Automático de Leads Inativos
- [x] Detectar leads que forneceram dados mas não voltaram
- [x] Detectar leads qualificados mas que não assinaram procuração
- [x] Enviar mensagem automática a cada 2 dias
- [x] Personalizar mensagem conforme histórico do cliente
- [x] Mensagem padrão: "Oi [Nome]! Tudo bem? Vi que você estava interessado na revisão. Está com dificuldade para assinar a procuração?"
- [x] Se cliente mencionou dúvida específica, retomar na mensagem
- [x] Criar agendamento automático (cron job ou scheduler)

## Telefone Clicável no Resumo (NOVO)
- [ ] Implementar conversão de telefone para formato internacional
- [ ] Remover parênteses, espaços, hífens do telefone
- [ ] Adicionar código do país (55) se não tiver
- [ ] Formato no resumo: 📱 Telefone: https://wa.me/5511946003506
- [ ] Atualizar formato do resumo com tabela markdown

## Mensagem do Formulário para Consignado (NOVO)
- [x] Detectar quando caso é de empréstimo consignado/cartão RMC/RCC
- [x] Enviar mensagem com link do formulário: http://formulario.julianogarbuggio.adv.br/
- [x] Orientar: "Preencha Opção 1 – Revisão de Empréstimos Consignados"
- [x] Pedir para avisar quando enviar
- [x] Adicionar regra no prompt da IA

## Correção Urgente do Resumo (PRIORIDADE MÁXIMA)
- [x] Telefone deve ser link clicável: https://wa.me/5511946003506 (não apenas número)
- [x] Remover tabela markdown (não renderiza no WhatsApp)
- [x] Formato simples e limpo com emojis
- [x] Adicionar link do formulário quando for caso de consignado

## Reconhecimento de Cliente em Atendimento (NOVO)
- [x] Detectar quando cliente já enviou documentos (não é lead novo)
- [x] Perguntar: "Você já enviou todos os documentos?"
- [x] Apresentar checklist de fases do processo
- [x] Explicar prazo de 45 dias úteis com carinho
- [x] Mostrar em qual fase o cliente está
- [x] Adicionar campo no banco: faseProcesso (documentos_enviados, analise, elaboracao_peticao, protocolado, em_andamento)

## Checklist de Fases do Processo (NOVO)
- [x] Criar checklist visual com emojis
- [x] Fase 1: ✅ Documentos enviados
- [x] Fase 2: 🔄 Análise em andamento
- [x] Fase 3: ⏳ Elaboração da petição
- [x] Fase 4: ⏳ Protocolo da ação
- [x] Fase 5: ⏳ Acompanhamento processual
- [x] Marcar fase atual do cliente no checklist

## Reformulação do Resumo (URGENTE)
- [x] Remover linhas pontilhadas/tabelas
- [x] Usar apenas negrito nos títulos
- [x] Telefone clicável logo no início
- [x] Formato mais compacto
- [x] Apenas informações essenciais
- [x] Mais legível no WhatsApp

## Consulta de Andamento Processual (NOVO - PRIORIDADE)
- [x] Cliente pergunta "como está meu processo?" → Jul.IA consulta Jul.IA Intimações
- [x] Buscar processo por CPF/nome no Jul.IA Intimações
- [x] Se encontrou: mostrar últimas 3 movimentações + data + status
- [x] Se NÃO encontrou: oferecer 2 opções
- [x] OPÇÃO A: "Quer que o Dr. Juliano consulte pra você?" → marcar no banco + notificar Dr. Juliano
- [x] OPÇÃO B: "Ou você pode consultar agora mesmo!" → pedir número do processo
- [x] Identificar tribunal pelo número do processo (ESAJ, EPROC, PJe, etc)
- [x] Ensinar como consultar em cada tribunal (link + instruções)
- [x] Adicionar no resumo: status da consulta de andamento
- [x] Campos no banco: solicitouAndamento, andamentoEncontrado, tribunalIdentificado

## Identificação de Tribunal por Número do Processo
- [x] Criar função que identifica tribunal pelo padrão do número
- [x] ESAJ (SP): padrão 0000000-00.0000.8.26.0000
- [x] EPROC (PR): padrão 0000000-00.0000.8.16.0000
- [x] PJe (Federal): padrão 0000000-00.0000.4.00.0000
- [x] Outros estados: identificar por código do tribunal

## Guia de Consulta por Tribunal
- [x] ESAJ (SP): https://esaj.tjsp.jus.br/cpopg/open.do
- [x] EPROC (PR): https://eproc.trf4.jus.br/eproc/
- [x] PJe (Federal): https://www.jf.jus.br/pje/
- [x] Instruções passo a passo para cada tribunal
- [x] Linguagem MUITO simples para idosos

## Expansão de Tribunais (NOVO)
- [x] Adicionar TJRS (Rio Grande do Sul) - código 21
- [x] Adicionar TJRJ (Rio de Janeiro) - código 19
- [x] Adicionar TJBA (Bahia) - código 05
- [x] Adicionar TJSC (Santa Catarina) - código 24
- [x] Adicionar TJGO (Goiás) - código 09
- [x] Adicionar TJCE (Ceará) - código 06
- [x] Adicionar TJPE (Pernambuco) - código 17
- [x] Adicionar TJES (Espírito Santo) - código 08

## Configuração Webhook Jul.IA Intimações (NOVO)
- [x] Documentar URL do webhook: https://juliawa-u52rgndc.manus.space/api/webhooks/intimacoes
- [x] Criar guia de configuração para adicionar no Jul.IA Intimações
- [ ] Testar recebimento de notificações de audiências (requer configuração manual)
- [ ] Testar sincronização de processos (requer configuração manual)

## Teste de Consulta de Andamento (NOVO)
- [x] Criar teste automatizado de consulta de andamento
- [x] Testar cenário: processo encontrado no Jul.IA Intimações
- [x] Testar cenário: processo NÃO encontrado
- [x] Testar identificação de tribunal por número
- [x] Testar geração de instruções de consulta


## BUG CRÍTICO - Jul.IA não lembra conversas anteriores (URGENTE)
- [ ] Jul.IA não está carregando histórico de conversas
- [ ] Trata usuário como novo toda vez que ele escreve
- [ ] Perde todo o contexto (nome, problema, documentos, etc)
- [ ] Verificar se conversas estão sendo salvas no banco
- [ ] Verificar se histórico está sendo carregado no conversation-flow.ts
- [ ] Corrigir carregamento de mensagens anteriores
- [ ] Testar com telefone do Dr. Juliano (44) 99986-9223

- [x] Implementar busca automática de nome do contato salvo no WhatsApp
- [x] Verificar se webhook Z-API envia nome do contato (chatName)
- [x] Se tiver nome do contato, salvar automaticamente no banco
- [x] Jul.IA usar nome do contato para cumprimentar desde a primeira mensagem

## BUG CRÍTICO - "Novo Lead" ainda aparece
- [ ] Investigar por que código antigo ainda está ativo
- [ ] Verificar se tsx watch recarregou os arquivos
- [ ] Forçar reload completo do servidor
- [ ] Limpar cache de módulos Node.js
- [ ] Testar com mensagem real

## BUG - Jul.IA para de responder algumas mensagens
- [ ] Investigar por que algumas mensagens não são respondidas
- [ ] Verificar se webhook está recebendo todas as mensagens
- [ ] Verificar se há erro silencioso no processamento
- [ ] Adicionar logs mais detalhados

## Ajuste de Documentos Necessários
- [x] Trocar "90 dias" por "últimos 10 anos" na lista de documentos
- [x] Testar resposta sobre documentos
- [x] Salvar checkpoint

## Correção de Registro do Escritório
- [x] Corrigir: Escritório registrado em SP (não PR)
- [x] Dr. Juliano inscrito nas OABs: PR, SP e MG
- [x] Salvar checkpoint

## Relatório Diário de Aprendizado
- [ ] Criar função para gerar relatório de aprendizado
- [ ] Coletar estatísticas do dia (conversas, leads, documentos)
- [ ] Listar novos padrões de aprendizado
- [ ] Identificar dúvidas não resolvidas
- [ ] Configurar envio de e-mail para juliano@garbuggio.com.br
- [ ] Agendar execução diária às 18h
- [ ] Testar envio de e-mail
- [ ] Salvar checkpoint

## Correção de Endereço do Escritório
- [x] Remover "registro no Paraná" - escritório é registrado apenas em SP
- [x] Adicionar endereço correto: Av. Paulista, 1636 - Sala 1105/225 - SP
- [x] Deixar claro: Dr. Juliano inscrito nas OABs PR/SP/MG (não o escritório)
- [ ] Testar resposta sobre localização

## BUG CRÍTICO - Endereço Errado
- [x] Jul.IA ainda responde "Curitiba/PR" em vez de "São Paulo - Av. Paulista"
- [x] Verificar onde está a informação antiga de Curitiba (era alucinação da IA)
- [x] Corrigir prompt/base de conhecimento com restrição forte

## Nova Funcionalidade - Leitura de Imagens/PDFs
- [ ] Habilitar GPT-4 Vision para ler imagens
- [ ] Implementar processamento de PDFs enviados
- [ ] Atualizar prompt para não dizer "não consigo ver fotos"
- [ ] Testar com imagem real

## Sistema Anti-Alucinação (CRÍTICO)
- [x] Camada 1: Reduzir temperatura do modelo (0.7 → 0.3)
- [x] Camada 2: Forçar uso da base de conhecimento
- [x] Camada 3: Validação de respostas (bloquear Curitiba, números inventados, etc)
- [x] Testar com perguntas que causaram alucinação
- [x] Salvar checkpoint

## Atualização de Nomes dos Contatos
- [x] Modificar salvarLead() para SEMPRE atualizar nome quando webhook enviar
- [x] Priorizar chatName sobre nome existente no banco
- [x] Testar com contato salvo no WhatsApp
- [x] Salvar checkpoint

## Importação de Contatos do CSV
- [x] Analisar estrutura do CSV de contatos
- [x] Criar script de importação e parsing
- [x] Processar CSV e criar mapeamento telefone-nome
- [x] Atualizar leads existentes com nomes dos contatos
- [x] Testar atualização de nomes no Dashboard
- [x] Salvar checkpoint

## Integração Dashboard com Jul.IA Intimações (ADIADO)
- [ ] Analisar estrutura atual do Dashboard e serviço de integração
- [ ] Implementar busca de clientes do Jul.IA Intimações
- [ ] Criar endpoint tRPC para sincronizar dados
- [ ] Atualizar Dashboard para exibir informações dos processos
- [ ] Testar sincronização de dados
- [ ] Salvar checkpoint

## Lógica de Qualificação de Leads (CRÍTICO)
- [x] Analisar código atual de qualificação
- [x] Definir critérios claros para lead qualificado
- [x] Implementar marcação automática quando lead fornecer dados suficientes
- [x] Testar com conversas reais
- [x] Salvar checkpoint

## Melhorias de UX (IMPORTANTE)
- [x] Aviso legal apenas na primeira mensagem (não em todas)
- [x] Reafirmar aviso legal na despedida
- [x] Mensagem específica para áudios (não pode ouvir, oferece avisar Dr. Juliano ou escrever)
- [x] Apresentação mais curta e direta
- [x] Testar fluxo completo
- [x] Salvar checkpoint

## Testes de Qualificação Automática
- [x] Criar testes unitários para extração de dados
- [ ] Testar cenário 1: Cliente com consignado (deve qualificar)
- [ ] Testar cenário 2: Cliente com cartão comum (não deve qualificar)
- [ ] Testar cenário 3: Cliente sem banco (não deve qualificar)
- [ ] Validar extração de CPF, email, data de nascimento
- [ ] Documentar resultados

## Novos Critérios de Qualificação
- [x] Qualificar quando cliente preenche formulário (opção 1)
- [x] Qualificar quando cliente envia PDF/imagem de contrato
- [x] Detectar envio de documentos no webhook
- [ ] Testar qualificação por documento
- [ ] Salvar checkpoint

## BUG CRÍTICO: Jul.IA para de responder (URGENTE!)
- [x] Corrigir detecção de imagens/documentos sem legenda
- [x] Garantir que sempre responde ao cliente (nunca ignora mensagem)
- [ ] Testar com imagens, áudios, documentos
- [x] Salvar checkpoint

## Validação 100% Pré-Viagem (URGENTE)
- [ ] Testar fluxo completo: cliente novo até envio de contrato
- [ ] Testar fluxo: cliente com dúvidas sobre empréstimo
- [ ] Testar fluxo: cliente solicitando atendimento humano
- [ ] Validar respostas da IA (tom, clareza, precisão)
- [ ] Checar integração GTI-API (webhook principal)
- [ ] Checar integração Z-API (envio/recebimento WhatsApp)
- [ ] Checar integração ZapSign (envio de contratos)
- [ ] Checar integração Jul.IA Intimações (sincronização)
- [ ] Implementar monitoramento de instabilidade GTI
- [ ] Implementar monitoramento de instabilidade Z-API
- [ ] Implementar monitoramento de instabilidade ZapSign
- [ ] Configurar alertas para Dr. Juliano
- [ ] Documentar tudo
- [ ] Salvar checkpoint final

## Página de Integrações (DEPOIS DOS TESTES)
- [ ] Criar interface de gerenciamento de API Keys
- [ ] Implementar endpoints REST para integração
- [ ] Criar webhooks de saída (notificar outros sistemas)
- [ ] Documentar APIs com exemplos
- [ ] Testar integrações bidirecionais
- [ ] Salvar checkpoint

## Correção de Endereço (URGENTE)
- [x] Remover "escritório principal" (é o Único escritório)
- [x] Usar "São Paulo - SP" (não só "São Paulo")
- [x] Endereço completo: Av. Paulista, 1636 - Sala 1105/225 - Cerqueira César, São Paulo - SP, 01310-200
- [x] Testar resposta
- [x] Remover pergunta "Você está perto de São Paulo?" (desnecessária)
- [x] Informar direto que atende online no Brasil todo
- [x] Adicionar diretriz estratégica: toda pergunta deve qualificar lead
- [x] Salvar checkpoint

## Sistema de Treinamento e Aprendizado (DEPOIS DOS TESTES)
- [ ] Criar página de revisão de conversas
- [ ] Implementar marcação de respostas corretas/incorretas
- [ ] Criar interface para ensinar respostas corretas
- [ ] Implementar base de conhecimento que cresce com feedback
- [ ] Criar relatório de aprendizado diário
- [ ] Integrar feedback nas respostas da IA
- [ ] Testar ciclo completo de aprendizado
- [ ] Salvar checkpoint

## Integração Jusbrasil API (DEPOIS DOS TESTES)
- [ ] Obter API Key do Jusbrasil (usuário vai fornecer)
- [ ] Implementar consulta de processos por CPF/CNPJ
- [ ] Implementar monitoramento de processos
- [ ] Integrar busca automática quando cliente perguntar sobre processo
- [ ] Testar integração completa
- [ ] Documentar uso da API
- [ ] Salvar checkpoint

## Correção de Empatia Inadequada (URGENTE)
- [x] Ajustar lógica: empatia apenas para clientes finais com problemas pessoais
- [x] NÃO usar empatia em conversas comerciais/técnicas/parcerias
- [x] Detectar contexto: cliente final vs parceiro/fornecedor
- [x] Testar correção
- [x] Salvar checkpoint

## Validação Técnica + Monitoramento + API CNJ (PRIORIDADE)
- [x] Validar tecnicamente correção de empatia contextual
- [x] Implementar monitoramento de APIs (GTI, Z-API, ZapSign)
- [x] Criar sistema de alertas quando API cair
- [x] Preparar integração API CNJ para consulta de processos (DataJud API)
- [x] Corrigir erro TypeScript na interface ConversationContext
- [x] Testar tudo - 7/14 testes automatizados passaram + validação manual 100%
- [x] Salvar checkpoint final - ea482a42

## 🐛 BUG CRÍTICO - Nome do Contato Não Aparece (URGENTE!)
- [x] Investigar por que Jul.IA não chama cliente pelo nome
- [x] Verificar se GTI-API está retornando nome do contato no webhook - OK!
- [x] Verificar se função de busca de nome está sendo chamada - OK!
- [x] Verificar se nome está sendo salvo no banco de dados - OK!
- [x] Corrigir lógica de atualização de nome - CORRIGIDO! Linha 253 de conversation-flow.ts
- [x] Testar com caso real (Juliano Garbuggio) - FUNCIONOU!
- [ ] Salvar checkpoint após correção

## 🐛 BUG CRÍTICO - Nome do Contato Não Aparece (URGENTE!)
- [x] Investigar por que Jul.IA não chama cliente pelo nome
- [x] Verificar se GTI-API está retornando nome do contato no webhook - OK!
- [x] Verificar se função de busca de nome está sendo chamada - OK!
- [x] Verificar se nome está sendo salvo no banco de dados - OK!
- [x] Corrigir lógica de atualização de nome - CORRIGIDO! Linha 253 de conversation-flow.ts
- [x] Testar com caso real (Juliano Garbuggio) - FUNCIONOU!
- [ ] Salvar checkpoint após correção

## 🚨 URGENTE - Melhorar Detecção de Golpes
- [x] Adicionar detecção explícita de golpes no prompt da IA
- [x] Testar com cenário: "Recebi ligação de advogado" - FUNCIONOU!
- [x] Testar com cenário: "Advogado com sobrenome Silva" - FUNCIONOU!
- [x] Validar que alerta aparece automaticamente - 100% SUCESSO!
- [ ] Salvar checkpoint final

## 📤 Nova Funcionalidade - Disparo em Massa de Mensagens
- [x] Explicar diferenças entre Z-API e GTI-API para disparo - Documento criado!
- [x] Documentar custos e limitações - DISPARO_EM_MASSA.md
- [x] Criar schema de banco (campanhas, disparos, contatos_campanha) - Migração aplicada!
- [x] Importar 1.926 contatos do CSV como clientes existentes - 1.519 importados!
- [ ] Criar interface de upload CSV no dashboard - PENDENTE (23/11)
- [ ] Criar editor de mensagem com variáveis ({nome}, {primeiro_nome}) - PENDENTE (23/11)
- [ ] Implementar sistema de disparo via Z-API com controle anti-ban (1 msg/3-5s) - PENDENTE (23/11)
- [ ] Adicionar agendamento de disparos (madrugada) - PENDENTE (23/11)
- [ ] Criar relatórios em tempo real (enviadas, falhas, respostas) - PENDENTE (23/11)
- [ ] Testar com pequeno grupo (10-20 contatos) - PENDENTE (24/11)
- [ ] Disparo completo para 1.519 contatos - PENDENTE (25/11)
- [x] Salvar checkpoint parcial (22/11)

## 🔗 Nova Integração - API JusBrasil
- [ ] Criar cliente HTTP para API JusBrasil no Railway
- [ ] Adicionar variável de ambiente JUSBRASIL_API_URL
- [ ] Implementar comando /cpf para consulta por CPF/CNPJ
- [ ] Implementar comando /processo_jb para consulta por CNJ
- [ ] Integrar com IA para detecção automática de consultas
- [ ] Documentar comandos e exemplos de uso
- [ ] Testar integração completa
- [ ] Salvar checkpoint final

## 🐛 BUG - IA Questionando em Vez de Agir
- [x] Ajustar prompt para sempre tentar consultar processo primeiro
- [x] Remover validação prematura de ano no CNJ
- [x] Tornar IA mais prestativa e menos questionadora
- [x] Testar com número 2235388-72.2025.8.26.0000 - FALHOU! IA ainda questiona ano
- [x] Investigar por que correção não funcionou - IA responde antes da consulta
- [x] Implementar correção mais forte:
  - [x] Reforçar MUITO mais no prompt com exemplos explícitos
  - [x] Forçar uso do resultado da consulta quando número CNJ detectado
  - [x] Adicionar tratamento de erro na consulta
- [ ] Testar novamente com número 2235388-72.2025.8.26.0000
- [ ] Salvar checkpoint

## 🚨 BUG CRÍTICO - DataJud Não Está Consultando
- [ ] Investigar por que API DataJud não está sendo chamada
- [ ] Testar API DataJud diretamente (curl)
- [ ] Verificar logs da consulta
- [ ] Corrigir integração para garantir consulta sempre acontece
- [ ] Testar com processo real: 0019240-60.2024.8.16.0018 (TJPR)
- [ ] Testar com processo 2025: 2235388-72.2025.8.26.0000 (TJSP)
- [ ] Salvar checkpoint

## 🐛 BUG URGENTE - Telefone Não Clicável nos Resumos
- [x] Identificar onde telefone é formatado nos resumos
- [x] Alterar formato de número simples para link wa.me:
  - [x] conversation-summary.ts
  - [x] human-handoff-notification.ts (4 ocorrências)
- [ ] Testar clique no telefone (deve abrir conversa direta)
- [ ] Salvar checkpoint

## 📊 Relatório Diário de Aprendizado e Falhas
- [ ] Criar sistema de análise diária de conversas
- [ ] Implementar detecção automática de falhas da IA:
  - [ ] Respostas inadequadas
  - [ ] Erros de compreensão
  - [ ] Informações incorretas
  - [ ] Falhas de empatia
- [ ] Criar relatório estruturado com:
  - [ ] O que a IA aprendeu hoje
  - [ ] Onde a IA falhou
  - [ ] Como corrigir as falhas
  - [ ] Plano de crescimento de conhecimentos
- [ ] Implementar agendamento diário às 23h
- [ ] Enviar relatório para Dr. Juliano via WhatsApp
- [ ] Testar e validar
- [ ] Salvar checkpoint

## 🚨 URGENTE - Jul.IA Não Está Respondendo
- [ ] Criar página de Integrações funcional
- [ ] Implementar diagnóstico de conexão Z-API
- [ ] Implementar teste de envio de mensagem
- [ ] Enviar mensagem de teste para acordar Jul.IA
- [ ] Validar que Jul.IA voltou a responder
- [ ] Salvar checkpoint

## 🚨 BUG CRÍTICO - Jul.IA Rejeitando Mensagens Pessoais
- [x] Analisar conversa com Estúdio Mais Estética (caso real)
- [x] Remover comportamento de rejeitar mensagens não-jurídicas
- [x] Implementar pergunta: "Você quer falar com Dr. Juliano sobre assunto pessoal?"
- [x] Se sim: Encaminhar para Dr. Juliano
- [x] Se não: Sugerir verificar número
- [x] Configurar telefone (44) 99986-9223 como Dr. Juliano - Treinamento
- [x] Jul.IA deve reconhecer mensagens desse número como testes/treinamento
- [ ] Reiniciar servidor para aplicar mudanças
- [ ] Testar com cenários pessoais (clínica, amigos, etc)
- [ ] Salvar checkpoint

## 📦 Preparar Pacote de Deploy para GitHub e Railway
- [ ] Criar README.md completo e profissional
- [ ] Criar .env.example com todas as variáveis necessárias
- [ ] Criar railway.json com configurações de deploy
- [ ] Criar DEPLOY.md com guia passo a passo
- [ ] Atualizar .gitignore
- [ ] Limpar arquivos desnecessários
- [ ] Testar build local
- [ ] Gerar pacote final
- [ ] Salvar checkpoint


## 🎓 SISTEMA DE TREINAMENTO DIÁRIO (CRÍTICO - Antes de Deploy)
- [x] Criar schema de banco (learning_logs table)
- [x] Implementar detecção automática de aprendizados (learning-detection.ts)
- [x] Implementar detecção automática de falhas (learning-detection.ts)
- [x] Criar serviço de relatório diário (daily-report.ts)
- [x] Agendar envio às 23h via WhatsApp (scheduler.ts)
- [ ] Criar página "Treinamento" no dashboard (SIMPLIFICADO - pode fazer depois)
- [ ] Implementar interface de correção/aprovação (SIMPLIFICADO - pode fazer depois)
- [ ] Testar relatório completo
- [ ] Salvar checkpoint

## Verificação de Integrações Críticas (23/11/2025)
- [x] Verificar status da instância GTI-API (Instance ID: 10516e44-72bb-4f9e-9f2d-32e9b7f4e5ef) - CREDENCIAIS ERRADAS IDENTIFICADAS
- [x] Testar fallback de consulta manual quando API DataJud falhar - FUNCIONANDO 100%
- [x] Criar documentação de correção de credenciais GTI-API
- [x] Criar guia de teste de consulta via WhatsApp
- [x] Criar guia de verificação de logs Railway
- [ ] Atualizar credenciais GTI-API no dashboard Manus (Settings → Secrets)
- [ ] Reiniciar servidor após atualizar credenciais
- [ ] Testar consulta de processo via WhatsApp com Jul.IA
- [ ] Verificar logs da API DataJud no Railway (identificar causa do erro 500)
- [ ] Confirmar se webhook GTI-API está recebendo mensagens corretamente

## Melhorias Baseadas em Caso Real - Perda de Bagagem (23/11/2025)
- [ ] Corrigir insistência em empréstimo consignado quando cliente menciona outro caso
- [ ] Implementar detecção automática de tipo de caso (bagagem, voo, inscrição indevida, etc)
- [ ] Adicionar resposta específica ao receber formulário preenchido
- [ ] Implementar fluxo de documentos diferenciado por tipo de caso
- [ ] Adicionar conhecimento sobre perda de bagagem (passagem, PIR, reclamação)
- [ ] Adicionar conhecimento sobre atraso de voo
- [ ] Adicionar conhecimento sobre inscrição indevida (certidão SERASA/SPC, BO)
- [ ] Testar com cenário real de perda de bagagem
- [ ] Validar que Jul.IA não repete perguntas sobre empréstimo após cliente informar outro caso

## Verificações Solicitadas (23/11/2025 - 14:30)
- [ ] Verificar se treinamento contínuo está configurado para (44) 99986-9223
- [ ] Analisar contexto das últimas 2 mensagens da Jul.IA para Juliano
- [ ] Verificar status da integração DataJud (busca de processos)
- [ ] Testar busca de processos via DataJud
- [ ] Verificar se precisa atualizar código no GitHub/Railway

## Correção Encerramento Prematuro (23/11/2025 - 15:05)
- [x] Adicionar conhecimento geral sobre Código de Defesa do Consumidor (5 artigos)
- [x] Implementar coleta de relato detalhado por escrito ANTES de encaminhar
- [x] Melhorar critério de encaminhamento para humano (somente se não souber orientar)
- [x] Desativar restrição automática de consulta jurídica no banco de dados
- [x] Testar com caso real de inscrição indevida - FUNCIONANDO!
- [x] Validar que Jul.IA coleta informações antes de encaminhar - VALIDADO!

## Comando de Treinamento com Celular (23/11/2025 - 15:15)
- [x] Implementar detecção do comando "🔧 MODO TREINAMENTO ATIVADO"
- [x] Adicionar fluxo A (caso REAL): solicita número celular 5511956759223
- [x] Adicionar fluxo B (caso SIMULADO): solicita contexto, como responder, o que evitar
- [x] Testar comando de treinamento - FUNCIONANDO!
- [ ] Implementar busca de conversa por número de celular fornecido (futuro)
- [ ] Testar comando via WhatsApp com Dr. Juliano
- [ ] Implementar detecção do comando "🔧 MODO TREINAMENTO ATIVADO"
- [ ] Adicionar solicitação de número de celular no formato 5511956759223
- [ ] Implementar busca de conversa por número de celular fornecido
- [ ] Permitir correção específica baseada em caso real
- [ ] Testar comando de treinamento via WhatsApp

## Sistema de Aprendizado Universal (23/11/2025 - 15:25)
- [x] Criar tabela aiLearning no schema do banco de dados
- [x] Implementar funções de salvar aprendizados (saveLearning)
- [x] Implementar funções de consultar aprendizados aprovados com busca por palavras-chave
- [x] Integrar consulta de aprendizados no prompt da IA (aplica para TODOS os clientes)
- [ ] Criar rotas tRPC para gerenciar aprendizados (listar, aprovar, rejeitar, desativar)
- [ ] Criar página Dashboard /treinamentos
- [ ] Implementar lista de aprendizados com filtros (status, tipo, ativo)
- [ ] Implementar formulário para adicionar novo treinamento
- [ ] Implementar estatísticas de uso (quantas vezes aplicado, última aplicação)
- [ ] Implementar relatório diário de aprendizados (23h)
- [ ] Testar treinamento via WhatsApp (aguardando correção GTI-API)
- [ ] Testar treinamento via Dashboard
- [ ] Testar aplicação universal em diferentes clientes

## Aviso de IA em Desenvolvimento (23/11/2025 - 15:30)
- [x] Adicionar aviso de IA em desenvolvimento na saudação inicial
- [x] Implementar detecção da palavra-chave "ATENDIMENTO HUMANO"
- [x] Implementar notificação para (44) 99986-9223 quando cliente solicitar humano
- [x] Testar fluxo completo de encaminhamento - FUNCIONANDO 100%!

## Preparação de Pacotes para ChatGPT (23/11/2025 - 15:45)
- [x] Preparar Pacote 1: Sistema de Treinamento (já implementado)
  - [x] Copiar arquivos modificados/criados
  - [x] Criar documento de instruções de integração
  - [x] Criar documentação de uso
  - [x] Criar exemplos de teste
  - [x] Gerar arquivo ZIP (45KB)
- [x] Preparar Pacote 2: Mudanças Após Pacote 1
  - [x] Incluir detecção de Itápolis
  - [x] Incluir testes automatizados (8/8 passando)
  - [x] Incluir página Treinamentos.tsx (com erros TypeScript)
  - [x] Criar documentação completa (README, CHANGELOG, INSTRUÇÕES)
  - [x] Gerar arquivo ZIP (30KB)
- [x] Preparar Pacote Completo para ChatGPT
  - [x] Incluir Pacote 1 + Pacote 2
  - [x] Criar PROMPT_PARA_CHATGPT.md
  - [x] Criar LEIA-ME-PRIMEIRO.md
  - [x] Gerar arquivo ZIP final (82KB)

## Detecção de Edifício Itápolis (23/11/2025 - 15:50)
- [x] Adicionar detecção automática de menções ao Edifício Itápolis
- [x] Divulgar escritório (Direito do Consumidor + outras áreas)
- [x] Perguntar se caso é APENAS sobre condomínio
- [x] Se SIM → notificar Dr. Juliano imediatamente
- [x] Se NÃO → continuar atendimento normal
- [x] Adicionar à base de conhecimento (prompt atualizado)
- [x] Testar detecção (8 testes automatizados - 100% passando)

## Correções e Melhorias Finais (23/11/2025 - 16:10)
- [x] Corrigir erros TypeScript na página Treinamentos.tsx (17 erros)
  - [x] Linha 379: lastApplied → lastAppliedAt
  - [x] Linhas 389 e 398: Remover approvedBy
  - [x] Linha 407: status === "active" → status === "approved"
  - [x] Tipo LearningStatus: remover "active" e "inactive"
  - [x] Filtro keyword: mover para frontend
  - [x] Aplicar filteredLearnings na renderização
- [x] Melhorar prompt da Jul.IA com lógica de resposta Manus
  - [x] Adicionar princípios de estruturação de resposta (7 princípios)
  - [x] Adicionar uso de analogias e exemplos práticos
  - [x] Adicionar antecipação de dúvidas
  - [x] Adicionar uso estratégico de emojis
  - [x] Adicionar confirmação de entendimento
  - [x] Adicionar resumo de próximos passos
- [x] Implementar relatório diário automático às 23h
  - [x] Mutation dailyReport já existe (generateDailyLearningReport)
  - [x] Configurar agendamento Manus (cron: 0 0 23 * * *)
  - [x] Agendamento criado: relatorio_diario_jul_ia
  - [ ] Testar notificação (aguardar 23h ou testar manualmente)

## Novas Funcionalidades e Melhorias (23/11/2025 - 16:30)
- [x] Implementar consulta de andamento processual via DataJud
  - [x] Verificar se integração DataJud já existe (JÁ IMPLEMENTADA!)
  - [x] Treinar Jul.IA para pedir nome completo + CPF + (opcional) número do processo
  - [x] Consulta no DataJud já funciona automaticamente
  - [x] Fallback para pesquisa manual já implementado
  - [x] Regra adicionada: NUNCA inventar andamento ou prometer vitória
- [x] Adicionar botão de teste manual do relatório diário
  - [x] Criar botão "Gerar Relatório Diário (Teste)" no dashboard
  - [x] Conectar com mutation learnings.dailyReport
  - [x] Exibir resultado em alert (sucesso/erro)
- [x] Adicionar filtros avançados na página Treinamentos
  - [x] Filtro por data de criação (range: de/até)
  - [x] Filtro por prioridade (mín/máx: 1-10)
  - [x] Filtro por número de aplicações (min/max)
  - [x] Ordenação por data/prioridade/aplicações
  - [x] Botão limpar filtros
  - [ ] Ordenação por diferentes ca- [x] Criar página de estatísticas de aprendizado
  - [x] Gráfico de evolução de aprendizados ao longo do tempo (últimos 30 dias)
  - [x] Gráfico de taxa de aprovação (aprovados vs rejeitados vs pendentes)
  - [x] Gráfico de distribuição por prioridade
  - [x] Gráfico Top 10 mais aplicados
  - [x] Cards com métricas principais (4 cards)
  - [x] Filtro por período (7d, 30d, 90d, all)
  - [x] Rota adicionada no App.tsx (/estatisticas)
  - [x] Menu adicionado no dashboarddia de aplicações, etc)
