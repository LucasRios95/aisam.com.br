import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListAreasAtuacaoUseCase } from "./ListAreasAtuacaoUseCase";

export class ListAreasAtuacaoController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { apenasAtivas } = request.query;

        const listAreasAtuacaoUseCase = container.resolve(ListAreasAtuacaoUseCase);

        const areas = await listAreasAtuacaoUseCase.execute({
            apenasAtivas: apenasAtivas !== "false"
        });

        return response.json(areas);
    }
}
