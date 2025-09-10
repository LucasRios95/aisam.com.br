import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

import { v4 as uuidv4 } from "uuid"

export enum StatusAssociado {
    ATIVO = "ativo",
    INATIVO = "inativo"
}

@Entity("associados")
export class Associado {

    @PrimaryColumn()
    id: string;

    @Column()
    razao_social: string;

    @Column()
    cnpj: string;

    @Column({ type: 'enum', enum: StatusAssociado })
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