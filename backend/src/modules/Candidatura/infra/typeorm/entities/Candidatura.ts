import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn
} from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Candidato } from "modules/Candidato/infra/typeorm/entities/Candidato";
import { Vaga } from "modules/Vaga/infra/typeorm/entities/Vaga";

export enum StatusCandidatura {
    PENDENTE = "pendente",
    EM_ANALISE = "em_analise",
    ACEITA = "aceita",
    RECUSADA = "recusada",
    CANCELADA = "cancelada"
}

@Entity("candidaturas")
class Candidatura {
    @PrimaryColumn()
    id: string;

    @Column({ type: "text", nullable: true })
    mensagem: string;

    @Column({
        type: "enum",
        enum: StatusCandidatura,
        default: StatusCandidatura.PENDENTE
    })
    status: StatusCandidatura;

    @Column({ nullable: true })
    observacoes_recrutador: string;

    @Column()
    candidato_id: string;

    @ManyToOne(() => Candidato)
    @JoinColumn({ name: "candidato_id" })
    candidato: Candidato;

    @Column()
    vaga_id: string;

    @ManyToOne(() => Vaga)
    @JoinColumn({ name: "vaga_id" })
    vaga: Vaga;

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

export { Candidatura };
