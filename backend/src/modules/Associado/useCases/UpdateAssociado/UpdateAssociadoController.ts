import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateAssociadoUseCase } from "./UpdateAssociadoUseCase";
import { StatusAssociado } from "@modules/Associado/infra/typeorm/entities/Associado";

class UpdateAssociadoController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
        const {
            razao_social,
            nome_fantasia,
            email,
            telefone,
            endereco,
            cidade,
            estado,
            cep,
            ativo,
        } = request.body;

        const updateAssociadoUseCase = container.resolve(UpdateAssociadoUseCase);

        // Converter ativo (boolean) para status (enum)
        let status: StatusAssociado | undefined;
        if (ativo !== undefined) {
            status = ativo ? StatusAssociado.ATIVO : StatusAssociado.INATIVO;
        }

        const associado = await updateAssociadoUseCase.execute({
            id,
            razao_social,
            nome_fantasia,
            email,
            telefone,
            endereco,
            cidade,
            estado,
            cep,
            status,
        });

        // Transformar para o formato esperado pelo frontend
        const associadoFormatado = {
            ...associado,
            ativo: associado.status === "ativo"
        };

        return response.status(200).json(associadoFormatado);
    }
}

export { UpdateAssociadoController };
