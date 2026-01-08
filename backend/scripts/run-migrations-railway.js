#!/usr/bin/env node

/**
 * Script para executar migrations na Railway usando DATABASE_URL
 */

const { execSync } = require('child_process');
const url = require('url');

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ DATABASE_URL não encontrada!');
  process.exit(1);
}

console.log('🔄 Executando migrations com DATABASE_URL...\n');

// Parse da DATABASE_URL
const parsedUrl = new url.URL(databaseUrl);

// Configurar variáveis de ambiente para o TypeORM CLI
process.env.DB_HOST = parsedUrl.hostname;
process.env.DB_PORT = parsedUrl.port || '5432';
process.env.DB_USER = parsedUrl.username;
process.env.DB_PASS = parsedUrl.password;
process.env.DB_NAME = parsedUrl.pathname.slice(1);

console.log('✅ Usando database:', process.env.DB_NAME);
console.log('✅ Host:', process.env.DB_HOST);
console.log();

try {
  // Executar migrations do common
  console.log('📦 Executando migrations: common...');
  execSync('npm run migration:run:common', {
    stdio: 'inherit',
    env: process.env
  });

  // Executar migrations do vagas
  console.log('\n📦 Executando migrations: vagas...');
  execSync('npm run migration:run:vagas', {
    stdio: 'inherit',
    env: process.env
  });

  // Executar migrations do noticias
  console.log('\n📦 Executando migrations: noticias...');
  execSync('npm run migration:run:noticias', {
    stdio: 'inherit',
    env: process.env
  });

  console.log('\n✅ Todas as migrations executadas com sucesso!');
} catch (error) {
  console.error('\n❌ Erro ao executar migrations:', error.message);
  process.exit(1);
}
