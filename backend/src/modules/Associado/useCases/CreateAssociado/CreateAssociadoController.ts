import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateAssociadoUseCase } from "./CreateAssociadoUseCase";

class CreateAssociadoController {
    async handle(request: Request, response: Response): Promise<Response> {
        const {
            razao_social,
            nome_fantasia,
            cnpj,
            email,
            telefone,
            endereco,
            cidade,
            estado,
            cep,
        } = request.body;

        const createAssociadoUseCase = container.resolve(CreateAssociadoUseCase);

        const associado = await createAssociadoUseCase.execute({
            razao_social,
            nome_fantasia,
            cnpj,
            email,
            telefone,
            endereco,
            cidade,
            estado,
            cep,
        });

        // Transformar para o formato esperado pelo frontend
        const associadoFormatado = {
            ...associado,
            ativo: associado.status === "ativo"
        };

        return response.status(201).json(associadoFormatado);
    }
}

export { CreateAssociadoController };
