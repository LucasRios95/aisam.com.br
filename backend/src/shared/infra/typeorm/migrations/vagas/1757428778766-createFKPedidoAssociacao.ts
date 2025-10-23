import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class createFKPedidoAssociacao1757428778766 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey("pedido_associacao", new TableForeignKey({
            name: "FK_PedidoAssociacaoAprovado",
            columnNames: ["Aprovado_por"],
            referencedColumnNames: ["id"],
            referencedTableName: "admin_aisam",
            onDelete: "SET NULL",
            onUpdate: "CASCADE"
        }));

        await queryRunner.createForeignKey("pedido_associacao", new TableForeignKey({
            name: "FK_PedidoAssociacaoRecusado",
            columnNames: ["Recusado_por"],
            referencedColumnNames: ["id"],
            referencedTableName: "admin_aisam",
            onDelete: "SET NULL",
            onUpdate: "CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("pedido_associacao", "FK_PedidoAssociacaoAprovado");
        await queryRunner.dropForeignKey("pedido_associacao", "FK_PedidoAssociacaoRecusado");
    }
}
