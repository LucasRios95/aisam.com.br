import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddPasswordResetFieldsToRecrutador1760400000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("vagas.recrutador", new TableColumn({
            name: "reset_password_token",
            type: "varchar",
            isNullable: true
        }));

        await queryRunner.addColumn("vagas.recrutador", new TableColumn({
            name: "reset_password_expires_at",
            type: "timestamp",
            isNullable: true
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("vagas.recrutador", "reset_password_expires_at");
        await queryRunner.dropColumn("vagas.recrutador", "reset_password_token");
    }
}
