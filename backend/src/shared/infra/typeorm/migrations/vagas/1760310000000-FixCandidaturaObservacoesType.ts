import { MigrationInterface, QueryRunner } from "typeorm";

export class FixCandidaturaObservacoesType1760310000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Alterar observacoes_recrutador de VARCHAR para TEXT
        await queryRunner.query(`
            ALTER TABLE vagas.candidaturas
            ALTER COLUMN observacoes_recrutador TYPE text
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE vagas.candidaturas
            ALTER COLUMN observacoes_recrutador TYPE varchar
        `);
    }
}
