# 🚀 Guia de Deploy - AISAM na KingHost

## 📋 Estrutura do Deploy

```
aisam.com.br (frontend institucional - JÁ ESTÁ NO AR) ✅
├── vagas.aisam.com.br (frontend-app - sistema de vagas) 🆕
├── api.aisam.com.br (backend Node.js) 🆕
└── PostgreSQL Database (KingHost) 🆕
```

---

## 🗂️ PARTE 1: PREPARAÇÃO DO BANCO DE DADOS POSTGRESQL

### 1.1 - Criar Banco de Dados na KingHost

1. Acesse o **Painel KingHost**
2. Vá em **Bancos de Dados** → **PostgreSQL**
3. Clique em **Criar Novo Banco**
4. Configure:
   - **Nome do Banco**: `aisam_vagas`
   - **Usuário**: (será criado automaticamente ou use existente)
   - **Senha**: (anote essa senha!)
   - **Host**: (anote o host fornecido, algo como `pgsql123.kinghost.net`)

### 1.2 - Conectar ao Banco via Terminal/Cliente

Use um cliente PostgreSQL (DBeaver, pgAdmin, ou terminal):

```bash
# Exemplo de conexão
psql -h pgsql123.kinghost.net -U seu_usuario -d aisam_vagas
```

### 1.3 - Criar os Schemas

Execute no banco:

```sql
-- Criar os 3 schemas necessários
CREATE SCHEMA IF NOT EXISTS vagas;
CREATE SCHEMA IF NOT EXISTS noticias;
-- O schema public já existe por padrão

-- Verificar
\dn
```

### 1.4 - Rodar as Migrations

No seu ambiente **local**, configure temporariamente o `.env` do backend para apontar para o banco da KingHost:

```env
DB_HOST=pgsql123.kinghost.net
DB_PORT=5432
DB_USER=seu_usuario_kinghost
DB_PASS=sua_senha_kinghost
DB_NAME=aisam_vagas
```

Depois execute:

```bash
cd backend
npm run migration:run:all
```

Isso criará todas as tabelas necessárias nos 3 schemas.

### 1.5 - Rodar os Seeds (Dados Iniciais)

Ainda com o `.env` apontando para o banco da KingHost:

```bash
# Seed do Admin
npm run seed:admin

# Seed das Áreas de Atuação
npm run seed:areas

# Seed dos Associados e Recrutadores
npm run seed:associados
```

---

## 🖥️ PARTE 2: DEPLOY DO BACKEND (Node.js)

A KingHost não oferece hospedagem Node.js nativa. Você tem **3 opções**:

### **OPÇÃO A: VPS KingHost (Recomendado)** ⭐

1. Contrate um **VPS KingHost** (Virtual Private Server)
2. Instale Node.js, PM2 e Nginx
3. Configure domínio `api.aisam.com.br`

#### Passos:

**2.1 - Acessar VPS via SSH**
```bash
ssh root@seu-vps-ip
```

**2.2 - Instalar Node.js**
```bash
# Instalar Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar
node -v
npm -v
```

**2.3 - Instalar PM2 (Process Manager)**
```bash
sudo npm install -g pm2
```

**2.4 - Preparar o Backend**

No seu computador local:

```bash
cd backend

# Criar arquivo .env de produção
cp .env.example .env.production
```

Edite `.env.production`:
```env
NODE_ENV=production

# Banco KingHost
DB_HOST=pgsql123.kinghost.net
DB_PORT=5432
DB_USER=seu_usuario_kinghost
DB_PASS=sua_senha_kinghost
DB_NAME=aisam_vagas

# JWT Secret (gere um novo!)
JWT_SECRET=seu-jwt-secret-super-forte-aqui

# Email KingHost
MAIL_HOST=mail.aisam.com.br
MAIL_PORT=465
MAIL_USER=vagas@aisam.com.br
MAIL_PASS=senha_do_email
MAIL_FROM=vagas@aisam.com.br

# URLs
FRONTEND_URL=https://vagas.aisam.com.br
API_URL=https://api.aisam.com.br
```

**2.5 - Fazer Build do Backend**
```bash
cd backend
npm run build
```

