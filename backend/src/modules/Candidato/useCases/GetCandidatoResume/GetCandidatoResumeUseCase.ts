import { inject, injectable } from "tsyringe";
import { ICandidatoRepository } from "../../repositories/ICandidatoRepository";
import { AppError } from "shared/errors/AppError";

interface IResponse {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    cidade: string;
    estado: string;
    resumo_curriculo: string;
    areas_atuacao: string[];
    curriculo_url: string | null;
    curriculo_upload_date: Date | null;
}

@injectable()
class GetCandidatoResumeUseCase {
    constructor(
        @inject("CandidatoRepository")
        private candidatoRepository: ICandidatoRepository
    ) { }

    async execute(candidatoId: string): Promise<IResponse> {
        const candidato = await this.candidatoRepository.findById(candidatoId);

        if (!candidato) {
            throw new AppError("Candidato não encontrado", 404);
        }

        return {
            id: candidato.id,
            nome: candidato.nome,
            email: candidato.email,
            telefone: candidato.telefone,
            cidade: candidato.cidade,
            estado: candidato.estado,
            resumo_curriculo: candidato.resumo_curriculo,
            areas_atuacao: candidato.areas_atuacao,
            curriculo_url: candidato.curriculo_url,
            curriculo_upload_date: candidato.curriculo_upload_date
        };
    }
}

export { GetCandidatoResumeUseCase };
