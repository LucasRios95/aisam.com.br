import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Associado } from "@modules/Associado/infra/typeorm/entities/Associado";

export enum PerfilRecrutador {
    RECRUTADOR = "recrutador",
    ADMIN = "admin"
}

export enum StatusRecrutador {
    ATIVO = "ativo",
    INATIVO = "inativo"
}

@Entity("recrutador")
export class Recrutador {

    @PrimaryColumn()
    id: string;

    @Column()
    nome: string;

    @Column()
    email: string;

    @Column()
    senha: string;

    @Column({ type: 'enum', enum: PerfilRecrutador, default: PerfilRecrutador.RECRUTADOR })
    perfil: PerfilRecrutador;

    @Column({ type: 'enum', enum: StatusRecrutador, default: StatusRecrutador.ATIVO })
    status: StatusRecrutador;

    @Column({ nullable: true })
    associado_id: string;

    @ManyToOne(() => Associado)
    @JoinColumn({ name: "associado_id" })
    associado: Associado;

    @Column({ nullable: true })
    convite_token: string;

    @Column({ nullable: true })
    convite_expires_at: Date;

    @Column({ default: false })
    convite_aceito: boolean;

    @Column({ nullable: true })
    reset_password_token: string;

    @Column({ nullable: true })
    reset_password_expires_at: Date;

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
