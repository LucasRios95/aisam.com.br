import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateAreaAtuacaoUseCase } from "./CreateAreaAtuacaoUseCase";

export class CreateAreaAtuacaoController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { nome, slug, descricao } = request.body;

        const createAreaAtuacaoUseCase = container.resolve(CreateAreaAtuacaoUseCase);

        const area = await createAreaAtuacaoUseCase.execute({
            nome,
            slug,
            descricao
        });

        return response.status(201).json(area);
    }
}
