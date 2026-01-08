import { inject, injectable } from "tsyringe";
import { ICandidatoRepository } from "@modules/Candidato/repositories/ICandidatoRepository";
import { Candidato } from "@modules/Candidato/infra/typeorm/entities/Candidato";
import { AppError } from "@shared/errors/AppError";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";

interface IRequest {
    nome: string;
    email: string;
    telefone: string;
    cidade: string;
    estado: string;
    resumo_curriculo: string;
    areas_atuacao?: string[];
    curriculo_url?: string;
    curriculo_upload_date?: Date;
    consentimento_dados: boolean;
}

@injectable()
class CreateCandidatoUseCase {
    constructor(
        @inject("CandidatoRepository")
        private candidatoRepository: ICandidatoRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider
    ) {}

    async execute({
        nome,
        email,
        telefone,
        cidade,
        estado,
        resumo_curriculo,
        areas_atuacao,
        curriculo_url,
        curriculo_upload_date,
        consentimento_dados
    }: IRequest): Promise<Candidato> {
        const candidatoAlreadyExists = await this.candidatoRepository.findByEmail(email);

        if (candidatoAlreadyExists) {
            throw new AppError("Candidato já existe com este email!", 400);
        }

        if (!consentimento_dados) {
            throw new AppError("É necessário consentimento para tratamento de dados (LGPD)!", 400);
        }

        // Calcula data de expiração: 30 dias após cadastro
        const acesso_expirado = this.dateProvider.addDays(30);

        const candidato = await this.candidatoRepository.create({
            nome,
            email,
            telefone,
            cidade,
            estado,
            resumo_curriculo,
            areas_atuacao,
            curriculo_url,
            curriculo_upload_date,
            consentimento_dados,
            acesso_expirado
        });

        return candidato;
    }
}

export { CreateCandidatoUseCase };
