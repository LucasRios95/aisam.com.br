import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

export enum TipoNotificacao {
    CANDIDATURA = "candidatura",
    VAGA = "vaga",
    SISTEMA = "sistema",
    EMAIL = "email"
}

@Entity("notificacoes")
class Notificacao {
    @PrimaryColumn()
    id: string;

    @Column()
    destinatario_id: string;

    @Column({ type: "enum", enum: TipoNotificacao })
    tipo: TipoNotificacao;

    @Column()
    titulo: string;

    @Column({ type: "text" })
    mensagem: string;

    @Column({ default: false })
    lida: boolean;

    @Column({ type: "jsonb", nullable: true })
    metadata: any;

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

export { Notificacao };
