import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListAuditLogsUseCase } from "./ListAuditLogsUseCase";

class ListAuditLogsController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { limit, offset } = request.query;

        const listAuditLogsUseCase = container.resolve(ListAuditLogsUseCase);

        const auditLogs = await listAuditLogsUseCase.execute({
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined
        });

        return response.json(auditLogs);
    }
}

export { ListAuditLogsController };
