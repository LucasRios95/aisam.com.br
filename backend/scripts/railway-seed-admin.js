require('dotenv').config();
const { createConnection } = require('typeorm');
const { hash } = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function seed() {
    console.log('🌱 Iniciando seed de usuário admin...');

    let connection;
    try {
        // Configuração da conexão usando DATABASE_URL
        connection = await createConnection({
            name: 'default',
            type: 'postgres',
            url: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            },
            synchronize: false,
            logging: false
        });

        const email = 'aisam@aisam.com.br';
        const senha = 'ind@2025#';
        const nome = 'Administrador AISAM';

        // Verificar se o admin já existe
        const adminExists = await connection.query(
            'SELECT id FROM vagas.admin_aisam WHERE email = $1',
            [email]
        );

        if (adminExists.length > 0) {
            console.log('⏭️  Usuário admin já existe!');
            return;
        }

        // Hash da senha
        const senhaHash = await hash(senha, 8);

        // Inserir admin
        await connection.query(
            `INSERT INTO vagas.admin_aisam (id, nome, email, senha, mfa_enabled, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
            [uuidv4(), nome, email, senhaHash, false]
        );

        console.log('✅ Usuário admin criado com sucesso!');
        console.log(`📧 Email: ${email}`);
        console.log(`🔑 Senha: ${senha}`);
    } catch (error) {
        console.error('❌ Erro ao criar usuário admin:', error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.close();
        }
        process.exit(0);
    }
}

seed();
