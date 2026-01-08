#!/usr/bin/env node

/**
 * Script de inicialização para Railway
 * Extrai variáveis da DATABASE_URL, cria schemas e inicia o servidor
 */

const { Client } = require('pg');
const url = require('url');
const { spawn } = require('child_process');

async function setup() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL não encontrada!');
    process.exit(1);
  }

  console.log('🔄 Iniciando setup do banco de dados...\n');

  // Parse da DATABASE_URL
  const parsedUrl = new url.URL(databaseUrl);

  // Extrair e setar variáveis de ambiente para o processo atual e filho
  process.env.DB_HOST = parsedUrl.hostname;
  process.env.DB_PORT = parsedUrl.port || '5432';
  process.env.DB_USER = parsedUrl.username;
  process.env.DB_PASS = parsedUrl.password;
  process.env.DB_NAME = parsedUrl.pathname.slice(1);

  console.log('✅ Variáveis de ambiente configuradas:');
  console.log(`   DB_HOST: ${process.env.DB_HOST}`);
  console.log(`   DB_PORT: ${process.env.DB_PORT}`);
  console.log(`   DB_USER: ${process.env.DB_USER}`);
  console.log(`   DB_NAME: ${process.env.DB_NAME}`);
  console.log(`   DB_PASS: ${'*'.repeat(process.env.DB_PASS.length)}\n`);

  const client = new Client({
    host: parsedUrl.hostname,
    port: parsedUrl.port || 5432,
    user: parsedUrl.username,
    password: parsedUrl.password,
    database: parsedUrl.pathname.slice(1),
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('✅ Conectado ao banco de dados');

    // Criar schemas necessários
    console.log('\n🔄 Criando schemas...');

    await client.query('CREATE SCHEMA IF NOT EXISTS vagas');
    console.log('  ✅ Schema "vagas" criado/verificado');

    await client.query('CREATE SCHEMA IF NOT EXISTS noticias');
    console.log('  ✅ Schema "noticias" criado/verificado');

    await client.query('CREATE SCHEMA IF NOT EXISTS public');
    console.log('  ✅ Schema "public" criado/verificado');

    console.log('\n✅ Schemas criados com sucesso!\n');

  } catch (error) {
    console.error('❌ Erro durante setup:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }

  // Iniciar o servidor com as variáveis de ambiente configuradas
  console.log('🚀 Iniciando servidor...\n');

  const server = spawn('node', ['dist/shared/infra/http/server.js'], {
    stdio: 'inherit',
    env: process.env
  });

  server.on('exit', (code) => {
    process.exit(code);
  });
}

setup().catch((error) => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
