import { inject, injectable } from "tsyringe";
import crypto from "crypto";
import { IRecrutadorRepository } from "../../repositories/IRecrutadorRepository";
import { IAssociadoRepository } from "@modules/Associado/repositories/IAssociadoRepository";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { AppError } from "@shared/errors/AppError";
import { Recrutador, PerfilRecrutador, StatusRecrutador } from "../../infra/typeorm/entities/Recrutador";

interface IRequest {
    nome: string;
    email: string;
    associado_id?: string;
    perfil?: PerfilRecrutador;
}

interface IResponse {
    recrutador: Recrutador;
    convite_link: string;
}

@injectable()
class EnviarConviteRecrutadorUseCase {
    constructor(
        @inject("RecrutadorRepository")
        private recrutadorRepository: IRecrutadorRepository,

        @inject("AssociadoRepository")
        private associadoRepository: IAssociadoRepository,

        @inject("MailProvider")
        private mailProvider: IMailProvider
    ) { }

    async execute({ nome, email, associado_id, perfil }: IRequest): Promise<IResponse> {
        const recrutadorExists = await this.recrutadorRepository.findByEmail(email);

        if (recrutadorExists) {
            throw new AppError("Já existe um recrutador com este e-mail", 400);
        }

        let associado;
        if (associado_id) {
            associado = await this.associadoRepository.findById(associado_id);
            if (!associado) {
                throw new AppError("Associado não encontrado", 404);
            }
        }

        // Gera token de convite
        const conviteToken = crypto.randomBytes(32).toString("hex");
        const conviteExpiresAt = new Date();
        conviteExpiresAt.setDate(conviteExpiresAt.getDate() + 7); // Expira em 7 dias

        // Cria recrutador com senha temporária
        const senhaTemporaria = crypto.randomBytes(16).toString("hex");

        const recrutador = await this.recrutadorRepository.create({
            nome,
            email,
            senha: senhaTemporaria, // Será substituída ao aceitar o convite
            perfil: perfil || PerfilRecrutador.RECRUTADOR,
            status: StatusRecrutador.INATIVO, // Inativo até aceitar o convite
            associado_id
        });

        // Atualiza com dados do convite
        recrutador.convite_token = conviteToken;
        recrutador.convite_expires_at = conviteExpiresAt;
        recrutador.convite_aceito = false;

        await this.recrutadorRepository.update(recrutador);

        // URL do convite
        // Tenta diferentes variáveis de ambiente para compatibilidade
        const baseUrl = process.env.FRONTEND_URL
            || process.env.FRONTEND_INSTITUCIONAL_URL
            || process.env.INSTITUTIONAL_FRONTEND_URL
            || "http://localhost:3000";
        const convite_link = `${baseUrl}/aceitar-convite/${conviteToken}`;

        // Enviar e-mail com o link do convite
        await this.mailProvider.sendMail({
            to: email,
            subject: "Convite - Sistema AISAM de Recrutamento",
            template: "convite-recrutador",
            variables: {
                nome,
                email,
                perfil: perfil || PerfilRecrutador.RECRUTADOR,
                associado_nome: associado?.razao_social || "",
                convite_link,
                expira_em: conviteExpiresAt.toLocaleDateString("pt-BR"),
                ano: new Date().getFullYear()
            }
        });

        return {
            recrutador,
            convite_link
        };
    }
}

export { EnviarConviteRecrutadorUseCase };
