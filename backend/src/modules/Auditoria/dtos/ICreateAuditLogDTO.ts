import { AuditAction } from "../infra/typeorm/entities/AuditLog";

interface ICreateAuditLogDTO {
    user_id?: string;
    user_role?: string;
    action: AuditAction;
    entity_type: string;
    entity_id?: string;
    description: string;
    metadata?: any;
    ip_address?: string;
    user_agent?: string;
}

export { ICreateAuditLogDTO };
