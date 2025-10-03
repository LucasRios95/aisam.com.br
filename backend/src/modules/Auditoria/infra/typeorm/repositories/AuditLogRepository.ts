import { Repository } from "typeorm";
import { AppDataSource } from "shared/infra/typeorm";
import { AuditLog } from "../entities/AuditLog";
import { IAuditLogRepository } from "modules/Auditoria/repositories/IAuditLogRepository";
import { ICreateAuditLogDTO } from "modules/Auditoria/dtos/ICreateAuditLogDTO";

class AuditLogRepository implements IAuditLogRepository {
    private repository: Repository<AuditLog>;

    constructor() {
        this.repository = AppDataSource.getRepository(AuditLog);
    }

    async create(data: ICreateAuditLogDTO): Promise<AuditLog> {
        const auditLog = this.repository.create(data);
        await this.repository.save(auditLog);
        return auditLog;
    }

    async findAll(limit: number = 100, offset: number = 0): Promise<AuditLog[]> {
        return this.repository.find({
            take: limit,
            skip: offset,
            order: {
                created_at: "DESC"
            }
        });
    }

    async findByUserId(user_id: string): Promise<AuditLog[]> {
        return this.repository.find({
            where: { user_id },
            order: {
                created_at: "DESC"
            }
        });
    }

    async findByEntityType(entity_type: string): Promise<AuditLog[]> {
        return this.repository.find({
            where: { entity_type },
            order: {
                created_at: "DESC"
            }
        });
    }

    async findByEntityId(entity_id: string): Promise<AuditLog[]> {
        return this.repository.find({
            where: { entity_id },
            order: {
                created_at: "DESC"
            }
        });
    }
}

export { AuditLogRepository };
