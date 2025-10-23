import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateNoticia1759541000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "noticia",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "titulo",
            type: "varchar",
            length: "255",
          },
          {
            name: "slug",
            type: "varchar",
            length: "255",
            isUnique: true,
          },
          {
            name: "resumo",
            type: "text",
            isNullable: true,
          },
          {
            name: "conteudo",
            type: "text",
          },
          {
            name: "imagem_url",
            type: "varchar",
            length: "500",
            isNullable: true,
          },
          {
            name: "autor",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          {
            name: "fonte",
            type: "varchar",
            length: "255",
            isNullable: true,
            comment: "Fonte da notícia (manual, n8n, rss, etc)",
          },
          {
            name: "fonte_url",
            type: "varchar",
            length: "500",
            isNullable: true,
            comment: "URL original da notícia se importada",
          },
          {
            name: "tags",
            type: "jsonb",
            isNullable: true,
            comment: "Array de tags da notícia",
          },
          {
            name: "publicada",
            type: "boolean",
            default: true,
          },
          {
            name: "destaque",
            type: "boolean",
            default: false,
            comment: "Se a notícia aparece em destaque",
          },
          {
            name: "data_publicacao",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "visualizacoes",
            type: "integer",
            default: 0,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "now()",
          },
        ],
      })
    );

    // Criar índices para melhorar performance
    await queryRunner.query(
      `CREATE INDEX idx_noticia_slug ON noticias.noticia(slug)`
    );
    await queryRunner.query(
      `CREATE INDEX idx_noticia_publicada ON noticias.noticia(publicada)`
    );
    await queryRunner.query(
      `CREATE INDEX idx_noticia_destaque ON noticias.noticia(destaque)`
    );
    await queryRunner.query(
      `CREATE INDEX idx_noticia_data_publicacao ON noticias.noticia(data_publicacao DESC)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("noticia");
  }
}
