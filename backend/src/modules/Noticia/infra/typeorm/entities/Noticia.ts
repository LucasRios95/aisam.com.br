import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity("noticia")
export class Noticia {
  @PrimaryColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  titulo: string;

  @Column({ type: "varchar", length: 255, unique: true })
  slug: string;

  @Column({ type: "text", nullable: true })
  resumo: string;

  @Column({ type: "text" })
  conteudo: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  imagem_url: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  autor: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  fonte: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  fonte_url: string;

  @Column({ type: "jsonb", nullable: true })
  tags: string[];

  @Column({ type: "boolean", default: true })
  publicada: boolean;

  @Column({ type: "boolean", default: false })
  destaque: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  data_publicacao: Date;

  @Column({ type: "integer", default: 0 })
  visualizacoes: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    if (!this.slug && this.titulo) {
      this.slug = this.titulo
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }
  }
}
