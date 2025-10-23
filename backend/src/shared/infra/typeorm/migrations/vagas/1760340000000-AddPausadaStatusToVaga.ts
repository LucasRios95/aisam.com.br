import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPausadaStatusToVaga1760340000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Primeiro, obter o nome do tipo enum existente
        const result = await queryRunner.query(`
            SELECT udt_name
            FROM information_schema.columns
            WHERE table_schema = 'vagas'
            AND table_name = 'vagas'
            AND column_name = 'status';
        `);

        if (result && result[0] && result[0].udt_name) {
            const enumTypeName = result[0].udt_name;

            // Adicionar o valor 'pausada' ao enum existente
            await queryRunner.query(`
                ALTER TYPE vagas.${enumTypeName} ADD VALUE IF NOT EXISTS 'pausada';
            `);
        } else {
            throw new Error("Não foi possível encontrar o tipo enum da coluna status");
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Nota: PostgreSQL não permite remover valores de um enum facilmente
        // Seria necessário recriar o enum, o que pode ser complexo
        // Por segurança, deixamos o rollback vazio
        console.log("Rollback não implementado: PostgreSQL não permite remover valores de enum facilmente");
    }
}
