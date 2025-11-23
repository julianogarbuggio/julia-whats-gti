# Sistema de Backup Automático - Jul.IA Plataforma

Sistema completo de backup automático para o banco de dados do **Jul.IA - Plataforma Integrada de Gestão Jurídica**.

## 📋 Visão Geral

Este sistema realiza backup completo de todas as tabelas do banco de dados:

- **Intimações** - Intimações processuais
- **Clientes** - Cadastro de clientes
- **Procurações** - Procurações geradas
- **Remetentes** - Remetentes de e-mails

Os backups são salvos em formato JSON e automaticamente enviados para o Amazon S3 para armazenamento seguro e durável.

## 🎯 Funcionalidades

✅ **Backup Automático Diário** - Executa automaticamente todos os dias às 2h da manhã  
✅ **Backup Manual** - Permite criar backups sob demanda  
✅ **Compressão Automática** - Reduz tamanho dos arquivos com gzip  
✅ **Upload para S3** - Armazenamento seguro na nuvem  
✅ **Validação de Integridade** - Verifica backups após criação  
✅ **Versionamento** - Mantém histórico de backups  
✅ **Logs Detalhados** - Registro completo de todas as operações  
✅ **Limpeza Automática** - Remove backups antigos automaticamente  

## 📁 Estrutura de Arquivos

```
julia-backup-system/
├── backup_database.py          # Script principal de backup
├── julia_api_client.py         # Cliente para API do sistema
├── backup_via_browser.py       # Backup via automação de navegador
├── config.json                 # Arquivo de configuração
├── setup_cron.sh              # Script de configuração do cron
├── README.md                  # Esta documentação
├── requirements.txt           # Dependências Python
├── backups/                   # Diretório de backups locais
└── backup.log                 # Log de operações
```

## 🚀 Instalação

### 1. Instalar Dependências

```bash
pip3 install requests selenium
```

### 2. Configurar Permissões

```bash
chmod +x backup_database.py
chmod +x julia_api_client.py
chmod +x backup_via_browser.py
chmod +x setup_cron.sh
```

### 3. Configurar Backup Automático

```bash
./setup_cron.sh
```

Este comando configura o cron para executar backups diariamente às 2h da manhã.

## 📖 Uso

### Backup Manual

Para criar um backup imediatamente:

```bash
./backup_database.py
```

Com opções:

```bash
./backup_database.py --config config.json --action backup
```

### Listar Backups

Para ver todos os backups disponíveis:

```bash
./backup_database.py --action list
```

### Validar Backup

Para validar a integridade de um backup:

```bash
./backup_database.py --action validate --file backups/backup-2025-11-09T02-00-00.json.gz
```

### Backup via Browser

Alternativa usando automação de navegador (útil quando API não está disponível):

```bash
./backup_via_browser.py --upload-s3
```

## ⚙️ Configuração

Edite o arquivo `config.json` para personalizar:

```json
{
  "backup_dir": "./backups",
  "compress": true,
  "keep_local_copies": 10,
  "s3_bucket": "julia-backups",
  "tables": [
    "intimacoes",
    "clientes",
    "procuracoes",
    "remetentesEmail"
  ],
  "backup_schedule": {
    "enabled": true,
    "time": "02:00",
    "timezone": "America/Sao_Paulo"
  },
  "notifications": {
    "email": "juliano@garbuggio.com.br",
    "on_success": false,
    "on_failure": true
  },
  "retention": {
    "local_days": 30,
    "s3_days": 365
  }
}
```

### Parâmetros de Configuração

| Parâmetro | Descrição | Padrão |
|-----------|-----------|--------|
| `backup_dir` | Diretório para backups locais | `./backups` |
| `compress` | Comprimir backups com gzip | `true` |
| `keep_local_copies` | Número de backups locais a manter | `10` |
| `s3_bucket` | Nome do bucket S3 | `julia-backups` |
| `tables` | Lista de tabelas para backup | Ver config.json |
| `backup_schedule.time` | Horário do backup automático | `02:00` |
| `retention.local_days` | Dias para manter backups locais | `30` |
| `retention.s3_days` | Dias para manter backups no S3 | `365` |

## 📊 Formato do Backup

Os backups são salvos em formato JSON com a seguinte estrutura:

