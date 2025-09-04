import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAdminAisam1757016066744 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "admin_aisam",
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
                    name: "mfa_enabled",
                    type: "boolean"
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
        await queryRunner.dropTable("admin_aisam");
    }

}
