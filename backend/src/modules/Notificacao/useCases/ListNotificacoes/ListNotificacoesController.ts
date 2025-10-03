import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListNotificacoesUseCase } from "./ListNotificacoesUseCase";

class ListNotificacoesController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { destinatario_id, tipo, lida, limit, offset } = request.query;

        const listNotificacoesUseCase = container.resolve(ListNotificacoesUseCase);

        const notificacoes = await listNotificacoesUseCase.execute({
            destinatario_id: destinatario_id as string,
            tipo: tipo as any,
            lida: lida ? lida === "true" : undefined,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined
        });

        return response.json(notificacoes);
    }
}

export { ListNotificacoesController };
