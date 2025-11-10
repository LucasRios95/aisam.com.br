#!/bin/bash

# ============================================
# Script de Backup Automático
# Adicionar ao crontab: 0 3 * * * /var/www/aisam/scripts/backup.sh
# ============================================

BACKUP_DIR="/var/backups/aisam"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="aisam_vagas"
RETENTION_DAYS=7

echo "💾 Iniciando backup do AISAM..."

# Criar diretório se não existir
mkdir -p $BACKUP_DIR

# Backup do banco de dados
echo "📊 Backup do PostgreSQL..."
sudo -u postgres pg_dump $DB_NAME > $BACKUP_DIR/db_$DATE.sql

if [ $? -eq 0 ]; then
    echo "✅ Backup do banco criado: db_$DATE.sql"

    # Comprimir
    gzip $BACKUP_DIR/db_$DATE.sql
    echo "📦 Arquivo comprimido: db_$DATE.sql.gz"
else
    echo "❌ Erro ao criar backup do banco!"
    exit 1
fi

# Backup dos arquivos da aplicação
echo "📁 Backup dos arquivos..."
tar -czf $BACKUP_DIR/files_$DATE.tar.gz \
    /var/www/aisam/backend/.env \
    /var/www/aisam/backend/package.json

echo "✅ Backup dos arquivos criado: files_$DATE.tar.gz"

# Limpar backups antigos
echo "🗑️  Removendo backups com mais de $RETENTION_DAYS dias..."
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "files_*.tar.gz" -mtime +$RETENTION_DAYS -delete

# Listar backups existentes
echo ""
echo "📋 Backups existentes:"
ls -lh $BACKUP_DIR/*.gz

# Calcular espaço usado
SPACE_USED=$(du -sh $BACKUP_DIR | cut -f1)
echo ""
echo "💽 Espaço usado: $SPACE_USED"

echo ""
echo "✅ Backup concluído com sucesso!"
