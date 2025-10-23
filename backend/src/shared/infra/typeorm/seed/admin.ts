import { createConnection } from "typeorm";
import { hash } from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

async function seed() {
    console.log("🌱 Iniciando seed de usuário admin...");

    const connection = await createConnection();

    try {
        const email = "aisam@aisam.com.br";
        const senha = "ind@2025#";
        const nome = "Administrador AISAM";

        // Verificar se o admin já existe
        const adminExists = await connection.query(
            "SELECT id FROM vagas.admin_aisam WHERE email = $1",
            [email]
        );

        if (adminExists.length > 0) {
            console.log("⏭️  Usuário admin já existe!");
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

        console.log("✅ Usuário admin criado com sucesso!");
        console.log(`📧 Email: ${email}`);
        console.log(`🔑 Senha: ${senha}`);
    } catch (error) {
        console.error("❌ Erro ao criar usuário admin:", error);
    } finally {
        await connection.close();
    }
}

seed();
