import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddConviteFieldsToRecrutador1759530000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("recrutador", new TableColumn({
            name: "convite_token",
            type: "varchar",
            isNullable: true
        }));

        await queryRunner.addColumn("recrutador", new TableColumn({
            name: "convite_expires_at",
            type: "timestamp",
            isNullable: true
        }));

        await queryRunner.addColumn("recrutador", new TableColumn({
            name: "convite_aceito",
            type: "boolean",
            default: false
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("recrutador", "convite_aceito");
        await queryRunner.dropColumn("recrutador", "convite_expires_at");
        await queryRunner.dropColumn("recrutador", "convite_token");
    }

}
