import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateCandidaturas1759507537000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "candidaturas",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true
                },

                {
                    name: "mensagem",
                    type: "text",
                    isNullable: true
                },

                {
                    name: "status",
                    type: "enum",
                    enum: ["pendente", "em_analise", "aceita", "recusada", "cancelada"],
                    default: "'pendente'"
                },

                {
                    name: "observacoes_recrutador",
                    type: "varchar",
                    isNullable: true
                },

                {
                    name: "candidato_id",
                    type: "uuid"
                },

                {
                    name: "vaga_id",
                    type: "uuid"
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
                "candidaturas",
                new TableForeignKey({
                    name: "FK_CandidaturaCandidato",
                    columnNames: ["candidato_id"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "candidato",
                    onDelete: "CASCADE",
                    onUpdate: "CASCADE"
                })
            ),

            await queryRunner.createForeignKey(
                "candidaturas",
                new TableForeignKey({
                    name: "FK_CandidaturaVaga",
                    columnNames: ["vaga_id"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "vagas",
                    onDelete: "CASCADE",
                    onUpdate: "CASCADE"
                })
            )

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("candidaturas", "FK_CandidaturaVaga");
        await queryRunner.dropForeignKey("candidaturas", "FK_CandidaturaCandidato");
        await queryRunner.dropTable("candidaturas");
    }

}
