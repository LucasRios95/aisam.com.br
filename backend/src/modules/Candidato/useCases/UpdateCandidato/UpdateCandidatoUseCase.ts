import { inject, injectable } from "tsyringe";
import { ICandidatoRepository } from "@modules/Candidato/repositories/ICandidatoRepository";
import { Candidato } from "@modules/Candidato/infra/typeorm/entities/Candidato";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
    id: string;
    nome?: string;
    email?: string;
    telefone?: string;
    cidade?: string;
    estado?: string;
    resumo_curriculo?: string;
    areas_atuacao?: string[];
    curriculo_url?: string;
    curriculo_upload_date?: Date;
}

@injectable()
class UpdateCandidatoUseCase {
    constructor(
        @inject("CandidatoRepository")
        private candidatoRepository: ICandidatoRepository
    ) {}

    async execute({
        id,
        nome,
        email,
        telefone,
        cidade,
        estado,
        resumo_curriculo,
        areas_atuacao,
        curriculo_url,
        curriculo_upload_date
    }: IRequest): Promise<Candidato> {
        const candidato = await this.candidatoRepository.findById(id);

        if (!candidato) {
            throw new AppError("Candidato não encontrado!", 404);
        }

        if (email && email !== candidato.email) {
            const candidatoWithEmail = await this.candidatoRepository.findByEmail(email);
            if (candidatoWithEmail) {
                throw new AppError("Já existe um candidato com este email!", 400);
            }
        }

        const candidatoUpdated = await this.candidatoRepository.update({
            id,
            nome,
            email,
            telefone,
            cidade,
            estado,
            resumo_curriculo,
            areas_atuacao,
            curriculo_url,
            curriculo_upload_date
        });

        return candidatoUpdated;
    }
}

export { UpdateCandidatoUseCase };
