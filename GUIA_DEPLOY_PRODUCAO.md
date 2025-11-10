# Guia de Deploy em Produção - AISAM

## Arquitetura de Produção

```
┌─────────────────────────────────────────────────────────────┐
│                    INFRAESTRUTURA                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  aisam.com.br (KingHost)                                   │
│  └─ Frontend Institucional (Vite/React)                    │
│                                                             │
│  vagas.aisam.com.br (KingHost)                            │
│  └─ Frontend-app Admin/Recrutadores (Vite/React)          │
│                                                             │
│  seu-app.herokuapp.com (Heroku - Free Tier)               │
│  └─ Backend API (Node.js/Express/TypeORM)                  │
│                                                             │
│  pgsql.kinghost.net (KingHost)                            │
│  └─ PostgreSQL (3 databases: common, vagas, noticias)     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 1. Configuração do Backend (Heroku)

### 1.1. Criar conta no Heroku
1. Acesse https://heroku.com
2. Crie uma conta gratuita
3. Instale o Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli

### 1.2. Criar aplicação no Heroku
```bash
# Login no Heroku
heroku login

# Navegar para pasta do backend
cd backend

# Criar app (escolha um nome único)
heroku create seu-backend-aisam

# Adicionar buildpack do Node.js
heroku buildpacks:set heroku/nodejs
```

### 1.3. Configurar variáveis de ambiente no Heroku
```bash
# Configurar NODE_ENV
heroku config:set NODE_ENV=production

# Configurar PostgreSQL da KingHost
heroku config:set DB_HOST=pgsql123.kinghost.net
heroku config:set DB_PORT=5432
heroku config:set DB_USER=seu_usuario_kinghost
heroku config:set DB_PASS=sua_senha_kinghost
heroku config:set DB_NAME=aisam_vagas

# Banco comum
heroku config:set DB_COMMON_HOST=pgsql123.kinghost.net
heroku config:set DB_COMMON_PORT=5432
heroku config:set DB_COMMON_USER=seu_usuario_kinghost
heroku config:set DB_COMMON_PASS=sua_senha_kinghost
heroku config:set DB_COMMON_NAME=aisam_common

# Banco de notícias
heroku config:set DB_NOTICIAS_HOST=pgsql123.kinghost.net
heroku config:set DB_NOTICIAS_PORT=5432
heroku config:set DB_NOTICIAS_USER=seu_usuario_kinghost
heroku config:set DB_NOTICIAS_PASS=sua_senha_kinghost
heroku config:set DB_NOTICIAS_NAME=aisam_noticias

# JWT Secret (GERE UMA CHAVE FORTE!)
heroku config:set JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")

# Configuração de Email
heroku config:set MAIL_HOST=mail.aisam.com.br
heroku config:set MAIL_PORT=465
heroku config:set MAIL_USER=vagas@aisam.com.br
heroku config:set MAIL_PASS=sua_senha_email
heroku config:set MAIL_FROM=vagas@aisam.com.br

# URLs dos Frontends
heroku config:set FRONTEND_URL=https://vagas.aisam.com.br
heroku config:set FRONTEND_INSTITUCIONAL_URL=https://aisam.com.br
```

### 1.4. Deploy do Backend
```bash
# Adicionar remote do Heroku (se ainda não adicionou)
git remote add heroku https://git.heroku.com/seu-backend-aisam.git

# Fazer deploy (do backend)
git subtree push --prefix backend heroku main

# OU se estiver na pasta backend:
git push heroku main

# Verificar logs
heroku logs --tail

# Executar migrations
heroku run npm run migration:run:all
```

## 2. Configuração do Frontend Institucional (KingHost)

### 2.1. Preparar build de produção
```bash
cd frontend

# Criar arquivo .env.production
cp .env.production.example .env.production

# Editar .env.production com suas URLs reais:
# VITE_API_URL=https://seu-backend-aisam.herokuapp.com
# VITE_ADMIN_PANEL_URL=https://vagas.aisam.com.br

# Build de produção
npm run build
```

### 2.2. Upload para KingHost
1. Acesse o painel da KingHost
2. Vá em "Gerenciador de Arquivos" ou use FTP
3. Navegue até a pasta `public_html` (ou `www`)
4. Faça upload de todos os arquivos da pasta `dist/`
5. Configure o domínio `aisam.com.br` para apontar para essa pasta

### 2.3. Configurar .htaccess (para SPA)
Crie um arquivo `.htaccess` na pasta `public_html`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## 3. Configuração do Frontend-app (KingHost)

### 3.1. Criar subdomínio na KingHost
1. Painel KingHost → Domínios → Adicionar Subdomínio
2. Criar: `vagas.aisam.com.br`
3. Apontar para uma nova pasta (ex: `/public_html/vagas`)

### 3.2. Preparar build de produção
```bash
cd frontend-app

# Criar arquivo .env.production
cp .env.production.example .env.production