```json
{
  "timestamp": "2025-11-09T11:39:12.420Z",
  "version": "1.0",
  "tables": {
    "intimacoes": [
      {
        "id": 90001,
        "numeroProcesso": "0001242-07.2025.8.16.0160",
        "tribunal": "TJPR",
        "sistema": "PROJUDI",
        ...
      }
    ],
    "clientes": [...],
    "procuracoes": [...],
    "remetentesEmail": [...]
  }
}
```

## 🔄 Agendamento Automático

O sistema usa **cron** para executar backups automaticamente:

```cron
0 2 * * * cd /path/to/julia-backup-system && /usr/bin/python3.11 backup_database.py --config config.json >> cron.log 2>&1
```

### Verificar Agendamento

```bash
crontab -l
```

### Modificar Horário

Edite o crontab:

```bash
crontab -e
```

Formato do cron: `minuto hora dia mês dia-da-semana comando`

Exemplos:
- `0 2 * * *` - Todos os dias às 2h
- `0 */6 * * *` - A cada 6 horas
- `0 2 * * 0` - Domingos às 2h
- `0 2 1 * *` - Primeiro dia de cada mês às 2h

## 📝 Logs

Todos os logs são salvos em:

- `backup.log` - Log principal do sistema
- `cron.log` - Log das execuções via cron

Para visualizar logs em tempo real:

```bash
tail -f backup.log
```

## 🔐 Segurança

- Os backups são criptografados em trânsito para o S3
- Credenciais devem ser armazenadas em variáveis de ambiente
- Nunca commite arquivos de configuração com credenciais
- Use permissões adequadas nos arquivos (chmod 600 para arquivos sensíveis)

## 🆘 Restauração de Backup

Para restaurar um backup:

1. **Localize o arquivo de backup** (local ou S3)
2. **Descompacte se necessário**:
   ```bash
   gunzip backup-2025-11-09T02-00-00.json.gz
   ```
3. **Entre em contato com o suporte técnico** para restauração completa

⚠️ **Importante**: A restauração requer acesso administrativo ao banco de dados.

## 🐛 Solução de Problemas

### Backup não está sendo executado automaticamente

1. Verifique se o cron está configurado: `crontab -l`
2. Verifique os logs: `tail -f cron.log`
3. Teste manualmente: `./backup_database.py`

### Erro ao fazer upload para S3

1. Verifique se o utilitário `manus-upload-file` está disponível
2. Verifique permissões de escrita no diretório de backups
3. Verifique logs para mensagens de erro específicas

### Backup muito grande

1. Ative compressão no `config.json`: `"compress": true`
2. Considere fazer backups incrementais (funcionalidade futura)
3. Ajuste retenção de backups locais

## 📈 Estatísticas

Exemplo de saída de backup bem-sucedido:

```
2025-11-09 02:00:01 - INFO - === Iniciando Backup Automático ===
2025-11-09 02:00:01 - INFO - Iniciando backup em 2025-11-09T02-00-01
2025-11-09 02:00:05 - INFO - Backup salvo em: ./backups/backup-2025-11-09T02-00-01.json
2025-11-09 02:00:06 - INFO - Compressão: 856,234 -> 127,456 bytes (85.1% redução)
2025-11-09 02:00:06 - INFO - Backup comprimido: ./backups/backup-2025-11-09T02-00-01.json.gz
2025-11-09 02:00:06 - INFO - Tabela intimacoes: 26 registros
2025-11-09 02:00:06 - INFO - Tabela clientes: 1723 registros
2025-11-09 02:00:06 - INFO - Tabela procuracoes: 3 registros
2025-11-09 02:00:06 - INFO - Tabela remetentesEmail: 8 registros
2025-11-09 02:00:06 - INFO - Backup validado com sucesso
2025-11-09 02:00:10 - INFO - Backup enviado para S3: https://...
2025-11-09 02:00:10 - INFO - ✓ Backup criado com sucesso
```

## 🔮 Funcionalidades Futuras

- [ ] Backups incrementais
- [ ] Notificações por email
- [ ] Dashboard web para monitoramento
- [ ] Restauração automática
- [ ] Backup de arquivos anexos
- [ ] Criptografia de backups
- [ ] Integração com outros serviços de armazenamento

## 📞 Suporte

Para questões ou problemas:

- **Email**: juliano@garbuggio.com.br
- **Sistema**: https://juliaiga-wzundcb6.manus.space/

## 📄 Licença

Sistema desenvolvido para uso interno do escritório Juliano Garbuggio Advocacia.

---

**Última atualização**: 09/11/2025  
**Versão**: 1.0
