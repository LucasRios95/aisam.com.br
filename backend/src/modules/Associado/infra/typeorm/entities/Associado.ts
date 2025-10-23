import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

import { v4 as uuidv4 } from "uuid"

export enum StatusAssociado {
    ATIVO = "ativo",
    INATIVO = "inativo"
}

@Entity("associado")
export class Associado {

    @PrimaryColumn()
    id: string;

    @Column()
    razao_social: string;

    @Column({ nullable: true })
    nome_fantasia: string;

    @Column()
    cnpj: string;

    @Column()
    email: string;

    @Column({ nullable: true })
    telefone: string;

    @Column({ nullable: true })
    endereco: string;

    @Column({ nullable: true })
    cidade: string;

    @Column({ nullable: true })
    estado: string;

    @Column({ nullable: true })
    cep: string;

    @Column({ type: 'enum', enum: StatusAssociado, default: StatusAssociado.ATIVO })
    status: StatusAssociado;

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