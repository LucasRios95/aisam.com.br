import { ICreateAuditLogDTO } from "../dtos/ICreateAuditLogDTO";
import { AuditLog } from "../infra/typeorm/entities/AuditLog";

interface IAuditLogRepository {
    create(data: ICreateAuditLogDTO): Promise<AuditLog>;
    findAll(limit?: number, offset?: number): Promise<AuditLog[]>;
    findByUserId(user_id: string): Promise<AuditLog[]>;
    findByEntityType(entity_type: string): Promise<AuditLog[]>;
    findByEntityId(entity_id: string): Promise<AuditLog[]>;
}

export { IAuditLogRepository };
