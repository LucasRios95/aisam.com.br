import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDefaultsToRecrutador1760330000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Adicionar default 'recrutador' para perfil
        await queryRunner.query(`
            ALTER TABLE vagas.recrutador
            ALTER COLUMN perfil SET DEFAULT 'recrutador'
        `);

        // Adicionar default 'ativo' para status
        await queryRunner.query(`
            ALTER TABLE vagas.recrutador
            ALTER COLUMN status SET DEFAULT 'ativo'
        `);

        // Atualizar registros existentes com NULL para os valores default
        await queryRunner.query(`
            UPDATE vagas.recrutador
            SET perfil = 'recrutador'
            WHERE perfil IS NULL
        `);

        await queryRunner.query(`
            UPDATE vagas.recrutador
            SET status = 'ativo'
            WHERE status IS NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE vagas.recrutador
            ALTER COLUMN perfil DROP DEFAULT
        `);

        await queryRunner.query(`
            ALTER TABLE vagas.recrutador
            ALTER COLUMN status DROP DEFAULT
        `);
    }
}
