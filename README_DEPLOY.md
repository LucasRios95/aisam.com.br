# 🚀 Guias de Deploy - AISAM

## 📚 Documentação Disponível

### 🎯 **RECOMENDADO: Deploy Completo na VPS**
**Arquivo**: [DEPLOY_VPS_COMPLETO.md](DEPLOY_VPS_COMPLETO.md)

Deploy de **tudo** em uma única VPS:
- ✅ Backend Node.js
- ✅ Frontend-app (vagas.aisam.com.br)
- ✅ PostgreSQL
- ✅ Nginx (reverse proxy + static files)
- ✅ SSL/HTTPS com Certbot

**Custo**: ~R$ 149/mês (VPS-2 da KingHost)

---

### 🔀 **Alternativa: Deploy Híbrido**
**Arquivo**: [DEPLOY_KINGHOST.md](DEPLOY_KINGHOST.md)

Opções múltiplas:
- Backend: VPS, Heroku, ou outros
- Frontend-app: KingHost (via FTP)
- PostgreSQL: KingHost ou VPS

---

## ⚡ Quick Start - VPS

### 1️⃣ Preparar VPS
```bash
# Conectar via SSH
ssh root@seu-ip-vps

# Executar setup automático
bash <(curl -s https://raw.githubusercontent.com/seu-repo/scripts/vps-setup.sh)
```

### 2️⃣ Configurar PostgreSQL
```bash
sudo -u postgres psql
# Execute os comandos do arquivo: scripts/setup-database-production.sql
```

### 3️⃣ Deploy Backend
```bash
cd /var/www/aisam
git clone seu-repositorio backend
cd backend
# Criar .env (use backend/.env.production.example como base)
bash ../scripts/vps-deploy-backend.sh
```

### 4️⃣ Deploy Frontend-app
```bash
# No seu PC, fazer build
cd frontend-app
npm run build

# Enviar para VPS
scp -r dist usuario@seu-ip-vps:/var/www/aisam/frontend-app/
```

### 5️⃣ Configurar Nginx
```bash
# Copiar configs (veja DEPLOY_VPS_COMPLETO.md seção 7)
sudo nano /etc/nginx/sites-available/api.aisam.com.br
sudo nano /etc/nginx/sites-available/vagas.aisam.com.br

# Ativar sites
sudo ln -s /etc/nginx/sites-available/api.aisam.com.br /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/vagas.aisam.com.br /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6️⃣ Configurar SSL
```bash
sudo certbot --nginx -d api.aisam.com.br
sudo certbot --nginx -d vagas.aisam.com.br
```

---

## 🛠️ Scripts Auxiliares

### Geração de Segredos
```bash
# Gerar JWT Secret
node scripts/generate-jwt-secret.js
```

### Build Completo
```bash
# Build de todos os projetos
bash scripts/build-all.sh
```

### Backup (VPS)
```bash
# Backup manual
bash /var/www/aisam/scripts/vps-backup.sh

# Configurar backup automático (crontab)
crontab -e
# Adicionar: 0 3 * * * /var/www/aisam/scripts/vps-backup.sh
```

### Restauração (VPS)
```bash
# Listar backups
ls -lh /var/backups/aisam/

# Restaurar
bash /var/www/aisam/scripts/vps-restore.sh db_20250110_030000.sql.gz
```

---

## 📋 Arquivos de Configuração

| Arquivo | Descrição |
|---------|-----------|
| `backend/.env.production.example` | Template de variáveis de ambiente do backend |
| `frontend-app/.env.production.example` | Template de variáveis do frontend-app |
| `scripts/setup-database-production.sql` | SQL para criar schemas no PostgreSQL |
| `scripts/vps-setup.sh` | Setup inicial da VPS (instala tudo) |
| `scripts/vps-deploy-backend.sh` | Deploy automático do backend |
| `scripts/vps-backup.sh` | Backup automático |
| `scripts/vps-restore.sh` | Restauração de backup |
| `scripts/generate-jwt-secret.js` | Gerador de JWT Secret |

---

## 🌐 Estrutura de URLs

```
https://aisam.com.br                  → Frontend institucional (já no ar)
https://vagas.aisam.com.br            → Frontend-app (sistema de vagas)
https://api.aisam.com.br              → Backend API
```

---

## 🔐 Credenciais Padrão (após seeds)

### Admin AISAM
- Email: `aisam@aisam.com.br`
- Senha: `ind@2025#`

### Recrutadores (33 criados)
- Email: (conforme planilha de associados)
- Senha: `aisam@2025`

---

## 📊 Requisitos da VPS

### Mínimo (desenvolvimento/testes)
- 2GB RAM
- 50GB SSD
- 1 vCPU

### Recomendado (produção)
- **4GB RAM** ✅
- **80GB SSD** ✅
- 2 vCPUs

**VPS KingHost VPS-2**: ~R$ 149/mês

---

## 🆘 Troubleshooting

### Backend não inicia
```bash
pm2 logs aisam-api
# Verificar .env
# Verificar conexão com PostgreSQL
```

### Frontend retorna 404
```bash
# Verificar se arquivos estão em /var/www/aisam/frontend-app/dist
ls -la /var/www/aisam/frontend-app/dist

# Verificar configuração do Nginx
sudo nginx -t
```

### Erro de CORS
```bash
# Editar backend/src/shared/infra/http/app.ts
# Adicionar domínio no CORS:
# origin: ['https://vagas.aisam.com.br', ...]
```

### SSL não funciona
```bash
# Renovar certificado
sudo certbot renew

# Verificar status
sudo certbot certificates
```

---

## 📞 Suporte

### KingHost
- Painel: https://painel.kinghost.com.br
- Telefone: 0800 000 0000
- Email: suporte@kinghost.net

### Documentação
- Deploy VPS Completo: [DEPLOY_VPS_COMPLETO.md](DEPLOY_VPS_COMPLETO.md)
- Deploy Híbrido: [DEPLOY_KINGHOST.md](DEPLOY_KINGHOST.md)
- Requisitos do Sistema: [backend/references/README.md](backend/references/README.md)

---

## ✅ Checklist de Deploy

- [ ] VPS contratada e acessível
- [ ] PostgreSQL instalado e configurado
- [ ] Node.js 20.x instalado
- [ ] PM2 instalado
- [ ] Nginx instalado
- [ ] Banco de dados criado
- [ ] Schemas criados (vagas, noticias, public)
- [ ] Migrations executadas
- [ ] Seeds executados
- [ ] Backend deployado e rodando (PM2)
- [ ] Frontend-app deployado
- [ ] DNS configurado (api e vagas)
- [ ] Nginx configurado (reverse proxy + static)
- [ ] SSL/HTTPS ativo (Certbot)
- [ ] Firewall configurado (UFW)
- [ ] Backup automático configurado
- [ ] Testes realizados

---

## 🎉 Pronto!

Escolha o guia que preferir e siga o passo-a-passo.

**Recomendação**: Use o [DEPLOY_VPS_COMPLETO.md](DEPLOY_VPS_COMPLETO.md) para ter tudo em um único servidor, mais simples de gerenciar!
