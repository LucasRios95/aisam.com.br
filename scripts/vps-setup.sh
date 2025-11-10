#!/bin/bash

# ============================================
# Script de Setup Inicial da VPS
# Execute este script após o primeiro acesso
# ============================================

set -e

echo "🚀 Iniciando configuração da VPS AISAM..."

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Atualizar sistema
echo -e "${BLUE}📦 Atualizando sistema...${NC}"
sudo apt update && sudo apt upgrade -y

# Instalar PostgreSQL
echo -e "${BLUE}🗄️  Instalando PostgreSQL...${NC}"
sudo apt install -y postgresql postgresql-contrib

# Instalar Node.js 20.x
echo -e "${BLUE}🟢 Instalando Node.js 20.x...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PM2
echo -e "${BLUE}📊 Instalando PM2...${NC}"
sudo npm install -g pm2

# Instalar Nginx
echo -e "${BLUE}🌐 Instalando Nginx...${NC}"
sudo apt install -y nginx

# Instalar Certbot
echo -e "${BLUE}🔐 Instalando Certbot...${NC}"
sudo apt install -y certbot python3-certbot-nginx

# Instalar ferramentas úteis
echo -e "${BLUE}🛠️  Instalando ferramentas...${NC}"
sudo apt install -y git curl wget htop vim ufw fail2ban

# Configurar firewall
echo -e "${BLUE}🔥 Configurando firewall...${NC}"
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Criar estrutura de diretórios
echo -e "${BLUE}📁 Criando estrutura de diretórios...${NC}"
sudo mkdir -p /var/www/aisam
sudo mkdir -p /var/backups/aisam
sudo chown -R $USER:$USER /var/www/aisam

# Verificar instalações
echo ""
echo -e "${GREEN}✅ Verificando instalações:${NC}"
echo "Node.js: $(node -v)"
echo "npm: $(npm -v)"
echo "PM2: $(pm2 -v)"
echo "PostgreSQL: $(psql --version)"
echo "Nginx: $(nginx -v 2>&1)"
echo "Git: $(git --version)"

echo ""
echo -e "${GREEN}🎉 Setup inicial concluído!${NC}"
echo ""
echo "Próximos passos:"
echo "1. Configurar PostgreSQL (execute: sudo -u postgres psql)"
echo "2. Fazer deploy do backend"
echo "3. Fazer deploy do frontend-app"
echo "4. Configurar Nginx"
echo "5. Configurar SSL com Certbot"
