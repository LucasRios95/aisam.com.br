import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Recrutador } from "modules/Recrutador/infra/typeorm/entities/Recrutador";
import { Associado } from "modules/Associado/infra/typeorm/entities/Associado";

export enum StatusVaga {
    ABERTA = "aberta",
    FECHADA = "fechada",
    ARQUIVADA = "arquivada"
}

export enum RegimeTrabalho {
    PRESENCIAL = "presencial",
    HIBRIDO = "hibrido",
    REMOTO = "remoto"
}

export enum Senioridade {
    ESTAGIO = "estagio",
    JUNIOR = "junior",
    PLENO = "pleno",
    SENIOR = "senior",
    ESPECIALISTA = "especialista"
}

@Entity("vagas")
export class Vaga {

    @PrimaryColumn()
    id: string;

    @Column()
    titulo: string;

    @Column({ type: 'text' })
    descricao: string;

    @Column({ type: 'enum', enum: Senioridade })
    senioridade: Senioridade;

    @Column({ type: 'simple-array' })
    areas_atuacao: string[];

    @Column({ type: 'enum', enum: RegimeTrabalho })
    regime: RegimeTrabalho;

    @Column({ nullable: true })
    localidade: string;

    @Column()
    email_contato: string;

    @Column({ default: false })
    empresa_anonima: boolean;

    @Column({ type: 'enum', enum: StatusVaga, default: StatusVaga.ABERTA })
    status: StatusVaga;

    @Column()
    recrutador_id: string;

    @ManyToOne(() => Recrutador)
    @JoinColumn({ name: "recrutador_id" })
    recrutador: Recrutador;

    @Column()
    associado_id: string;

    @ManyToOne(() => Associado)
    @JoinColumn({ name: "associado_id" })
    associado: Associado;

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
