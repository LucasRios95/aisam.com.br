# 🚀 Guia de Deploy - AISAM API

Este documento contém as instruções para configurar e fazer deploy da API do AISAM em produção (vagas.aisam.com.br).

## 📋 Pré-requisitos

- Servidor com Docker e Docker Compose instalados
- Acesso SSH ao servidor de produção
- Conta no GitHub com acesso ao repositório
- Banco de dados PostgreSQL configurado

## 🔧 Configuração do GitHub Actions

### Secrets Necessários

Configure os seguintes secrets no GitHub (Settings → Secrets and variables → Actions → New repository secret):

#### Docker Registry
```
DOCKER_REGISTRY=registry.example.com
DOCKER_USERNAME=seu-usuario
DOCKER_PASSWORD=sua-senha
```

#### Servidor de Produção
```
PRODUCTION_HOST=vagas.aisam.com.br
PRODUCTION_USER=ubuntu
PRODUCTION_SSH_KEY=<conteúdo-da-chave-privada-ssh>
PRODUCTION_PORT=22
```

#### Monitoramento (Opcional)
```
CODECOV_TOKEN=<token-do-codecov>
SNYK_TOKEN=<token-do-snyk>
```

## 🐳 Configuração do Servidor

### 1. Preparar o servidor

```bash
# Conectar ao servidor
ssh usuario@vagas.aisam.com.br

# Instalar Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Criar diretório da aplicação
sudo mkdir -p /var/www/aisam-api
sudo chown $USER:$USER /var/www/aisam-api
cd /var/www/aisam-api
```

### 2. Criar arquivo .env.production

```bash
nano /var/www/aisam-api/.env.production
```

Conteúdo do arquivo:

```env
# AMBIENTE
NODE_ENV=production

# BANCO DE DADOS
DB_HOST=postgres
DB_PORT=5432
DB_USER=aisam_user
DB_PASS=senha-super-segura-aqui
DB_NAME=database_aisam

# JWT
JWT_SECRET=gerar-com-comando-abaixo

# EMAIL
MAIL_HOST=smtp.aisam.com.br
MAIL_PORT=465
MAIL_USER=vagas@aisam.com.br
MAIL_PASS=senha-email-aqui
MAIL_FROM=vagas@aisam.com.br

# URLs
FRONTEND_URL=https://vagas.aisam.com.br
API_URL=https://api.vagas.aisam.com.br

# SENTRY (opcional)
SENTRY_DSN=https://sua-chave@sentry.io/projeto

# LOG
LOG_LEVEL=info
```

**Gerar JWT_SECRET seguro:**

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Copiar docker-compose.prod.yml

```bash
# Copiar do repositório ou criar manualmente
nano /var/www/aisam-api/docker-compose.prod.yml
```

### 4. Configurar Nginx como reverse proxy

```bash
sudo apt install nginx

sudo nano /etc/nginx/sites-available/aisam-api
```

Conteúdo:

```nginx
server {
    listen 80;
    server_name api.vagas.aisam.com.br;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.vagas.aisam.com.br;

    # SSL Certificate (usar Certbot)
    ssl_certificate /etc/letsencrypt/live/api.vagas.aisam.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.vagas.aisam.com.br/privkey.pem;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Logs
    access_log /var/log/nginx/aisam-api-access.log;
    error_log /var/log/nginx/aisam-api-error.log;

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req zone=api_limit burst=20 nodelay;

    # Proxy to Docker
    location / {
        proxy_pass http://localhost:3333;
        proxy_http_version 1.1;
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

    # Health check endpoint (sem rate limit)
    location /health {
        proxy_pass http://localhost:3333/health;
        access_log off;
    }

    # Static files
    location /files/ {
        proxy_pass http://localhost:3333/files/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Ativar site:

```bash
sudo ln -s /etc/nginx/sites-available/aisam-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Configurar SSL com Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.vagas.aisam.com.br
```

## 🔄 Deploy Manual (Primeira vez)

```bash
cd /var/www/aisam-api

# Pull da imagem Docker
docker-compose -f docker-compose.prod.yml pull

# Iniciar containers
docker-compose -f docker-compose.prod.yml up -d

# Executar migrações
docker-compose -f docker-compose.prod.yml exec api npm run migration:run:all

# Criar admin padrão
docker-compose -f docker-compose.prod.yml exec api npm run seed:admin

# Criar áreas de atuação
docker-compose -f docker-compose.prod.yml exec api npm run seed:areas

# Verificar logs
docker-compose -f docker-compose.prod.yml logs -f api
```

## 📊 Monitoramento

### Logs

```bash
# Logs da aplicação
docker-compose -f docker-compose.prod.yml logs -f api

# Logs do Nginx
sudo tail -f /var/log/nginx/aisam-api-access.log
sudo tail -f /var/log/nginx/aisam-api-error.log

# Logs dentro do container
docker-compose -f docker-compose.prod.yml exec api tail -f logs/combined.log
docker-compose -f docker-compose.prod.yml exec api tail -f logs/error.log
```

### Health Check

```bash
curl https://api.vagas.aisam.com.br/health
```

### Verificar status dos containers

```bash
docker-compose -f docker-compose.prod.yml ps
```

## 🔧 Manutenção

### Atualizar aplicação

```bash
cd /var/www/aisam-api
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.prod.yml exec api npm run migration:run:all
```

### Backup do banco de dados

```bash
# Backup
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U aisam_user database_aisam > backup-$(date +%Y%m%d).sql

# Restore
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U aisam_user database_aisam < backup.sql
```

### Limpar logs antigos

```bash
# Limpar logs Docker
docker system prune -f

# Limpar logs da aplicação (manter últimos 7 dias)
find /var/www/aisam-api/logs -name "*.log" -mtime +7 -delete
```

## 🚨 Troubleshooting

### Container não inicia

```bash
docker-compose -f docker-compose.prod.yml logs api
docker-compose -f docker-compose.prod.yml restart api
```

### Banco de dados não conecta

```bash
docker-compose -f docker-compose.prod.yml exec postgres psql -U aisam_user -d database_aisam
```

### Erro nas migrações

```bash
# Reverter última migração
docker-compose -f docker-compose.prod.yml exec api npm run migration:revert:vagas

# Ver status das migrações
docker-compose -f docker-compose.prod.yml exec api npm run migration:show:vagas
```

### Alta utilização de memória

```bash
# Verificar uso de recursos
docker stats

# Reiniciar container
docker-compose -f docker-compose.prod.yml restart api
```

## 📱 Rollback

Se algo der errado após deploy:

```bash
# Ver imagens anteriores
docker images | grep aisam-api

# Voltar para versão anterior
docker-compose -f docker-compose.prod.yml down
docker tag aisam-api:sha-anterior aisam-api:latest
docker-compose -f docker-compose.prod.yml up -d
```

## 🔐 Segurança

### Checklist de Segurança

- [ ] Firewall configurado (apenas portas 22, 80, 443 abertas)
- [ ] SSH com chave pública (senha desabilitada)
- [ ] Certificado SSL válido
- [ ] Secrets do GitHub protegidos
- [ ] Banco de dados com senha forte
- [ ] Backups automáticos configurados
- [ ] Monitoramento ativo (Sentry)
- [ ] Rate limiting ativo
- [ ] CORS configurado corretamente

## 📞 Suporte

Em caso de problemas:

1. Verificar logs (`docker-compose logs`)
2. Verificar health check (`/health`)
3. Verificar Sentry para erros
4. Contatar equipe de desenvolvimento

---

**Última atualização:** 2025-10-22
