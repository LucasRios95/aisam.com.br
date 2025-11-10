#!/usr/bin/env node

/**
 * Gerador de JWT Secret seguro
 * Uso: node scripts/generate-jwt-secret.js
 */

const crypto = require('crypto');

console.log('\n🔐 Gerando JWT Secret seguro...\n');

const secret = crypto.randomBytes(64).toString('hex');

console.log('JWT_SECRET gerado:');
console.log('='.repeat(130));
console.log(secret);
console.log('='.repeat(130));
console.log('\n📋 Copie e cole no arquivo .env.production:');
console.log(`JWT_SECRET=${secret}`);
console.log('\n⚠️  IMPORTANTE: Mantenha este secret em segredo! Nunca comite no Git.\n');
