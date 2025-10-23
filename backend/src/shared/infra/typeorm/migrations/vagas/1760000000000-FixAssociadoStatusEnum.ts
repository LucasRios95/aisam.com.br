import { MigrationInterface, QueryRunner } from "typeorm";

export class FixAssociadoStatusEnum1760000000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Alterar o tipo da coluna status temporariamente para varchar
        await queryRunner.query(`
            ALTER TABLE vagas.associado
            ALTER COLUMN status TYPE varchar
        `);

        // Dropar o tipo enum antigo
        await queryRunner.query(`
            DROP TYPE IF EXISTS vagas.associado_status_enum
        `);

        // Criar o novo tipo enum com os valores corretos
        await queryRunner.query(`
            CREATE TYPE vagas.associado_status_enum AS ENUM ('ativo', 'inativo')
        `);

        // Alterar a coluna para usar o novo enum
        await queryRunner.query(`
            ALTER TABLE vagas.associado
            ALTER COLUMN status TYPE vagas.associado_status_enum
            USING status::vagas.associado_status_enum
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Alterar o tipo da coluna status temporariamente para varchar
        await queryRunner.query(`
            ALTER TABLE vagas.associado
            ALTER COLUMN status TYPE varchar
        `);

        // Dropar o tipo enum atual
        await queryRunner.query(`
            DROP TYPE IF EXISTS vagas.associado_status_enum
        `);

        // Recriar o tipo enum antigo
        await queryRunner.query(`
            CREATE TYPE vagas.associado_status_enum AS ENUM ('pendente', 'aprovado', 'recusado')
        `);

        // Alterar a coluna para usar o enum antigo
        await queryRunner.query(`
            ALTER TABLE vagas.associado
            ALTER COLUMN status TYPE vagas.associado_status_enum
            USING status::vagas.associado_status_enum
        `);
    }
}
