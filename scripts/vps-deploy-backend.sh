#!/bin/bash

# ============================================
# Script de Deploy do Backend na VPS
# Execute na VPS após git clone
# ============================================

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

BACKEND_DIR="/var/www/aisam/backend"

echo "🚀 Deploy do Backend AISAM"
echo ""

# Verificar se está no diretório correto
if [ ! -d "$BACKEND_DIR" ]; then
    echo -e "${YELLOW}⚠️  Diretório $BACKEND_DIR não encontrado!${NC}"
    echo "Execute primeiro: cd /var/www/aisam && git clone seu-repositorio backend"
    exit 1
fi

cd $BACKEND_DIR

# Instalar dependências
echo -e "${BLUE}📦 Instalando dependências...${NC}"
npm install --production

# Verificar .env
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Arquivo .env não encontrado!${NC}"
    echo "Crie o arquivo .env antes de continuar"
    exit 1
fi

# Build
echo -e "${BLUE}🔨 Building backend...${NC}"
npm run build

# Rodar migrations (perguntar antes)
read -p "Deseja rodar as migrations? (s/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo -e "${BLUE}🗄️  Rodando migrations...${NC}"
    npm run migration:run:all
fi

# Rodar seeds (perguntar antes)
read -p "Deseja rodar os seeds (admin, áreas, associados)? (s/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo -e "${BLUE}🌱 Rodando seeds...${NC}"
    npm run seed:admin
    npm run seed:areas
    npm run seed:associados
fi

# PM2
echo -e "${BLUE}🔄 Configurando PM2...${NC}"

# Parar se já estiver rodando
pm2 delete aisam-api 2>/dev/null || true

# Iniciar
pm2 start dist/shared/infra/http/server.js --name aisam-api

# Configurar startup
pm2 startup systemd -u $USER --hp $HOME
pm2 save

echo ""
echo -e "${GREEN}✅ Backend deployado com sucesso!${NC}"
echo ""
echo "Comandos úteis:"
echo "  pm2 status           - Ver status"
echo "  pm2 logs aisam-api   - Ver logs"
echo "  pm2 restart aisam-api - Reiniciar"
echo "  pm2 monit            - Monitorar recursos"
