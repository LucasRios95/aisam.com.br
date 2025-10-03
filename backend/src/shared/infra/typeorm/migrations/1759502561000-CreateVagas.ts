import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateVagas1759502561000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "vagas",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true
                },

                {
                    name: "titulo",
                    type: "varchar"
                },

                {
                    name: "descricao",
                    type: "text"
                },

                {
                    name: "senioridade",
                    type: "enum",
                    enum: ["estagio", "junior", "pleno", "senior", "especialista"]
                },

                {
                    name: "areas_atuacao",
                    type: "text",
                    isArray: true
                },

                {
                    name: "regime",
                    type: "enum",
                    enum: ["presencial", "hibrido", "remoto"]
                },

                {
                    name: "localidade",
                    type: "varchar"
                },

                {
                    name: "email_contato",
                    type: "varchar"
                },

                {
                    name: "empresa_anonima",
                    type: "boolean",
                    default: false
                },

                {
                    name: "status",
                    type: "enum",
                    enum: ["aberta", "fechada", "arquivada"],
                    default: "'aberta'"
                },

                {
                    name: "recrutador_id",
                    type: "uuid"
                },

                {
                    name: "associado_id",
                    type: "uuid",
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
        })),

            await queryRunner.createForeignKey(
                "vagas",
                new TableForeignKey({
                    name: "FK_VagaRecrutador",
                    columnNames: ["recrutador_id"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "recrutador",
                    onDelete: "CASCADE",
                    onUpdate: "CASCADE"
                })
            ),

            await queryRunner.createForeignKey(
                "vagas",
                new TableForeignKey({
                    name: "FK_VagaAssociado",
                    columnNames: ["associado_id"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "associado",
                    onDelete: "SET NULL",
                    onUpdate: "CASCADE"
                })
            )

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("vagas", "FK_VagaAssociado");
        await queryRunner.dropForeignKey("vagas", "FK_VagaRecrutador");
        await queryRunner.dropTable("vagas");
    }

}
