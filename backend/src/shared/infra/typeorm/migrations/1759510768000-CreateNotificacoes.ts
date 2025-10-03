import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateNotificacoes1759510768000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "notificacoes",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true
                },

                {
                    name: "destinatario_id",
                    type: "uuid"
                },

                {
                    name: "tipo",
                    type: "enum",
                    enum: ["candidatura", "vaga", "sistema", "email"]
                },

                {
                    name: "titulo",
                    type: "varchar"
                },

                {
                    name: "mensagem",
                    type: "text"
                },

                {
                    name: "lida",
                    type: "boolean",
                    default: false
                },

                {
                    name: "metadata",
                    type: "jsonb",
                    isNullable: true
                },

                {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()"
                },

                {
                    name: "updated_at",
                    type: "timestamp",
                    default: "now()"
                }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("notificacoes");
    }

}
