import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedAdminUser1760500000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Importações dinâmicas para evitar problemas de compilação
        const bcryptjs = await import('bcryptjs');
        const uuid = await import('uuid');

        const email = "aisam@aisam.com.br";
        const senha = "ind@2025#";
        const nome = "Administrador AISAM";

        // Hash da senha
        const senhaHash = await bcryptjs.hash(senha, 8);
        const id = uuid.v4();

        // Inserir admin (ON CONFLICT DO NOTHING para idempotência)
        await queryRunner.query(
            `INSERT INTO vagas.admin_aisam (id, nome, email, senha, mfa_enabled, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
             ON CONFLICT (email) DO NOTHING`,
            [id, nome, email, senhaHash, false]
        );

        console.log('✅ Usuário admin criado/verificado com sucesso');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Rollback: remover o usuário admin criado por esta migration
        await queryRunner.query(
            `DELETE FROM vagas.admin_aisam WHERE email = $1`,
            ["aisam@aisam.com.br"]
        );

        console.log('⏮️  Usuário admin removido');
    }
}
