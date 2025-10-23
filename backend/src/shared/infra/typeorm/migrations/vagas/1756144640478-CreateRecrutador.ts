import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateRecrutador1756144640478 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "recrutador",
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
                    type: "varchar",
                    isUnique: true
                },

                {
                    name: "senha",
                    type: "varchar"
                },

                {
                    name: "perfil",
                    type: "enum",
                    enum: ["recrutador", "admin"]
                },

                {
                    name: "status",
                    type: "enum",
                    enum: ["ativo", "inativo"]
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
                "recrutador",
                new TableForeignKey({
                    name: "FK_RecrutadorAssociado",
                    columnNames: ["associado_id"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "associado",
                    onDelete: "SET NULL",
                    onUpdate: "CASCADE"
                })
            )

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("recrutador");
        await queryRunner.dropForeignKey("recrutador", "FK_RecrutadorAssociado");
    }

}