# Editar .env.production com suas URLs reais:
# VITE_API_URL=https://seu-backend-aisam.herokuapp.com
# VITE_PUBLIC_FRONTEND_URL=https://aisam.com.br
# VITE_INSTITUTIONAL_FRONTEND_URL=https://aisam.com.br

# Build de produção
npm run build
```

### 3.3. Upload para KingHost
1. Acesse o Gerenciador de Arquivos
2. Navegue até `/public_html/vagas` (ou a pasta do subdomínio)
3. Faça upload de todos os arquivos da pasta `dist/`
4. Crie arquivo `.htaccess` (mesmo conteúdo do item 2.3)

## 4. Configuração do Banco de Dados (KingHost)

### 4.1. Criar bancos de dados PostgreSQL
No painel da KingHost:
1. Vá em "Banco de Dados" → "PostgreSQL"
2. Crie 3 bancos de dados:
   - `aisam_common` (dados compartilhados: admins, áreas, associados)
   - `aisam_vagas` (vagas, candidaturas, candidatos, recrutadores)
   - `aisam_noticias` (sistema de notícias/blog)
3. Anote o host, porta, usuário e senha

### 4.2. Executar migrations
Use uma ferramenta como pgAdmin ou execute via Heroku:
```bash
# Executar migrations remotamente
heroku run npm run migration:run:all
```

### 4.3. Popular dados iniciais
```bash
# Seeds de áreas de atuação
heroku run npm run seed:areas

# Seed de admin
heroku run npm run seed:admin

# Seed de associados (se tiver)
heroku run npm run seed:associados
```

## 5. Configuração de CORS no Backend

Certifique-se que o backend aceita requisições dos domínios corretos:

Arquivo: `backend/src/shared/infra/http/server.ts`
```typescript
app.use(cors({
  origin: [
    'https://aisam.com.br',
    'https://vagas.aisam.com.br',
    'http://localhost:5173',
    'http://localhost:8080'
  ],
  credentials: true
}));
```

## 6. Checklist Final

### Backend (Heroku)
- [ ] Aplicação criada no Heroku
- [ ] Variáveis de ambiente configuradas
- [ ] Build executado com sucesso
- [ ] Migrations executadas
- [ ] Seeds executados
- [ ] API acessível via HTTPS
- [ ] CORS configurado corretamente

### Frontend Institucional (aisam.com.br)
- [ ] Build de produção gerado
- [ ] Arquivos enviados para KingHost
- [ ] .htaccess configurado
- [ ] Domínio apontando corretamente
- [ ] Site acessível via HTTPS
- [ ] Links para painel admin funcionando

### Frontend-app (vagas.aisam.com.br)
- [ ] Subdomínio criado na KingHost
- [ ] Build de produção gerado
- [ ] Arquivos enviados para KingHost
- [ ] .htaccess configurado
- [ ] Subdomínio acessível via HTTPS
- [ ] Login funcionando
- [ ] Comunicação com backend OK

### Banco de Dados (KingHost)
- [ ] 3 bancos criados
- [ ] Migrations executadas
- [ ] Seeds executados
- [ ] Conexão do Heroku funcionando

## 7. Monitoramento

### Logs do Backend (Heroku)
```bash
# Ver logs em tempo real
heroku logs --tail

# Ver últimas 500 linhas
heroku logs -n 500
```

### Restart do Backend
```bash
# Reiniciar aplicação
heroku restart
```

## 8. Custos

### Heroku (Free Tier)
- **Backend**: Grátis (com limitações)
- **Limitações**:
  - 550-1000 horas/mês grátis
  - App "dorme" após 30min de inatividade
  - Desperta em ~10s na primeira requisição

### KingHost
- **Hospedagem Web**: Conforme plano contratado
- **PostgreSQL**: Incluído no plano
- **Domínio**: Custo anual

### Total Estimado
- **Custo zero** inicial com Heroku Free Tier
- **Apenas custo da KingHost** (hospedagem + domínio)

## 9. Melhorias Futuras

Se houver necessidade de escalar:
1. **Heroku Hobby ($7/mês)**: Remove sleep, mais horas
2. **Railway/Render**: Alternativas ao Heroku
3. **Vercel/Netlify**: Para frontends (mais rápido)
4. **CDN Cloudflare**: Grátis, melhora performance

## 10. Troubleshooting

### Backend não inicia
```bash
heroku logs --tail
# Verificar erros de conexão DB
# Verificar variáveis de ambiente
```

### Frontend com erro 404
- Verificar se .htaccess existe
- Verificar permissões de arquivo
- Limpar cache do navegador

### Erro de CORS
- Verificar origins no backend
- Verificar URLs no .env dos frontends

### Banco não conecta
- Verificar IP liberado na KingHost
- Verificar credenciais
- Testar conexão com pgAdmin

---

**Dúvidas?** Consulte a documentação oficial:
- Heroku: https://devcenter.heroku.com/
- KingHost: https://king.host/wiki/
