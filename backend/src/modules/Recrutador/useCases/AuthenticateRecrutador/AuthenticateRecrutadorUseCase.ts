import { inject, injectable } from "tsyringe";
import { sign } from "jsonwebtoken";
import { IRecrutadorRepository } from "../../repositories/IRecrutadorRepository";
import { IHashProvider } from "shared/container/providers/HashProvider/IHashProvider";
import { AppError } from "shared/errors/AppError";
import authConfig from "config/auth";
import { StatusRecrutador } from "../../infra/typeorm/entities/Recrutador";

interface IRequest {
    email: string;
    senha: string;
}

interface IResponse {
    recrutador: {
        id: string;
        nome: string;
        email: string;
        perfil: string;
    };
    token: string;
}

@injectable()
class AuthenticateRecrutadorUseCase {
    constructor(
        @inject("RecrutadorRepository")
        private recrutadorRepository: IRecrutadorRepository,

        @inject("HashProvider")
        private hashProvider: IHashProvider
    ) { }

    async execute({ email, senha }: IRequest): Promise<IResponse> {
        const recrutador = await this.recrutadorRepository.findByEmail(email);

        if (!recrutador) {
            throw new AppError("E-mail ou senha incorretos", 401);
        }

        if (recrutador.status === StatusRecrutador.INATIVO) {
            throw new AppError("Recrutador inativo", 401);
        }

        const passwordMatch = await this.hashProvider.compareHash(
            senha,
            recrutador.senha
        );

        if (!passwordMatch) {
            throw new AppError("E-mail ou senha incorretos", 401);
        }

        const token = sign(
            {
                role: "RECRUTADOR"
            },
            authConfig.jwt.secret,
            {
                subject: recrutador.id,
                expiresIn: authConfig.jwt.expiresIn
            }
        );

        return {
            recrutador: {
                id: recrutador.id,
                nome: recrutador.nome,
                email: recrutador.email,
                perfil: recrutador.perfil
            },
            token
        };
    }
}

export { AuthenticateRecrutadorUseCase };
