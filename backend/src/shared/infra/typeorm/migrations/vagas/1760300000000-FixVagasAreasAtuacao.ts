import { MigrationInterface, QueryRunner } from "typeorm";

export class FixVagasAreasAtuacao1760300000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Verificar se a coluna existe e está com tipo incorreto
        // Se necessário, recriar a coluna com tipo correto

        // PostgreSQL: simple-array do TypeORM usa TEXT com vírgulas, NÃO array nativo
        // Apenas garantir que é TEXT (não precisa alterar se já está correto)

        // Verificar tipo atual
        const result = await queryRunner.query(`
            SELECT data_type
            FROM information_schema.columns
            WHERE table_schema = 'vagas'
            AND table_name = 'vagas'
            AND column_name = 'areas_atuacao'
        `);

        // Se for ARRAY, converter para TEXT
        if (result[0] && result[0].data_type === 'ARRAY') {
            await queryRunner.query(`
                ALTER TABLE vagas.vagas
                ALTER COLUMN areas_atuacao TYPE text
                USING array_to_string(areas_atuacao, ',')
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Não reverter para não quebrar dados existentes
    }
}
