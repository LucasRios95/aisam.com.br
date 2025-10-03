import { inject, injectable } from "tsyringe";
import { IAuditLogRepository } from "../../repositories/IAuditLogRepository";
import { ICreateAuditLogDTO } from "../../dtos/ICreateAuditLogDTO";
import { AuditLog } from "../../infra/typeorm/entities/AuditLog";

@injectable()
class CreateAuditLogUseCase {
    constructor(
        @inject("AuditLogRepository")
        private auditLogRepository: IAuditLogRepository
    ) { }

    async execute(data: ICreateAuditLogDTO): Promise<AuditLog> {
        const auditLog = await this.auditLogRepository.create(data);
        return auditLog;
    }
}

export { CreateAuditLogUseCase };
