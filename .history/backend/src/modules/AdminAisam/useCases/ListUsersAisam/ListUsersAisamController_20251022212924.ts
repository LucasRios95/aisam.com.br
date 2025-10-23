import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ListUsersAisamUseCase } from './ListUsersAisamUseCase';

class ListPedidosAssociacaoController {
    async handle(request: Request, response: Response): Promise<Response> {
        const listPedidosAssociacaoUseCase = container.resolve(ListPedidosAssociacaoUseCase);

        const pedidos = await listPedidosAssociacaoUseCase.execute();

        return response.status(200).json(pedidos);
    }
}

export { ListPedidosAssociacaoController };