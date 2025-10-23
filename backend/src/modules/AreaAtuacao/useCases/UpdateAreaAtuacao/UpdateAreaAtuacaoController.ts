import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateAreaAtuacaoUseCase } from "./UpdateAreaAtuacaoUseCase";

export class UpdateAreaAtuacaoController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
        const { nome, slug, descricao, ativo } = request.body;

        const updateAreaAtuacaoUseCase = container.resolve(UpdateAreaAtuacaoUseCase);

        const area = await updateAreaAtuacaoUseCase.execute({
            id,
            nome,
            slug,
            descricao,
            ativo
        });

        return response.json(area);
    }
}
