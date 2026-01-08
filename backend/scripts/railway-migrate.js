#!/usr/bin/env node

/**
 * Script para executar migrations na Railway
 * Este script cria os schemas necessários e executa as migrations
 */

const { Client } = require('pg');
const url = require('url');

async function runMigrations() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL não encontrada!');
    process.exit(1);
  }

  console.log('🔄 Iniciando setup do banco de dados...\n');

  // Parse da DATABASE_URL
  const parsedUrl = new url.URL(databaseUrl);

  const client = new Client({
    host: parsedUrl.hostname,
    port: parsedUrl.port || 5432,
    user: parsedUrl.username,
    password: parsedUrl.password,
    database: parsedUrl.pathname.slice(1),
    ssl: {
      rejectUnauthorized: false // Railway usa SSL
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

    console.log('\n✅ Schemas criados com sucesso!');
    console.log('\n📝 Próximo passo: as migrations do TypeORM serão executadas automaticamente');

  } catch (error) {
    console.error('❌ Erro durante setup:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();
