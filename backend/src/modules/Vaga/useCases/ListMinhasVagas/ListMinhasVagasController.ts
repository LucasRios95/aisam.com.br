import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListMinhasVagasUseCase } from "./ListMinhasVagasUseCase";
import { VagaSerializer } from "../../utils/VagaSerializer";

class ListMinhasVagasController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: recrutador_id } = request.user;

        const listMinhasVagasUseCase = container.resolve(ListMinhasVagasUseCase);

        const vagas = await listMinhasVagasUseCase.execute(recrutador_id);

        const serializedVagas = VagaSerializer.serializeList(vagas, true);

        return response.json(serializedVagas);
    }
}

export { ListMinhasVagasController };
