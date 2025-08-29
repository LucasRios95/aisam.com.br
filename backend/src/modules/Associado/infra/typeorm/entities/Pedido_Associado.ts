import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";
import { v4 as uuidv4 } from "uuid"

export enum Status {
    PENDENTE = 'pendente',
    APROVADO = 'aprovado',
    RECUSADO = 'recusado'
}

@Entity("pedido_associacao")
export class Pedido_Associacao {
    @PrimaryColumn()
    id: string;

    @Column()
    razao_social: string;

    @Column()
    cnpj: string;

    @Column()
    email_corporativo: string;

    @Column()
    setor: string;

    @Column()
    numero_funcionarios: number;

    @Column()
    representante: string;

    @Column()
    email_representante: string;

    @Column()
    telefone: string;

    @Column()
    endereco: string;

    @Column()
    cidade: string;

    @Column()
    estado: string;

    @Column()
    cep: string;

    @Column()
    descricao: string;

    @Column()
    observacao: string;

    @Column({ type: "enum", enum: Status, default: Status.PENDENTE })
    status: Status;


    @CreateDateColumn()
    created_at: Date;

    constructor() {
        if (!this.id) {
            this.id = uuidv4();
        }
    }
}