**2.6 - Enviar para o VPS**

Opção 1 - Via Git (recomendado):
```bash
# No VPS
cd /var/www
git clone seu-repositorio aisam-backend
cd aisam-backend/backend
npm install --production
```

Opção 2 - Via SCP:
```bash
# No seu PC
scp -r backend root@seu-vps-ip:/var/www/aisam-backend
```

**2.7 - Configurar PM2**

No VPS:
```bash
cd /var/www/aisam-backend/backend

# Copiar .env de produção
cp .env.production .env

# Iniciar com PM2
pm2 start dist/shared/infra/http/server.js --name aisam-api

# Configurar para iniciar no boot
pm2 startup
pm2 save

# Ver logs
pm2 logs aisam-api
```

**2.8 - Configurar Nginx como Reverse Proxy**

```bash
sudo nano /etc/nginx/sites-available/api.aisam.com.br
```

Adicione:
```nginx
server {
    listen 80;
    server_name api.aisam.com.br;

    location / {
        proxy_pass http://localhost:3333;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Ativar:
```bash
sudo ln -s /etc/nginx/sites-available/api.aisam.com.br /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**2.9 - Configurar SSL (Certbot)**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.aisam.com.br
```

---

### **OPÇÃO B: Heroku** (Mais Fácil)

1. Crie conta no Heroku
2. Instale Heroku CLI
3. Deploy:

```bash
cd backend
heroku create aisam-api
heroku addons:create heroku-postgresql:mini
git push heroku main
```

---

### **OPÇÃO C: Servidor Node.js de Terceiros**

Use serviços como:
- Railway.app
- Render.com
- DigitalOcean App Platform

---

## 🎨 PARTE 3: DEPLOY DO FRONTEND-APP (vagas.aisam.com.br)

### 3.1 - Preparar o Build

No seu PC:

```bash
cd frontend-app

# Criar .env de produção
echo "VITE_API_URL=https://api.aisam.com.br" > .env.production
echo "VITE_PUBLIC_FRONTEND_URL=https://vagas.aisam.com.br" >> .env.production

# Build
npm run build
```

Isso cria a pasta `dist/` com arquivos otimizados.

### 3.2 - Criar Subdomínio na KingHost

1. Acesse **Painel KingHost**
2. Vá em **Domínios** → **Subdomínios**
3. Crie: `vagas.aisam.com.br`
4. Aponte para uma pasta (ex: `public_html/vagas`)

### 3.3 - Enviar Arquivos via FTP

1. Conecte via **FileZilla** (ou cliente FTP da KingHost)
   - Host: `ftp.aisam.com.br`
   - Usuário: seu usuário FTP
   - Senha: sua senha FTP

2. Navegue até `/public_html/vagas/`

3. Envie **TODO** o conteúdo da pasta `frontend-app/dist/`:
   ```
   dist/
   ├── index.html
   ├── assets/
   │   ├── index-xxx.js
   │   ├── index-xxx.css
   │   └── ...
   └── ...
   ```

### 3.4 - Configurar .htaccess (SPA Routing)

Crie um arquivo `.htaccess` em `/public_html/vagas/`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Habilitar compressão
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Cache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/pdf "access plus 1 month"
  ExpiresByType image/x-icon "access plus 1 year"
</IfModule>
```

---

## 🔐 PARTE 4: CONFIGURAÇÕES DE SEGURANÇA

### 4.1 - Variáveis de Ambiente Seguras

**NUNCA** comite arquivos `.env` no Git!

Gere um JWT Secret forte:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4.2 - CORS

No backend (`backend/src/shared/infra/http/app.ts`), configure CORS:

```typescript
app.use(cors({
  origin: [
    'https://aisam.com.br',
    'https://www.aisam.com.br',
    'https://vagas.aisam.com.br'
  ],
  credentials: true
}));
```

### 4.3 - SSL/HTTPS

- Frontend institucional e vagas: KingHost já fornece SSL gratuito
- Backend (VPS): Use Certbot (veja seção 2.9)

---

## 📊 PARTE 5: MONITORAMENTO E LOGS

