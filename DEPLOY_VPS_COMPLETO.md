# 🚀 Deploy Completo na VPS KingHost
## Backend + Frontend-app + PostgreSQL tudo na VPS

---

## 📋 Visão Geral da Arquitetura

```
VPS KingHost (Ubuntu 22.04)
├── PostgreSQL (localhost:5432)
├── Backend Node.js (localhost:3333) → PM2
├── Frontend-app (dist/) → Nginx
└── Nginx (Reverse Proxy + Static Files)
    ├── api.aisam.com.br → Backend :3333
    └── vagas.aisam.com.br → Frontend-app (static)
```

**Vantagens:**
- ✅ Tudo em um único servidor
- ✅ Comunicação interna rápida
- ✅ Fácil gerenciamento
- ✅ Custo menor que múltiplos serviços
- ✅ Controle total

---

## 🔧 PARTE 1: PREPARAÇÃO DA VPS

### 1.1 - Acesso Inicial à VPS

```bash
# SSH na VPS
ssh root@seu-ip-vps

# Atualizar sistema
apt update && apt upgrade -y
```

### 1.2 - Criar Usuário para Deploy (Segurança)

```bash
# Criar usuário (não use root em produção)
adduser aisam
usermod -aG sudo aisam

# Trocar para o novo usuário
su - aisam
```

---

## 🗄️ PARTE 2: INSTALAÇÃO DO POSTGRESQL

### 2.1 - Instalar PostgreSQL

```bash
# Instalar PostgreSQL 15
sudo apt install -y postgresql postgresql-contrib

# Verificar status
sudo systemctl status postgresql

# Habilitar start automático
sudo systemctl enable postgresql
```

### 2.2 - Configurar Banco de Dados

```bash
# Acessar PostgreSQL como usuário postgres
sudo -u postgres psql

# No console do PostgreSQL:
```

```sql
-- Criar usuário para a aplicação
CREATE USER aisam_user WITH PASSWORD 'SenhaForteAqui@2025';

-- Criar banco de dados
CREATE DATABASE aisam_vagas OWNER aisam_user;

-- Conectar ao banco
\c aisam_vagas

-- Criar schemas
CREATE SCHEMA IF NOT EXISTS vagas;
CREATE SCHEMA IF NOT EXISTS noticias;

-- Dar permissões
GRANT ALL PRIVILEGES ON SCHEMA vagas TO aisam_user;
GRANT ALL PRIVILEGES ON SCHEMA noticias TO aisam_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO aisam_user;
GRANT ALL PRIVILEGES ON DATABASE aisam_vagas TO aisam_user;

-- Verificar
\l
\dn

-- Sair
\q
```

### 2.3 - Configurar Acesso Local

```bash
# Editar pg_hba.conf para permitir senha
sudo nano /etc/postgresql/15/main/pg_hba.conf

# Alterar esta linha (deve estar perto do final):
# local   all             all                                     peer
# PARA:
local   all             all                                     md5

# Reiniciar PostgreSQL
sudo systemctl restart postgresql
```

### 2.4 - Testar Conexão

```bash
psql -U aisam_user -d aisam_vagas -h localhost
# Digite a senha: SenhaForteAqui@2025
```

---

## 🖥️ PARTE 3: INSTALAÇÃO DO NODE.JS E PM2

### 3.1 - Instalar Node.js 20.x

```bash
# Adicionar repositório NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Instalar Node.js
sudo apt install -y nodejs

# Verificar instalação
node -v  # deve mostrar v20.x.x
npm -v   # deve mostrar 10.x.x
```

### 3.2 - Instalar PM2 (Process Manager)

```bash
sudo npm install -g pm2

# Verificar
pm2 -v
```

---

## 🌐 PARTE 4: INSTALAÇÃO DO NGINX

### 4.1 - Instalar Nginx

```bash
sudo apt install -y nginx

# Verificar status
sudo systemctl status nginx

# Habilitar start automático
sudo systemctl enable nginx
```

### 4.2 - Configurar Firewall

```bash
# Permitir HTTP, HTTPS e SSH
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable

# Verificar
sudo ufw status
```

