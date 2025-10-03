import { Request, Response } from "express";
import { container } from "tsyringe";
import { MarcarComoLidaUseCase } from "./MarcarComoLidaUseCase";

class MarcarComoLidaController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const marcarComoLidaUseCase = container.resolve(MarcarComoLidaUseCase);

        const notificacao = await marcarComoLidaUseCase.execute(id);

        return response.json(notificacao);
    }
}

export { MarcarComoLidaController };
