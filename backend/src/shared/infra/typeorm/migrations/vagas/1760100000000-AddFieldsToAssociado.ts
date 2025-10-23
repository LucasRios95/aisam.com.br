import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddFieldsToAssociado1760100000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Adicionar updated_at primeiro
        await queryRunner.addColumn("vagas.associado", new TableColumn({
            name: "updated_at",
            type: "timestamp",
            default: "now()"
        }));

        // Adicionar nome_fantasia
        await queryRunner.addColumn("vagas.associado", new TableColumn({
            name: "nome_fantasia",
            type: "varchar",
            isNullable: true
        }));

        // Adicionar email
        await queryRunner.addColumn("vagas.associado", new TableColumn({
            name: "email",
            type: "varchar",
        }));

        // Adicionar telefone
        await queryRunner.addColumn("vagas.associado", new TableColumn({
            name: "telefone",
            type: "varchar",
            isNullable: true
        }));

        // Adicionar endereco
        await queryRunner.addColumn("vagas.associado", new TableColumn({
            name: "endereco",
            type: "varchar",
            isNullable: true
        }));

        // Adicionar cidade
        await queryRunner.addColumn("vagas.associado", new TableColumn({
            name: "cidade",
            type: "varchar",
            isNullable: true
        }));

        // Adicionar estado
        await queryRunner.addColumn("vagas.associado", new TableColumn({
            name: "estado",
            type: "varchar",
            isNullable: true
        }));

        // Adicionar cep
        await queryRunner.addColumn("vagas.associado", new TableColumn({
            name: "cep",
            type: "varchar",
            isNullable: true
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("vagas.associado", "cep");
        await queryRunner.dropColumn("vagas.associado", "estado");
        await queryRunner.dropColumn("vagas.associado", "cidade");
        await queryRunner.dropColumn("vagas.associado", "endereco");
        await queryRunner.dropColumn("vagas.associado", "telefone");
        await queryRunner.dropColumn("vagas.associado", "email");
        await queryRunner.dropColumn("vagas.associado", "nome_fantasia");
        await queryRunner.dropColumn("vagas.associado", "updated_at");
    }
}
