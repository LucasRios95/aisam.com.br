import { Request, Response } from "express";
import { container } from "tsyringe";
import { FindVagaByIdUseCase } from "./FindVagaByIdUseCase";
import { VagaSerializer } from "../../utils/VagaSerializer";

class FindVagaByIdController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const findVagaByIdUseCase = container.resolve(FindVagaByIdUseCase);

        const vaga = await findVagaByIdUseCase.execute(id);

        // Se o usuário estiver autenticado, incluir mais detalhes
        const isAuthenticated = !!request.user;
        const serializedVaga = VagaSerializer.serialize(vaga, isAuthenticated);

        return response.json(serializedVaga);
    }
}

export { FindVagaByIdController };
