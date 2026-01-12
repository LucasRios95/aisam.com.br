import { inject, injectable } from "tsyringe";
import { sign } from "jsonwebtoken";
import { ICandidatoRepository } from "../../repositories/ICandidatoRepository";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { AppError } from "@shared/errors/AppError";
import authConfig from "@config/auth";

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
        private candidatoRepository: ICandidatoRepository,

        @inject("MailProvider")
        private mailProvider: IMailProvider
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

        // Calcula dias restantes até expiração total
        const diasRestantes = Math.ceil((expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

        // Gera o link mágico
        // Tenta diferentes variáveis de ambiente para compatibilidade
        const baseUrl = process.env.FRONTEND_INSTITUCIONAL_URL
            || process.env.INSTITUTIONAL_FRONTEND_URL
            || process.env.FRONTEND_URL
            || "http://localhost:3000";
        const magicLink = `${baseUrl}/candidato/acesso?token=${token}`;

        // Envia email com o link mágico
        await this.mailProvider.sendMail({
            to: email,
            subject: "Seu Link de Acesso - Sistema AISAM",
            template: "magic-link-candidato",
            variables: {
                nome: candidato.nome,
                magic_link: magicLink,
                dias_restantes: diasRestantes,
                data_expiracao: expiresAt.toLocaleDateString("pt-BR"),
                ano: new Date().getFullYear()
            }
        });

        return {
            token,
            expires_at: expiresAt
        };
    }
}

export { GenerateMagicLinkUseCase };