### 5.1 - PM2 Logs (Backend)

```bash
# Ver logs em tempo real
pm2 logs aisam-api

# Ver status
pm2 status

# Reiniciar
pm2 restart aisam-api
```

### 5.2 - Sentry (Opcional)

Configure Sentry para monitoramento de erros:

1. Crie conta em https://sentry.io
2. Adicione DSN no `.env`:
```env
SENTRY_DSN=sua-dsn-aqui
```

---

## 🧪 PARTE 6: TESTES PÓS-DEPLOY

### 6.1 - Checklist

- [ ] Banco de dados acessível
- [ ] Migrations rodadas
- [ ] Seeds executados
- [ ] Backend respondendo em `https://api.aisam.com.br/health`
- [ ] Frontend-app acessível em `https://vagas.aisam.com.br`
- [ ] Login funcionando
- [ ] CORS configurado corretamente
- [ ] Emails sendo enviados
- [ ] SSL ativo em todos os domínios

### 6.2 - Testar API

```bash
# Health check
curl https://api.aisam.com.br/health

# Login admin
curl -X POST https://api.aisam.com.br/sessions/admin \
  -H "Content-Type: application/json" \
  -d '{"email":"aisam@aisam.com.br","senha":"ind@2025#"}'
```

---

## 📝 PARTE 7: SCRIPT DE DEPLOY AUTOMATIZADO

Crie um arquivo `deploy.sh` na raiz do projeto:

```bash
#!/bin/bash

echo "🚀 Iniciando deploy..."

# Backend
echo "📦 Building backend..."
cd backend
npm run build

echo "🚢 Deploying backend to VPS..."
scp -r dist/ root@seu-vps-ip:/var/www/aisam-backend/backend/
ssh root@seu-vps-ip "cd /var/www/aisam-backend/backend && pm2 restart aisam-api"

# Frontend-app
echo "📦 Building frontend-app..."
cd ../frontend-app
npm run build

echo "🚢 Deploying frontend-app to KingHost..."
# Configure seu FTP aqui ou use lftp/ncftpput
# lftp -c "open -u usuario,senha ftp.aisam.com.br; mirror -R dist/ /public_html/vagas/"

echo "✅ Deploy concluído!"
```

---

## 🔄 PARTE 8: MANUTENÇÃO E UPDATES

### Atualizar Backend
```bash
# No VPS
cd /var/www/aisam-backend/backend
git pull
npm install --production
npm run build
pm2 restart aisam-api
```

### Atualizar Frontend-app
```bash
# No seu PC
cd frontend-app
npm run build
# Upload via FTP para /public_html/vagas/
```

---

## 🆘 TROUBLESHOOTING

### Erro de CORS
- Verifique se as URLs no CORS do backend incluem `https://vagas.aisam.com.br`
- Verifique se o `.env` do frontend-app tem a URL correta da API

### Backend não inicia
- Verifique logs: `pm2 logs aisam-api`
- Verifique conexão com banco: teste com `psql`
- Verifique variáveis de ambiente

### Frontend não carrega
- Verifique se `.htaccess` está configurado
- Verifique console do navegador (F12)
- Verifique se `VITE_API_URL` aponta para `https://api.aisam.com.br`

---

## 📞 SUPORTE KINGHOST

- Telefone: 0800 000 0
- Chat: painel.kinghost.com.br
- Email: suporte@kinghost.net

---

## ✅ CHECKLIST FINAL

- [ ] PostgreSQL criado e configurado
- [ ] Migrations executadas
- [ ] Seeds executados (admin, áreas, associados)
- [ ] Backend no ar (VPS/Heroku)
- [ ] API acessível via `api.aisam.com.br`
- [ ] Frontend-app no ar via `vagas.aisam.com.br`
- [ ] .htaccess configurado para SPA
- [ ] SSL ativo em todos os domínios
- [ ] CORS configurado
- [ ] Email SMTP testado
- [ ] PM2 configurado para autostart
- [ ] Backup do banco configurado

---

**🎉 Parabéns! Seu sistema AISAM está no ar!**

Para suporte adicional, consulte a documentação em `backend/references/README.md`
