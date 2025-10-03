import { inject, injectable } from "tsyringe";
import { IAuditLogRepository } from "../../repositories/IAuditLogRepository";
import { AuditLog } from "../../infra/typeorm/entities/AuditLog";

interface IRequest {
    limit?: number;
    offset?: number;
}

@injectable()
class ListAuditLogsUseCase {
    constructor(
        @inject("AuditLogRepository")
        private auditLogRepository: IAuditLogRepository
    ) { }

    async execute({ limit = 100, offset = 0 }: IRequest): Promise<AuditLog[]> {
        const auditLogs = await this.auditLogRepository.findAll(limit, offset);
        return auditLogs;
    }
}

export { ListAuditLogsUseCase };
