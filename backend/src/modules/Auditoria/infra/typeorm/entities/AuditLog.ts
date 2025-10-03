import { Entity, Column, PrimaryColumn, CreateDateColumn } from "typeorm";
import { v4 as uuidv4 } from "uuid";

export enum AuditAction {
    CREATE = "create",
    UPDATE = "update",
    DELETE = "delete",
    LOGIN = "login",
    LOGOUT = "logout",
    APPROVE = "approve",
    REJECT = "reject",
    ARCHIVE = "archive",
    UPLOAD = "upload",
    PURGE = "purge",
    EXPIRE = "expire",
    ANONYMIZE = "anonymize"
}

@Entity("audit_logs")
export class AuditLog {

    @PrimaryColumn()
    id: string;

    @Column({ nullable: true })
    user_id: string;

    @Column({ nullable: true })
    user_role: string;

    @Column({ type: 'enum', enum: AuditAction })
    action: AuditAction;

    @Column()
    entity_type: string;

    @Column({ nullable: true })
    entity_id: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'jsonb', nullable: true })
    metadata: any;

    @Column({ nullable: true })
    ip_address: string;

    @Column({ type: 'text', nullable: true })
    user_agent: string;

    @CreateDateColumn()
    created_at: Date;

    constructor() {
        if (!this.id) {
            this.id = uuidv4();
        }
    }
}