---

## 📦 PARTE 5: DEPLOY DO BACKEND

### 5.1 - Preparar Diretório

```bash
# Criar estrutura de pastas
sudo mkdir -p /var/www/aisam
sudo chown -R aisam:aisam /var/www/aisam
cd /var/www/aisam
```

### 5.2 - Clonar Repositório

**Opção A: Via Git (Recomendado)**

```bash
cd /var/www/aisam
git clone https://github.com/seu-usuario/aisam-vagas.git backend
cd backend/backend
```

**Opção B: Via SCP (do seu PC local)**

```bash
# No seu PC (Windows - use PowerShell ou Git Bash)
cd C:\Users\lucas\OneDrive\Documentos\aisam.com.br
scp -r backend aisam@seu-ip-vps:/var/www/aisam/

# Na VPS
cd /var/www/aisam/backend
```

### 5.3 - Instalar Dependências

```bash
cd /var/www/aisam/backend
npm install --production
```

### 5.4 - Configurar Variáveis de Ambiente

```bash
# Criar .env
nano .env
```

Adicione:
```env
NODE_ENV=production

# Banco de dados LOCAL (mesmo servidor)
DB_HOST=localhost
DB_PORT=5432
DB_USER=aisam_user
DB_PASS=SenhaForteAqui@2025
DB_NAME=aisam_vagas

# JWT Secret - GERE UM NOVO!
JWT_SECRET=sua-chave-super-secreta-64-caracteres-minimo-aqui

# Email KingHost
MAIL_HOST=mail.aisam.com.br
MAIL_PORT=465
MAIL_USER=vagas@aisam.com.br
MAIL_PASS=senha_do_email
MAIL_FROM=vagas@aisam.com.br

# URLs
FRONTEND_URL=https://vagas.aisam.com.br
API_URL=https://api.aisam.com.br

PORT=3333
```

**Gerar JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 5.5 - Fazer Build do Backend

```bash
cd /var/www/aisam/backend
npm run build
```

### 5.6 - Rodar Migrations e Seeds

```bash
# Migrations
npm run migration:run:all

# Seeds
npm run seed:admin
npm run seed:areas
npm run seed:associados
```

### 5.7 - Iniciar com PM2

```bash
# Iniciar aplicação
pm2 start dist/shared/infra/http/server.js --name aisam-api

# Configurar para iniciar no boot
pm2 startup systemd -u aisam --hp /home/aisam
# Execute o comando que aparecer

# Salvar configuração
pm2 save

# Verificar
pm2 status
pm2 logs aisam-api
```

---

## 🎨 PARTE 6: DEPLOY DO FRONTEND-APP

### 6.1 - Build Local (no seu PC)

```bash
# No seu PC
cd C:\Users\lucas\OneDrive\Documentos\aisam.com.br\frontend-app

# Criar .env.production
echo VITE_API_URL=https://api.aisam.com.br > .env.production
echo VITE_PUBLIC_FRONTEND_URL=https://aisam.com.br >> .env.production

# Build
npm run build
```

### 6.2 - Enviar para VPS

```bash
# No seu PC (PowerShell ou Git Bash)
scp -r dist aisam@seu-ip-vps:/var/www/aisam/frontend-app
```

### 6.3 - Organizar na VPS

```bash
# Na VPS
cd /var/www/aisam
mkdir -p frontend-app
# Arquivos já foram copiados pelo SCP
```

---

## 🌍 PARTE 7: CONFIGURAR NGINX

### 7.1 - Configurar Backend (api.aisam.com.br)

```bash
sudo nano /etc/nginx/sites-available/api.aisam.com.br
```

