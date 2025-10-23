import { MigrationInterface, QueryRunner } from "typeorm";

export class FixVagaLocalidadeNullable1760320000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Garantir que localidade permite NULL
        await queryRunner.query(`
            ALTER TABLE vagas.vagas
            ALTER COLUMN localidade DROP NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE vagas.vagas
            ALTER COLUMN localidade SET NOT NULL
        `);
    }
}
