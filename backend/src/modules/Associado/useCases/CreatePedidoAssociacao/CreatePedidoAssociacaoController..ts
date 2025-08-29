import { Request, Response } from "express";

import { container } from "tsyringe";
import { CreatePedidioAssociacaoUseCase } from "./CreatePedidoAssociacaoUseCase";


class CreatePedidioAssociacaoController {
    async handle(request: Request, response: Response): Promise<Response> {
        const {
            razao_social,
            cnpj,
            email_corporativo,
            setor,
            numero_funcionarios,
            representante,
            email_representante,
            telefone,
            endereco,
            cidade,
            estado,
            cep,
            descricao,
            observacao,
            status,
            created_at,
        } = request.body;

        const createPedidoAssociacaoUseCase = container.resolve(CreatePedidioAssociacaoUseCase);

        try {
            const pedidoAssociacao = await createPedidoAssociacaoUseCase.execute({
                razao_social,
                cnpj,
                email_corporativo,
                setor,
                numero_funcionarios,
                representante,
                email_representante,
                telefone,
                endereco,
                cidade,
                estado,
                cep,
                descricao,
                observacao,
                status,
                created_at,
            });

            return response.status(201).json(pedidoAssociacao);

        } catch (error) {
            return response.status(400).json({
                message: error.message || "Unexpected error."
            });
        }
    }
}

export { CreatePedidioAssociacaoController };