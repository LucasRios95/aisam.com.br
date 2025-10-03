import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAuditLog1759520000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "audit_logs",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true
                },
                {
                    name: "user_id",
                    type: "uuid",
                    isNullable: true
                },
                {
                    name: "user_role",
                    type: "varchar",
                    isNullable: true
                },
                {
                    name: "action",
                    type: "varchar"
                },
                {
                    name: "entity_type",
                    type: "varchar"
                },
                {
                    name: "entity_id",
                    type: "uuid",
                    isNullable: true
                },
                {
                    name: "description",
                    type: "text"
                },
                {
                    name: "metadata",
                    type: "jsonb",
                    isNullable: true
                },
                {
                    name: "ip_address",
                    type: "varchar",
                    isNullable: true
                },
                {
                    name: "user_agent",
                    type: "text",
                    isNullable: true
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()"
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("audit_logs");
    }

}
