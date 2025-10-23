import { inject, injectable } from "tsyringe";
import { verify } from "jsonwebtoken";
import { ICandidatoRepository } from "../../repositories/ICandidatoRepository";
import { AppError } from "shared/errors/AppError";
import authConfig from "config/auth";

interface IRequest {
    token: string;
}

interface ITokenPayload {
    sub: string;
    role: string;
}

interface IResponse {
    candidato: {
        id: string;
        nome: string;
        email: string;
        telefone: string;
        cidade: string;
        estado: string;
        resumo_curriculo: string;
        areas_atuacao: string[];
        curriculo_url: string | null;
    };
    token: string;
}

@injectable()
class ValidateMagicLinkUseCase {
    constructor(
        @inject("CandidatoRepository")
        private candidatoRepository: ICandidatoRepository
    ) { }

    async execute({ token }: IRequest): Promise<IResponse> {
        let decoded: ITokenPayload;

        try {
            decoded = verify(token, authConfig.jwt.secret) as ITokenPayload;
        } catch (error) {
            throw new AppError("Token inválido ou expirado", 401);
        }

        // Verifica se é um token de candidato
        if (decoded.role !== "CANDIDATO") {
            throw new AppError("Token inválido", 401);
        }

        const candidatoId = decoded.sub;

        const candidato = await this.candidatoRepository.findById(candidatoId);

        if (!candidato) {
            throw new AppError("Candidato não encontrado", 404);
        }

        // Verifica se o acesso expirou
        if (candidato.acesso_expirado && new Date() > new Date(candidato.acesso_expirado)) {
            throw new AppError("Seu acesso expirou. Entre em contato para renovar.", 403);
        }

        return {
            candidato: {
                id: candidato.id,
                nome: candidato.nome,
                email: candidato.email,
                telefone: candidato.telefone,
                cidade: candidato.cidade,
                estado: candidato.estado,
                resumo_curriculo: candidato.resumo_curriculo,
                areas_atuacao: candidato.areas_atuacao,
                curriculo_url: candidato.curriculo_url
            },
            token // Retorna o mesmo token para ser usado nas próximas requisições
        };
    }
}

export { ValidateMagicLinkUseCase };
