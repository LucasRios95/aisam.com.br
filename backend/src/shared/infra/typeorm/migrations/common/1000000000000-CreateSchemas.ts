import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Migration para criar os schemas separados no PostgreSQL
 * IMPORTANTE: Esta migration deve ser executada ANTES de todas as outras
 */
export class CreateSchemas1000000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar schema para sistema de vagas/recrutamento
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS vagas`);
    console.log("✅ Schema 'vagas' criado");

    // Criar schema para sistema de notícias
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS noticias`);
    console.log("✅ Schema 'noticias' criado");

    // Schema 'public' já existe por padrão
    console.log("✅ Schema 'public' (comum) já existe");

    // Garantir que a extensão uuid-ossp está disponível em todos os schemas
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    console.log("✅ Extensão uuid-ossp habilitada");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // CUIDADO: Isso vai deletar TODOS os dados desses schemas
    await queryRunner.query(`DROP SCHEMA IF EXISTS noticias CASCADE`);
    await queryRunner.query(`DROP SCHEMA IF EXISTS vagas CASCADE`);
    console.log("⚠️  Schemas 'vagas' e 'noticias' removidos");
  }
}
