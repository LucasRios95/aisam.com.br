import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity("candidato")
export class Candidato {

    @PrimaryColumn()
    id: string;

    @Column()
    nome: string;

    @Column()
    email: string;

    @Column()
    telefone: string;

    @Column()
    cidade: string;

    @Column()
    estado: string;

    @Column({ type: 'text' })
    resumo_curriculo: string;

    @Column({ type: 'simple-array', nullable: true })
    areas_atuacao: string[];

    @Column({ nullable: true })
    curriculo_url: string;

    @Column({ nullable: true })
    curriculo_upload_date: Date;

    @Column({ default: false })
    consentimento_dados: boolean;

    @Column({ nullable: true })
    acesso_expirado: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    constructor() {
        if (!this.id) {
            this.id = uuidv4();
        }
    }
}
