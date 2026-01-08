#!/usr/bin/env node

/**
 * Script para configurar variáveis de ambiente na Railway
 * A Railway fornece DATABASE_URL, mas precisamos extrair as partes separadas
 */

const url = require('url');

// Obtém a DATABASE_URL da Railway
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ DATABASE_URL não encontrada!');
  console.error('Este script deve ser executado na Railway com PostgreSQL provisionado.');
  process.exit(1);
}

try {
  // Parse da URL do PostgreSQL
  // Formato: postgresql://user:password@host:port/database
  const parsedUrl = new url.URL(databaseUrl);

  const config = {
    DB_HOST: parsedUrl.hostname,
    DB_PORT: parsedUrl.port || '5432',
    DB_USER: parsedUrl.username,
    DB_PASS: parsedUrl.password,
    DB_NAME: parsedUrl.pathname.slice(1), // Remove a barra inicial
  };

  console.log('✅ Configuração de banco de dados extraída com sucesso:');
  console.log(`   Host: ${config.DB_HOST}`);
  console.log(`   Port: ${config.DB_PORT}`);
  console.log(`   User: ${config.DB_USER}`);
  console.log(`   Database: ${config.DB_NAME}`);
  console.log(`   Password: ${'*'.repeat(config.DB_PASS.length)}`);

  // Exporta as variáveis para uso no processo
  process.env.DB_HOST = config.DB_HOST;
  process.env.DB_PORT = config.DB_PORT;
  process.env.DB_USER = config.DB_USER;
  process.env.DB_PASS = config.DB_PASS;
  process.env.DB_NAME = config.DB_NAME;

  console.log('\n✅ Variáveis de ambiente configuradas!');

} catch (error) {
  console.error('❌ Erro ao parsear DATABASE_URL:', error.message);
  process.exit(1);
}
