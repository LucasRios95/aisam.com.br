import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAssociado1756138593853 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "associado",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                },

                {
                    name: "razao_social",
                    type: "varchar",
                },

                {
                    name: "cnpj",
                    type: "varchar",
                    isUnique: true
                },

                {
                    name: "status",
                    type: "enum",
                    enum: ["pendente", "aprovado", "recusado"]
                },

                {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()"
                }
            ]

        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("associado")
    }
}