Adicione:
```nginx
server {
    listen 80;
    server_name api.aisam.com.br;

    # Logs
    access_log /var/log/nginx/api.aisam.access.log;
    error_log /var/log/nginx/api.aisam.error.log;

    # Proxy para Backend Node.js
    location / {
        proxy_pass http://localhost:3333;
        proxy_http_version 1.1;

        # Headers
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

### 7.2 - Configurar Frontend-app (vagas.aisam.com.br)

```bash
sudo nano /etc/nginx/sites-available/vagas.aisam.com.br
```

Adicione:
```nginx
server {
    listen 80;
    server_name vagas.aisam.com.br;

    root /var/www/aisam/frontend-app/dist;
    index index.html;

    # Logs
    access_log /var/log/nginx/vagas.aisam.access.log;
    error_log /var/log/nginx/vagas.aisam.error.log;

    # Compressão Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml+rss;

    # Cache de assets estáticos
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA - Redirecionar tudo para index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Segurança
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### 7.3 - Ativar Sites

```bash
# Criar links simbólicos
sudo ln -s /etc/nginx/sites-available/api.aisam.com.br /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/vagas.aisam.com.br /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Recarregar Nginx
sudo systemctl reload nginx
```

---

## 🔐 PARTE 8: CONFIGURAR SSL (HTTPS) COM CERTBOT

### 8.1 - Instalar Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 8.2 - Obter Certificados SSL

```bash
# Para api.aisam.com.br
sudo certbot --nginx -d api.aisam.com.br

# Para vagas.aisam.com.br
sudo certbot --nginx -d vagas.aisam.com.br
```

Responda às perguntas:
- Email: seu-email@aisam.com.br
- Aceitar termos: Yes
- Compartilhar email: No
- Redirect HTTP para HTTPS: Yes (opção 2)

### 8.3 - Renovação Automática

```bash
# Testar renovação
sudo certbot renew --dry-run

# Já está configurado para renovar automaticamente via cron
```

---

## 📊 PARTE 9: CONFIGURAR DNS NA KINGHOST

### 9.1 - Apontar Subdomínios para VPS

No painel da KingHost:

1. Vá em **Domínios** → **Gerenciar DNS**
2. Adicione registros:

```
Tipo: A
Nome: api
Valor: IP-DA-SUA-VPS
TTL: 3600

Tipo: A
Nome: vagas
Valor: IP-DA-SUA-VPS
TTL: 3600
```

Aguarde propagação (pode levar até 24h, mas geralmente 1-2h).

### 9.2 - Testar Propagação

```bash
# Testar DNS
nslookup api.aisam.com.br
nslookup vagas.aisam.com.br

# Ou
dig api.aisam.com.br
dig vagas.aisam.com.br
```

---

## 🔄 PARTE 10: SCRIPTS DE MANUTENÇÃO

### 10.1 - Script de Atualização

Crie `/var/www/aisam/update.sh`:

```bash
#!/bin/bash

echo "🔄 Atualizando AISAM..."

# Backend
echo "📦 Atualizando Backend..."
cd /var/www/aisam/backend
git pull
npm install --production
npm run build
pm2 restart aisam-api

echo "✅ Atualização concluída!"
pm2 status
```

Tornar executável:
```bash
chmod +x /var/www/aisam/update.sh
```

### 10.2 - Script de Backup

Crie `/var/www/aisam/backup.sh`:

```bash
#!/bin/bash

BACKUP_DIR="/var/backups/aisam"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

echo "💾 Criando backup do banco de dados..."
sudo -u postgres pg_dump aisam_vagas > $BACKUP_DIR/db_$DATE.sql

echo "📦 Compactando..."
gzip $BACKUP_DIR/db_$DATE.sql

# Manter apenas últimos 7 backups
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +7 -delete

echo "✅ Backup concluído: $BACKUP_DIR/db_$DATE.sql.gz"
```

Tornar executável:
```bash
chmod +x /var/www/aisam/backup.sh
```

### 10.3 - Agendar Backup Automático

```bash
# Editar crontab
crontab -e

# Adicionar (backup diário às 3h da manhã)
0 3 * * * /var/www/aisam/backup.sh
```

---

## 🧪 PARTE 11: TESTES E VALIDAÇÃO

### 11.1 - Testar Backend

```bash
# Health check
curl https://api.aisam.com.br/health

# Login
curl -X POST https://api.aisam.com.br/sessions/admin \
  -H "Content-Type: application/json" \
  -d '{"email":"aisam@aisam.com.br","senha":"ind@2025#"}'
```

### 11.2 - Testar Frontend-app

Acesse no navegador:
- https://vagas.aisam.com.br
- Tente fazer login

### 11.3 - Verificar Logs

```bash
# Logs do Backend
pm2 logs aisam-api

# Logs do Nginx
sudo tail -f /var/log/nginx/api.aisam.access.log
sudo tail -f /var/log/nginx/vagas.aisam.access.log
```

---

## 📊 PARTE 12: MONITORAMENTO

### 12.1 - PM2 Monitoring

```bash
# Instalar PM2 Plus (opcional)
pm2 install pm2-logrotate

# Configurar rotação de logs
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 12.2 - Status do Sistema

```bash
# Ver uso de recursos
pm2 monit

# Status dos serviços
sudo systemctl status postgresql
sudo systemctl status nginx
pm2 status
```

---

## 🔒 PARTE 13: HARDENING DE SEGURANÇA

### 13.1 - Firewall

```bash
# Configurar UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Verificar
sudo ufw status
```

### 13.2 - Fail2ban (Proteção contra brute force)

```bash
# Instalar
sudo apt install -y fail2ban

# Configurar
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 13.3 - Desabilitar Login Root via SSH

```bash
sudo nano /etc/ssh/sshd_config

# Alterar:
PermitRootLogin no

# Reiniciar SSH
sudo systemctl restart ssh
```

---

## 📝 CHECKLIST FINAL

- [ ] VPS acessível via SSH
- [ ] PostgreSQL instalado e rodando
- [ ] Banco aisam_vagas criado
- [ ] Schemas (vagas, noticias, public) criados
- [ ] Migrations executadas
- [ ] Seeds executados (admin, áreas, associados)
- [ ] Node.js 20.x instalado
- [ ] PM2 instalado
- [ ] Backend deployado em /var/www/aisam/backend
- [ ] Backend rodando via PM2
- [ ] Nginx instalado e configurado
- [ ] Frontend-app em /var/www/aisam/frontend-app/dist
- [ ] DNS apontando para VPS (api e vagas)
- [ ] SSL/HTTPS configurado (Certbot)
- [ ] Firewall configurado
- [ ] Backup automático configurado
- [ ] Testes realizados

---

## 🚀 COMANDOS ÚTEIS

```bash
# Reiniciar tudo
pm2 restart aisam-api
sudo systemctl restart nginx
sudo systemctl restart postgresql

# Ver logs
pm2 logs aisam-api
sudo tail -f /var/log/nginx/error.log

# Status
pm2 status
sudo systemctl status nginx
sudo systemctl status postgresql

# Backup manual
/var/www/aisam/backup.sh

# Atualizar aplicação
/var/www/aisam/update.sh
```

---

## 📊 CUSTOS ESTIMADOS

**VPS KingHost:**
- VPS-1: ~R$ 79/mês (2GB RAM, 50GB SSD) ✅ Suficiente
- VPS-2: ~R$ 149/mês (4GB RAM, 80GB SSD) - Recomendado para produção

**Total:** ~R$ 149/mês (tudo incluído!)

---

## 🆘 TROUBLESHOOTING

### Backend não inicia
```bash
pm2 logs aisam-api
# Verificar erro de conexão com banco
# Verificar variáveis .env
```

### Erro de conexão com PostgreSQL
```bash
# Testar conexão
psql -U aisam_user -d aisam_vagas -h localhost

# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql
```

### Nginx retorna 502
```bash
# Backend não está rodando
pm2 status
pm2 restart aisam-api

# Verificar logs
sudo tail -f /var/log/nginx/error.log
```

### SSL não funciona
```bash
# Renovar certificado
sudo certbot renew

# Verificar configuração
sudo nginx -t
```

---

## 🎉 SUCESSO!

Agora você tem:
- ✅ Backend Node.js rodando
- ✅ Frontend-app servido pelo Nginx
- ✅ PostgreSQL local
- ✅ SSL/HTTPS ativo
- ✅ Backup automático
- ✅ Tudo em uma VPS!

**Sua aplicação está 100% na VPS e no ar!** 🚀
