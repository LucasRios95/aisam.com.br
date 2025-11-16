# Guia de Deploy - Kinghost + Railway

Este guia descreve o processo completo de deploy da aplicação AISAM com a seguinte arquitetura:

- **Frontend Institucional** (`aisam.com.br`) → Kinghost
- **Frontend Admin/Recrutador** (`vagas.aisam.com.br`) → Kinghost
- **Backend API + PostgreSQL** → Railway

---

## Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Configuração do Backend na Railway](#1-configuração-do-backend-na-railway)
3. [Configuração dos Frontends na Kinghost](#2-configuração-dos-frontends-na-kinghost)
4. [Configuração de DNS e SSL](#3-configuração-de-dns-e-ssl)
5. [Testes e Validação](#4-testes-e-validação)
6. [Manutenção e Monitoramento](#5-manutenção-e-monitoramento)
7. [Troubleshooting](#6-troubleshooting)

---

## Pré-requisitos

### Contas Necessárias

- [ ] Conta Railway (https://railway.app)
- [ ] Conta Kinghost com plano que suporte múltiplos domínios
- [ ] Domínio `aisam.com.br` configurado na Kinghost
- [ ] Acesso ao painel de DNS do domínio

### Ferramentas Locais

```bash
# Node.js 18+ e npm
node --version  # v18 ou superior
npm --version

# Git
git --version
```

---

## 1. Configuração do Backend na Railway

### 1.1. Criar Projeto no Railway

1. Acesse https://railway.app e faça login
2. Clique em **"New Project"**
3. Selecione **"Deploy from GitHub repo"**
4. Conecte seu repositório GitHub (ou faça deploy manual)
5. Selecione a branch `main`

### 1.2. Adicionar PostgreSQL

1. No projeto Railway, clique em **"New"**
2. Selecione **"Database"** → **"Add PostgreSQL"**
3. Aguarde a provisão do banco de dados
4. Anote as credenciais geradas automaticamente

### 1.3. Configurar Variáveis de Ambiente

No painel do Railway, vá em **"Variables"** e adicione:

```bash
# Ambiente
NODE_ENV=production

# PostgreSQL (Railway fornece automaticamente, mas você pode sobrescrever)
# PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE são fornecidos automaticamente

# Configuração dos 3 bancos (usar o mesmo database por enquanto)
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_USER=${{Postgres.PGUSER}}
DB_PASS=${{Postgres.PGPASSWORD}}
DB_NAME_COMMON=${{Postgres.PGDATABASE}}
DB_NAME_VAGAS=${{Postgres.PGDATABASE}}
DB_NAME_NOTICIAS=${{Postgres.PGDATABASE}}

# JWT
JWT_SECRET=sua_chave_secreta_super_segura_aqui_min_32_chars

# CORS - Frontends permitidos
FRONTEND_URL=https://aisam.com.br
FRONTEND_APP_URL=https://vagas.aisam.com.br

# Email (Hostinger SMTP)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=noreply@aisam.com.br
SMTP_PASS=sua_senha_email
SMTP_FROM_NAME=AISAM
SMTP_FROM_EMAIL=noreply@aisam.com.br

# URLs
API_URL=${{RAILWAY_PUBLIC_DOMAIN}}
```

### 1.4. Configurar Build e Deploy

1. No Railway, vá em **"Settings"**
2. Configure:
   - **Root Directory**: `/backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Watch Paths**: `/backend/**`

### 1.5. Deploy do Backend

```bash
# Opção 1: Deploy via GitHub (Recomendado)
# O Railway detecta automaticamente mudanças no repositório

# Opção 2: Deploy via Railway CLI
npm install -g @railway/cli
railway login
railway link
cd backend
railway up
```

### 1.6. Executar Migrations

Após o primeiro deploy, execute as migrations:

```bash
# Via Railway CLI
railway run npm run migration:run:all

# Ou conecte-se ao banco e execute manualmente
railway run npm run typeorm:common migration:run
railway run npm run typeorm:vagas migration:run
railway run npm run typeorm:noticias migration:run
```

### 1.7. Executar Seeds

```bash
# Criar admin padrão
railway run npm run seed:admin

# Criar áreas de atuação
railway run npm run seed:areas

# Criar associados (se tiver)
railway run npm run seed:associados
```

### 1.8. Obter URL do Backend

1. No painel Railway, clique no serviço do backend
2. Vá em **"Settings"** → **"Domains"**
3. Clique em **"Generate Domain"**
4. Anote a URL gerada (ex: `https://seu-projeto.up.railway.app`)

**Opcional**: Configure domínio customizado `api.aisam.com.br`:
1. Em **"Custom Domain"**, adicione `api.aisam.com.br`
2. Copie o registro CNAME fornecido
3. Configure no DNS da Kinghost

---

## 2. Configuração dos Frontends na Kinghost

### 2.1. Preparar Builds Locais

#### Frontend Institucional

```bash
cd frontend

# Criar arquivo .env.production
cat > .env.production << EOF
VITE_API_URL=https://seu-projeto.up.railway.app
VITE_INSTITUTIONAL_FRONTEND_URL=https://aisam.com.br
EOF

# Build
npm install
npm run build

# A pasta dist/ será gerada
```

#### Frontend Admin/Recrutador

```bash
cd frontend-app

# Criar arquivo .env.production
cat > .env.production << EOF
VITE_API_URL=https://seu-projeto.up.railway.app
VITE_INSTITUTIONAL_FRONTEND_URL=https://aisam.com.br
EOF

# Build
npm install
npm run build

# A pasta dist/ será gerada
```

### 2.2. Upload para Kinghost

#### Método 1: FTP (Recomendado)

1. Conecte-se via FTP à Kinghost:
   - Host: `ftp.aisam.com.br`
   - Usuário: seu_usuario
   - Senha: sua_senha
   - Porta: 21

2. **Upload do Frontend Institucional** (`aisam.com.br`):
   ```
   - Navegue até: /public_html/
   - Delete arquivos existentes (exceto .htaccess se houver)
   - Upload todo conteúdo da pasta frontend/dist/
   ```

3. **Upload do Frontend Admin** (`vagas.aisam.com.br`):
   ```
   - Navegue até: /public_html/vagas/ (criar se não existir)
   - Upload todo conteúdo da pasta frontend-app/dist/
   ```

#### Método 2: File Manager (Painel Kinghost)

1. Acesse o painel da Kinghost
2. Vá em **"Gerenciador de Arquivos"**
3. Navegue até `public_html/`
4. Faça upload dos arquivos das pastas `dist/`

### 2.3. Configurar .htaccess (IMPORTANTE)

#### Para o Frontend Institucional (`/public_html/.htaccess`)

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # HTTPS redirect
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

  # SPA routing
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Cache control
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/html "access plus 1 hour"
</IfModule>
```

#### Para o Frontend Admin (`/public_html/vagas/.htaccess`)

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /vagas/

  # HTTPS redirect
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

  # SPA routing
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /vagas/index.html [L]
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Cache control
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/html "access plus 1 hour"
</IfModule>
```

---

## 3. Configuração de DNS e SSL

### 3.1. Configurar Subdomínio `vagas.aisam.com.br`

**Opção A: Via Subdomínio no Painel Kinghost**

1. Acesse o painel Kinghost
2. Vá em **"Domínios"** → **"Subdomínios"**
3. Adicione subdomínio: `vagas`
4. Aponte para a pasta: `/public_html/vagas/`

**Opção B: Via DNS (se gerenciado externamente)**

Adicione registro:
```
Tipo: A
Nome: vagas
Valor: [IP do servidor Kinghost]
TTL: 3600
```

### 3.2. Configurar SSL/HTTPS

1. No painel Kinghost, vá em **"Segurança"** → **"SSL"**
2. Ative SSL gratuito (Let's Encrypt) para:
   - `aisam.com.br`
   - `www.aisam.com.br`
   - `vagas.aisam.com.br`
3. Aguarde propagação (pode levar até 24h)

### 3.3. Configurar Domínio Customizado no Railway (Opcional)

Para usar `api.aisam.com.br`:

1. No Railway, adicione custom domain: `api.aisam.com.br`
2. Railway fornecerá um CNAME
3. No DNS da Kinghost, adicione:
   ```
   Tipo: CNAME
   Nome: api
   Valor: [fornecido pelo Railway]
   TTL: 3600
   ```

---

## 4. Testes e Validação

### 4.1. Testar Backend

```bash
# Health check
curl https://seu-projeto.up.railway.app/

# Testar endpoint de áreas
curl https://seu-projeto.up.railway.app/areas-atuacao

# Testar login admin
curl -X POST https://seu-projeto.up.railway.app/auth/admin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@aisam.com.br","senha":"Admin@123"}'
```

### 4.2. Testar Frontend Institucional

1. Acesse https://aisam.com.br
2. Navegue pelas páginas
3. Verifique se o menu funciona
4. Teste página de vagas
5. Teste página de notícias

### 4.3. Testar Frontend Admin

1. Acesse https://vagas.aisam.com.br
2. Faça login como admin:
   - Email: `admin@aisam.com.br`
   - Senha: `Admin@123` (altere após primeiro login)
3. Teste todas as funcionalidades:
   - Dashboard
   - Criar vaga
   - Criar notícia
   - Gerenciar candidaturas

### 4.4. Testar CORS

Abra o console do navegador (F12) e verifique se não há erros de CORS ao fazer requisições.

---

## 5. Manutenção e Monitoramento

### 5.1. Monitorar Railway

1. Acesse o dashboard Railway
2. Verifique métricas:
   - **Usage**: CPU, RAM, Network
   - **Logs**: Erros e avisos
   - **Deployments**: Status dos deploys

### 5.2. Limites Railway Free Tier

- ✅ 500h/mês de execução
- ✅ 1GB RAM
- ✅ 1GB storage PostgreSQL
- ✅ $5 de crédito/mês

**Atenção**: Se exceder, será cobrado ou o serviço será pausado.

### 5.3. Backups do Banco de Dados

```bash
# Backup manual via Railway CLI
railway run pg_dump -Fc > backup-$(date +%Y%m%d).dump

# Ou configure backups automáticos no Railway (plano pago)
```

### 5.4. Atualizar Aplicação

#### Backend:

```bash
# Via GitHub (deploy automático)
git push origin main

# Ou via Railway CLI
cd backend
railway up
```

#### Frontends:

```bash
# 1. Build local
cd frontend && npm run build
cd frontend-app && npm run build

# 2. Upload via FTP para Kinghost
# (repetir processo da seção 2.2)
```

### 5.5. Logs e Debug

```bash
# Ver logs do backend
railway logs

# Ou em tempo real
railway logs --follow
```

---

## 6. Troubleshooting

### Problema: CORS Error

**Sintoma**: Erro no console do navegador: `CORS policy: No 'Access-Control-Allow-Origin'`

**Solução**:
1. Verifique variáveis `FRONTEND_URL` e `FRONTEND_APP_URL` no Railway
2. Confirme que o backend tem configuração CORS correta em `backend/src/shared/infra/http/app.ts`

### Problema: 404 em rotas do frontend

**Sintoma**: Ao acessar rotas como `/vagas` ou `/noticias`, retorna 404

**Solução**: Verifique se o arquivo `.htaccess` está configurado corretamente (seção 2.3)

### Problema: SSL não funcionando

**Sintoma**: Aviso de "Site não seguro" ou SSL inválido

**Solução**:
1. Aguarde até 24h para propagação do SSL
2. Limpe cache do navegador
3. Verifique no painel Kinghost se SSL está ativo

### Problema: Backend não conecta ao banco

**Sintoma**: Erro 500 ou timeout ao acessar API

**Solução**:
1. Verifique variáveis de ambiente no Railway
2. Confirme que PostgreSQL está rodando
3. Verifique logs: `railway logs`

### Problema: Migrations não rodaram

**Sintoma**: Erro ao acessar endpoints: "relation does not exist"

**Solução**:
```bash
railway run npm run migration:run:all
```

### Problema: Assets não carregam (imagens, CSS, JS)

**Sintoma**: Página sem estilo ou imagens quebradas

**Solução**:
1. Verifique se todos os arquivos da pasta `dist/` foram enviados
2. Confirme permissões dos arquivos no servidor (644 para arquivos, 755 para pastas)
3. Verifique o caminho base no `vite.config.ts`

---

## Checklist Final de Deploy

### Backend (Railway)
- [ ] PostgreSQL provisionado
- [ ] Variáveis de ambiente configuradas
- [ ] Backend deployado com sucesso
- [ ] Migrations executadas
- [ ] Seeds executados (admin, áreas)
- [ ] URL pública funcionando
- [ ] CORS configurado

### Frontend Institucional (Kinghost)
- [ ] Build gerado com variáveis corretas
- [ ] Upload para `/public_html/` completo
- [ ] `.htaccess` configurado
- [ ] SSL ativo para `aisam.com.br`
- [ ] Redirecionamento HTTPS funcionando
- [ ] Todas as rotas funcionando (SPA)

### Frontend Admin (Kinghost)
- [ ] Build gerado com variáveis corretas
- [ ] Upload para `/public_html/vagas/` completo
- [ ] `.htaccess` configurado
- [ ] SSL ativo para `vagas.aisam.com.br`
- [ ] Login funcionando
- [ ] Todas as funcionalidades testadas

### Testes Integrados
- [ ] Login admin funciona
- [ ] Cadastro de vagas funciona
- [ ] Cadastro de notícias funciona
- [ ] Listagem de vagas públicas funciona
- [ ] Listagem de notícias funciona
- [ ] E-mails estão sendo enviados
- [ ] Não há erros de CORS
- [ ] Performance aceitável (< 3s carregamento)

---

## Informações de Acesso (Pós-Deploy)

### URLs da Aplicação

- **Site Institucional**: https://aisam.com.br
- **Painel Admin/Recrutador**: https://vagas.aisam.com.br
- **API Backend**: https://seu-projeto.up.railway.app (ou https://api.aisam.com.br)

### Credenciais Padrão (ALTERAR APÓS PRIMEIRO ACESSO)

**Admin:**
- Email: `admin@aisam.com.br`
- Senha: `Admin@123`

**Banco de Dados:**
- Acesse via Railway dashboard ou Railway CLI

---

## Suporte e Contatos

- **Railway Docs**: https://docs.railway.app
- **Kinghost Suporte**: https://suporte.kinghost.com.br
- **Vite Docs**: https://vitejs.dev/guide/build.html

---

## Estimativa de Custos Mensal

| Serviço | Plano | Custo Estimado |
|---------|-------|----------------|
| Kinghost | Hospedagem compartilhada | R$ 20-40/mês |
| Railway | Hobby (recomendado) | $5-10/mês (~R$ 25-50) |
| **Total** | | **R$ 45-90/mês** |

---

**Última atualização**: Novembro 2024
**Versão**: 1.0
