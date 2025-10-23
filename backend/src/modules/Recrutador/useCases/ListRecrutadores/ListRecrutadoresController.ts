import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListRecrutadoresUseCase } from "./ListRecrutadoresUseCase";

class ListRecrutadoresController {
    async handle(request: Request, response: Response): Promise<Response> {
        const listRecrutadoresUseCase = container.resolve(ListRecrutadoresUseCase);

        const recrutadores = await listRecrutadoresUseCase.execute();

        // Converter status para ativo (compatibilidade com frontend)
        const recrutadoresFormatados = recrutadores.map(recrutador => ({
            ...recrutador,
            ativo: recrutador.status === "ativo"
        }));

        return response.json(recrutadoresFormatados);
    }
}

export { ListRecrutadoresController };
