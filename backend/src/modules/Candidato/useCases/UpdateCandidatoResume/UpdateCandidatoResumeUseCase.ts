import { inject, injectable } from "tsyringe";
import { ICandidatoRepository } from "../../repositories/ICandidatoRepository";
import { AppError } from "shared/errors/AppError";

interface IRequest {
    candidatoId: string;
    nome?: string;
    email?: string;
    telefone?: string;
    cidade?: string;
    estado?: string;
    resumo_curriculo?: string;
    areas_atuacao?: string[];
}

@injectable()
class UpdateCandidatoResumeUseCase {
    constructor(
        @inject("CandidatoRepository")
        private candidatoRepository: ICandidatoRepository
    ) { }

    async execute(data: IRequest): Promise<void> {
        const candidato = await this.candidatoRepository.findById(data.candidatoId);

        if (!candidato) {
            throw new AppError("Candidato não encontrado", 404);
        }

        // Atualiza apenas os campos fornecidos
        if (data.nome !== undefined) candidato.nome = data.nome;
        if (data.email !== undefined) candidato.email = data.email;
        if (data.telefone !== undefined) candidato.telefone = data.telefone;
        if (data.cidade !== undefined) candidato.cidade = data.cidade;
        if (data.estado !== undefined) candidato.estado = data.estado;
        if (data.resumo_curriculo !== undefined) candidato.resumo_curriculo = data.resumo_curriculo;
        if (data.areas_atuacao !== undefined) candidato.areas_atuacao = data.areas_atuacao;

        await this.candidatoRepository.update(candidato);
    }
}

export { UpdateCandidatoResumeUseCase };
