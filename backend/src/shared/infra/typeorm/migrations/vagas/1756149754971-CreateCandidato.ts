import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCandidato1756149754971 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "candidato",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true
                },

                {
                    name: "nome",
                    type: "varchar"
                },

                {
                    name: "email",
                    type: "varchar"

                },

                {
                    name: "telefone",
                    type: "varchar"
                },

                {
                    name: "cidade",
                    type: "varchar"
                },

                {
                    name: "estado",
                    type: "varchar"
                },

                {
                    name: "resumo_curriculo",
                    type: "text"
                },

                {
                    name: "consentimento_dados",
                    type: "boolean",
                    default: false
                },

                {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()"

                },

                {
                    name: "acesso_expirado",
                    type: "timestamp",
                },

                {
                    name: "updated_at",
                    type: "timestamp",
                    default: "now()"
                },
            ]

        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("candidato");
    }

}
