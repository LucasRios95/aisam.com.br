import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ListUsersAisamUseCase } from './ListUsersAisamUseCase';



class ListPedidosAssociacaoController {
    async handle(request: Request, response: Response): Promise<Response> {
        const listUsersAisamUseCase = container.resolve(ListUsersAisamUseCase);

        const pedidos = await listUsersAisamUseCase.execute();

        return response.status(200).json(pedidos);
    }
}

export { ListPedidosAssociacaoController };