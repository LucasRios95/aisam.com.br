import { Request, Response } from "express";
import { AprovarPedidoAssociacaoUseCase } from "./AprovarPedidoAssociacaoUseCase";
import { container } from "tsyringe";

class AprovarPedidoAssociacaoController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id, status, Aprovado_Por } = request.body;

        const aprovarPedidoAssociacaoUseCase = container.resolve(AprovarPedidoAssociacaoUseCase);

        const pedidoAssociacao = await aprovarPedidoAssociacaoUseCase.execute({
            id,
            status,
            Aprovado_Por
        });

        return response.status(201).json(pedidoAssociacao);
    }
}

export { AprovarPedidoAssociacaoController };