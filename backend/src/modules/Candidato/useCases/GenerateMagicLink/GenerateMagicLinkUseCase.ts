import { inject, injectable } from "tsyringe";
import { sign } from "jsonwebtoken";
import { ICandidatoRepository } from "../../repositories/ICandidatoRepository";
import { AppError } from "shared/errors/AppError";
import authConfig from "config/auth";

interface IRequest {
    email: string;
}

interface IResponse {
    token: string;
    expires_at: Date;
}

@injectable()
class GenerateMagicLinkUseCase {
    constructor(
        @inject("CandidatoRepository")
        private candidatoRepository: ICandidatoRepository
    ) { }

    async execute({ email }: IRequest): Promise<IResponse> {
        const candidato = await this.candidatoRepository.findByEmail(email);

        if (!candidato) {
            throw new AppError("Candidato não encontrado", 404);
        }

        // Verifica se o acesso expirou
        if (candidato.acesso_expirado && new Date() > new Date(candidato.acesso_expirado)) {
            throw new AppError("Seu acesso expirou. Entre em contato para renovar.", 403);
        }

        // Define data de expiração (30 dias a partir do cadastro)
        const expiresAt = candidato.acesso_expirado || new Date(
            new Date(candidato.created_at).getTime() + 30 * 24 * 60 * 60 * 1000
        );

        // Se ainda não tem data de expiração, atualiza
        if (!candidato.acesso_expirado) {
            candidato.acesso_expirado = expiresAt;
            await this.candidatoRepository.update(candidato);
        }

        // Gera token com expiração de 24 horas
        const token = sign(
            {
                role: "CANDIDATO"
            },
            authConfig.jwt.secret,
            {
                subject: candidato.id,
                expiresIn: "24h"
            }
        );

        return {
            token,
            expires_at: expiresAt
        };
    }
}

export { GenerateMagicLinkUseCase };
