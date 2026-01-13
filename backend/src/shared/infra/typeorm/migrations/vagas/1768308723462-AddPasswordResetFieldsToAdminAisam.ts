import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddPasswordResetFieldsToAdminAisam1768308723462 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("admin_aisam", new TableColumn({
            name: "reset_password_token",
            type: "varchar",
            isNullable: true,
        }));

        await queryRunner.addColumn("admin_aisam", new TableColumn({
            name: "reset_password_expires_at",
            type: "timestamp",
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("admin_aisam", "reset_password_token");
        await queryRunner.dropColumn("admin_aisam", "reset_password_expires_at");
    }

}
