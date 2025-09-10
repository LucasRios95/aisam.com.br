import { Request, Response } from "express";
import { ListAssociadosUseCase } from "./ListAssociadosUseCase";
import { container } from "tsyringe";


class ListAssociadosController {
    async handle(request: Request, response: Response): Promise<Response> {
        const listAssociadosUseCase = container.resolve(ListAssociadosUseCase);

        const associados = await listAssociadosUseCase.execute();

        return response.status(200).json(associados);
    }
}

export { ListAssociadosController }

