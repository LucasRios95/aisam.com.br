import { Request, Response } from "express";
import { container } from "tsyringe";
import { FindByCnpjUseCase } from "./FindByCnpjUseCase";



class FindByCnpjController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { cnpj } = request.params;

        const findAssociadoUseCase = container.resolve(FindByCnpjUseCase);

        const associado = await findAssociadoUseCase.execute(cnpj);

        return response.json(associado);
    }
}

export { FindByCnpjController };