import { createConnection } from "typeorm";
import { hash } from "bcryptjs";

async function resetPassword() {
    console.log("🔑 Iniciando reset de senha do admin...");

    const connection = await createConnection();

    try {
        const email = "aisam@aisam.com.br";
        const senha = "ind@2025#";

        // Verificar se o admin existe
        const adminExists = await connection.query(
            "SELECT id, nome, email FROM vagas.admin_aisam WHERE email = $1",
            [email]
        );

        if (adminExists.length === 0) {
            console.log("❌ Usuário admin não encontrado!");
            return;
        }

        console.log("✅ Admin encontrado:", adminExists[0]);

        // Hash da nova senha
        const senhaHash = await hash(senha, 8);

        console.log("🔐 Hash gerado:", senhaHash.substring(0, 20) + "...");

        // Atualizar senha
        await connection.query(
            `UPDATE vagas.admin_aisam
             SET senha = $1, updated_at = NOW()
             WHERE email = $2`,
            [senhaHash, email]
        );

        console.log("✅ Senha do admin resetada com sucesso!");
        console.log(`📧 Email: ${email}`);
        console.log(`🔑 Senha: ${senha}`);

        // Verificar a atualização
        const updatedAdmin = await connection.query(
            "SELECT id, nome, email, created_at, updated_at FROM vagas.admin_aisam WHERE email = $1",
            [email]
        );

        console.log("📝 Admin atualizado:", updatedAdmin[0]);
    } catch (error) {
        console.error("❌ Erro ao resetar senha:", error);
    } finally {
        await connection.close();
    }
}

resetPassword();
