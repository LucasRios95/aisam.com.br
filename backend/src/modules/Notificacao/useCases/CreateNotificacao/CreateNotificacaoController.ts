import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateNotificacaoUseCase } from "./CreateNotificacaoUseCase";

class CreateNotificacaoController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { destinatario_id, tipo, titulo, mensagem, metadata } = request.body;

        const createNotificacaoUseCase = container.resolve(CreateNotificacaoUseCase);

        const notificacao = await createNotificacaoUseCase.execute({
            destinatario_id,
            tipo,
            titulo,
            mensagem,
            metadata
        });

        return response.status(201).json(notificacao);
    }
}

export { CreateNotificacaoController };
