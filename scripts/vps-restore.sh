#!/bin/bash

# ============================================
# Script de Restauração de Backup
# Uso: ./restore.sh db_20250110_030000.sql.gz
# ============================================

set -e

BACKUP_DIR="/var/backups/aisam"
DB_NAME="aisam_vagas"

if [ -z "$1" ]; then
    echo "❌ Uso: $0 <arquivo_backup.sql.gz>"
    echo ""
    echo "📋 Backups disponíveis:"
    ls -lh $BACKUP_DIR/db_*.sql.gz
    exit 1
fi

BACKUP_FILE="$BACKUP_DIR/$1"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Arquivo não encontrado: $BACKUP_FILE"
    exit 1
fi

echo "⚠️  ATENÇÃO: Esta operação irá SUBSTITUIR o banco de dados atual!"
echo "Backup a ser restaurado: $1"
echo ""
read -p "Tem certeza que deseja continuar? (digite 'SIM' para confirmar): " CONFIRM

if [ "$CONFIRM" != "SIM" ]; then
    echo "❌ Operação cancelada"
    exit 0
fi

echo ""
echo "🔄 Iniciando restauração..."

# Parar aplicação
echo "⏸️  Parando aplicação..."
pm2 stop aisam-api

# Descomprimir
echo "📦 Descomprimindo backup..."
gunzip -c $BACKUP_FILE > /tmp/restore.sql

# Dropar e recriar banco
echo "🗄️  Recriando banco de dados..."
sudo -u postgres psql << EOF
DROP DATABASE IF EXISTS $DB_NAME;
CREATE DATABASE $DB_NAME;
EOF

# Restaurar
echo "📥 Restaurando backup..."
sudo -u postgres psql $DB_NAME < /tmp/restore.sql

# Limpar arquivo temporário
rm /tmp/restore.sql

# Reiniciar aplicação
echo "▶️  Reiniciando aplicação..."
pm2 restart aisam-api

echo ""
echo "✅ Restauração concluída com sucesso!"
echo ""
echo "Comandos úteis:"
echo "  pm2 logs aisam-api  - Verificar logs"
echo "  pm2 status          - Verificar status"
