# Importação de Contatos do CSV

Este documento explica como importar contatos do Google Contacts (ou qualquer agenda de celular) para atualizar automaticamente os nomes dos leads no sistema Jul.IA WhatsApp.

## Por que importar contatos?

Quando você tem contatos salvos no seu celular (ex: "Juliano Garbuggio", "Darío"), mas o sistema mostra "Novo Lead", a importação resolve esse problema atualizando todos os leads de uma vez com os nomes corretos.

## Como exportar contatos do celular

### Android
1. Abra o app **Contatos** (ou Telefone)
2. Toque no menu (⋮) no canto superior
3. Selecione **Gerenciar contatos** ou **Configurações**
4. Escolha **Exportar contatos**
5. Selecione **Exportar para arquivo CSV** ou **VCF**
6. Salve o arquivo

### iPhone
1. Acesse **iCloud.com** no navegador
2. Faça login com sua Apple ID
3. Entre em **Contatos**
4. Selecione todos (Ctrl+A ou Cmd+A)
5. Clique na engrenagem (⚙️) no canto inferior esquerdo
6. Escolha **Exportar vCard**
7. Salve o arquivo

### Google Contacts (Recomendado)
1. Abra **contacts.google.com** no navegador
2. Clique em **Exportar** no menu lateral
3. Escolha **Google CSV**
4. Baixe o arquivo

## Como importar no sistema

### 1. Upload do arquivo CSV

Envie o arquivo CSV exportado para o servidor:

```bash
# Via upload manual ou scp
scp contacts.csv usuario@servidor:/home/ubuntu/upload/
```

### 2. Executar script de importação

```bash
cd /home/ubuntu/julia-whatsapp-assistant
npx tsx scripts/import-contacts.ts /home/ubuntu/upload/contacts.csv
```

### 3. Verificar resultados

O script irá:
- ✅ Processar todos os contatos do CSV
- ✅ Normalizar números de telefone (remover formatação)
- ✅ Atualizar leads existentes com nomes dos contatos
- ✅ Mostrar resumo de quantos foram atualizados

Exemplo de saída:

```
🚀 Iniciando importação de contatos...
📄 Lendo CSV: /home/ubuntu/upload/contacts.csv
📊 Total de linhas: 1926
✅ Processados: 1576 telefones
⏭️  Ignorados: 220 linhas sem telefone
📞 Total de contatos únicos: 1569

🔄 Atualizando leads no banco de dados...
📊 Total de leads no banco: 7
✅ Atualizado: 554499869223 -> Juliano Garbuggio
✅ Atualizado: 554499424949 -> Darío

📊 Resumo:
   ✅ Atualizados: 2
   ⏭️  Não encontrados: 5

✅ Importação concluída com sucesso!
```

## Como funciona o script

### 1. Normalização de telefones

O script remove toda formatação dos números:
- Remove parênteses, hífens, espaços
- Remove código do país (55)
- Remove zeros à esquerda
- Mantém apenas dígitos

Exemplos:
- `+55 44 9942-4949` → `4499424949`
- `(11) 95675-9223` → `1195675923`
- `+554499869223` → `4499869223`

### 2. Extração de nomes

O script limpa e formata os nomes:
- Remove pontos iniciais (`.`)
- Remove sufixos (Jec, Hu, Sp, Data, Base, etc)
- Capitaliza primeira letra de cada palavra
- Remove espaços extras

Exemplos:
- `. Juliano Garbuggio Sp` → `Juliano Garbuggio`
- `.darío` → `Darío`
- `. Ana Torres Da` → `Ana Torres Da`

### 3. Atualização no banco

O script:
1. Busca todos os leads no banco
2. Normaliza o telefone de cada lead
3. Procura o telefone no mapeamento de contatos
4. Atualiza o nome se encontrar correspondência
5. Mantém nome original se não encontrar

## Formato do CSV

O script espera o formato padrão do Google Contacts:

```csv
Name,Given Name,Additional Name,...,Phone 1 - Type,Phone 1 - Value,...
Juliano Garbuggio,Juliano,Garbuggio,...,Mobile,+55 44 99869-9223,...
Darío,Darío,,...,Mobile,+55 44 9942-4949,...
```

**Importante:**
- Nome está na coluna 0 (primeira coluna)
- Telefone está na coluna 20 (Phone 1 - Value)
- Suporta múltiplos telefones separados por `:::`

## Quando executar

Execute o script sempre que:
- ✅ Adicionar novos contatos no celular
- ✅ Atualizar nomes de contatos existentes
- ✅ Quiser sincronizar nomes do Dashboard com agenda
- ✅ Importar contatos de um novo celular/conta

## Automação futura

Possíveis melhorias:
- [ ] Agendar importação automática (cron job)
- [ ] Integração direta com Google Contacts API
- [ ] Webhook para sincronização em tempo real
- [ ] Interface web para upload de CSV

## Troubleshooting

### Erro: "DATABASE_URL não configurada"
Verifique se a variável de ambiente está definida:
```bash
echo $DATABASE_URL
```

### Erro: "Cannot find module"
Certifique-se de estar no diretório correto:
```bash
cd /home/ubuntu/julia-whatsapp-assistant
```

### Nenhum lead atualizado
Verifique se:
- Os telefones no CSV estão corretos
- Os leads no banco têm telefones válidos
- A formatação dos números está consistente

### Nomes não aparecem no Dashboard
- Recarregue a página (Ctrl+R ou F5)
- Limpe cache do navegador
- Verifique se o servidor está rodando

## Logs e Debug

Para ver logs detalhados durante a importação:
```bash
DEBUG=* npx tsx scripts/import-contacts.ts /path/to/contacts.csv
```

## Segurança

⚠️ **Importante:**
- Nunca compartilhe o arquivo CSV (contém dados pessoais)
- Delete o arquivo após importação
- Mantenha backup dos contatos originais
- Use HTTPS para upload de arquivos

## Suporte

Para dúvidas ou problemas:
- Email: juliano@garbuggio.com.br
- WhatsApp: (44) 99986-9223
