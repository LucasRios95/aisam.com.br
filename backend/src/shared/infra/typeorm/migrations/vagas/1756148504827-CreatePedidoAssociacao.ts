import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreatePedidoAssociacao1756148504827 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table(
            {
                name: "pedido_associacao",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true
                    },
                    {
                        name: "razao_social",
                        type: "varchar"
                    },
                    {
                        name: "cnpj",
                        type: "varchar"
                    },

                    {
                        name: "email_corporativo",
                        type: "varchar"
                    },

                    {
                        name: "setor",
                        type: "varchar"
                    },

                    {
                        name: "numero_funcionarios",
                        type: "numeric"
                    },

                    {
                        name: "representante",
                        type: "varchar",
                        isNullable: true
                    },

                    {
                        name: "email_representante",
                        type: "varchar",
                        isNullable: true
                    },

                    {
                        name: "telefone",
                        type: "varchar"
                    },

                    {
                        name: "endereco",
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
                        name: "cep",
                        type: "varchar"
                    },

                    {
                        name: "descricao",
                        type: "text"
                    },

                    {
                        name: "observacao",
                        type: "text",
                        isNullable: true
                    },

                    {
                        name: "status",
                        type: "enum",
                        enum: ["pendente", "aprovado", "recusado"]
                    },

                    {
                        name: "Aprovado_por",
                        type: "uuid",
                        isNullable: true
                    },

                    {
                        name: "Recusado_por",
                        type: "uuid",
                        isNullable: true
                    },

                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()"
                    }
                ]
            }
        ));

        // await queryRunner.createForeignKey(
        //     "pedido_associacao",
        //     new TableForeignKey({
        //         name: "FK_PedidoAssociacaoAprovado",
        //         columnNames: ["Aprovado_por"],
        //         referencedColumnNames: ["id"],
        //         referencedTableName: "admin_aisam",
        //         onDelete: "SET NULL",
        //         onUpdate: "CASCADE"
        //     })
        // )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("pedido_associacao");
        // await queryRunner.dropForeignKey("pedido_associacao", "FK_PedidoAssociacaoAprovado");
    }

}
