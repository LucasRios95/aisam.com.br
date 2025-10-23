import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ListUsersAisamUseCase } from './ListUsersAisamUseCase';



class ListUsersAisamController {
    async handle(request: Request, response: Response): Promise<Response> {
        const listUsersAisamUseCase = container.resolve(ListUsersAisamUseCase);

        const users = await listUsersAisamUseCase.execute();

        return response.status(200).json(users);
    }
}

export { ListPedidosAssociacaoController };