# Deploy na Railway - AISAM Backend

Este guia explica como fazer o deploy do backend na Railway.

## Pré-requisitos

1. Conta na [Railway](https://railway.app/)
2. Repositório Git conectado à Railway
3. PostgreSQL provisionado na Railway

## Configuração Automática

O projeto está configurado para fazer o setup automático na Railway através dos seguintes arquivos:

- `Procfile` - Define o comando de inicialização
- `scripts/railway-migrate.js` - Cria schemas e prepara o banco
- `.env.production.example` - Template das variáveis de ambiente

## Variáveis de Ambiente Obrigatórias

Configure as seguintes variáveis no painel da Railway:

### 1. Banco de Dados (PostgreSQL)

A Railway fornece automaticamente:
- `DATABASE_URL` - URL completa de conexão (fornecida automaticamente)

**NÃO é necessário configurar** `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME` manualmente, pois o sistema extrai essas informações da `DATABASE_URL`.

### 2. Autenticação (OBRIGATÓRIO)

```bash
# Gere uma chave secreta forte (mínimo 64 caracteres)
# Execute: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=sua_chave_secreta_gerada_aqui
```

### 3. Frontend (URLs)

```bash
# URL do frontend institucional
FRONTEND_INSTITUCIONAL_URL=https://aisam.com.br

# URL do frontend app (admin/recrutadores)
FRONTEND_URL=https://vagas.aisam.com.br
```

### 4. E-mail (Configuração KingHost)

```bash
MAIL_HOST=mail.aisam.com.br
MAIL_PORT=465
MAIL_USER=vagas@aisam.com.br
MAIL_PASS=sua_senha_email
MAIL_FROM=vagas@aisam.com.br
```

### 5. Ambiente

```bash
NODE_ENV=production
PORT=3333
LOG_LEVEL=info
```

### 6. Monitoramento (OPCIONAL)

```bash
# Sentry para monitoramento de erros (opcional)
SENTRY_DSN=https://sua-chave@sentry.io/seu-projeto
```

## Como Fazer o Deploy

### Primeira vez (Setup Inicial)

1. **Criar novo projeto na Railway**
   - Conecte seu repositório GitHub
   - Selecione a pasta `backend`

2. **Adicionar PostgreSQL**
   - No painel da Railway, clique em "New"
   - Selecione "Database" → "PostgreSQL"
   - A Railway criará automaticamente a variável `DATABASE_URL`

3. **Configurar variáveis de ambiente**
   - Vá em "Variables" no painel do projeto
   - Adicione todas as variáveis listadas acima

4. **Deploy automático**
   - A Railway fará build e deploy automaticamente
   - O script `railway-migrate.js` criará os schemas automaticamente
   - As migrations do TypeORM serão executadas

5. **Popular dados iniciais** (IMPORTANTE)

   Após o primeiro deploy bem-sucedido, você precisa popular o banco com dados iniciais.

   Execute os comandos abaixo no terminal da Railway (Railway CLI ou via SSH):

   ```bash
   # Criar usuário admin
   npm run seed:admin

   # Popular áreas de atuação
   npm run seed:areas
   ```

### Deploys subsequentes

A Railway faz deploy automático a cada push no branch configurado (geralmente `main` ou `master`).

## Estrutura do Banco de Dados

O sistema usa **3 schemas PostgreSQL** no mesmo database:

- `vagas` - Sistema de vagas e candidaturas
- `noticias` - Sistema de notícias
- `public` - Tabelas comuns (notificações, auditoria)

## Troubleshooting

### Erro: "database does not exist"

✅ **RESOLVIDO** - O script `railway-migrate.js` cria os schemas automaticamente.

Se ainda assim ocorrer erro:
1. Verifique se a `DATABASE_URL` está configurada
2. Verifique os logs: `railway logs`
3. Execute manualmente: `railway run npm run railway:migrate`

### Erro: "role does not exist"

Isso indica que o usuário do PostgreSQL não foi criado. Normalmente a Railway cuida disso automaticamente.

Verifique se a `DATABASE_URL` está correta no painel da Railway.

### Erro de conexão SSL

O script já está configurado para aceitar SSL da Railway:
```javascript
ssl: {
  rejectUnauthorized: false
}
```

### Erro nas migrations

Se as migrations falharem:
1. Verifique os logs: `railway logs`
2. Conecte no banco via Railway CLI: `railway connect postgres`
3. Verifique se os schemas foram criados: `\dn`

## Comandos Úteis (Railway CLI)

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Fazer login
railway login

# Ver logs em tempo real
railway logs

# Executar comando no ambiente Railway
railway run npm run seed:admin

# Conectar ao PostgreSQL
railway connect postgres

# Abrir painel no navegador
railway open
```

## Monitoramento

Após o deploy, monitore:

1. **Logs da aplicação**
   ```bash
   railway logs
   ```

2. **Status do PostgreSQL**
   - Painel da Railway > Database > Metrics

3. **Sentry** (se configurado)
   - Erros em tempo real
   - Performance monitoring

## Próximos Passos

Após deploy bem-sucedido:

1. ✅ Testar login com usuário admin
2. ✅ Verificar endpoints da API
3. ✅ Testar envio de e-mails
4. ✅ Configurar domínio customizado (opcional)
5. ✅ Configurar backups do PostgreSQL

## Suporte

Em caso de problemas, verifique:
- Logs da Railway: `railway logs`
- Variáveis de ambiente configuradas
- Status do PostgreSQL no painel
- Documentação: https://docs.railway.app/
