import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddMissingFieldsToCandidato1760200000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Adicionar areas_atuacao como text (TypeORM simple-array armazena como text com vírgulas)
        await queryRunner.addColumn("vagas.candidato", new TableColumn({
            name: "areas_atuacao",
            type: "text",
            isNullable: true
        }));

        // Adicionar curriculo_url
        await queryRunner.addColumn("vagas.candidato", new TableColumn({
            name: "curriculo_url",
            type: "varchar",
            isNullable: true
        }));

        // Adicionar curriculo_upload_date
        await queryRunner.addColumn("vagas.candidato", new TableColumn({
            name: "curriculo_upload_date",
            type: "timestamp",
            isNullable: true
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("vagas.candidato", "curriculo_upload_date");
        await queryRunner.dropColumn("vagas.candidato", "curriculo_url");
        await queryRunner.dropColumn("vagas.candidato", "areas_atuacao");
    }
}
