import { inject, injectable } from "tsyringe";
import { sign } from "jsonwebtoken";
import { IAdminAisamRepository } from "../../repositories/IAdminAisamRepository";
import { IHashProvider } from "@shared/container/providers/HashProvider/IHashProvider";
import { AppError } from "@shared/errors/AppError";
import authConfig from "@config/auth";

interface IRequest {
    email: string;
    senha: string;
}

interface IResponse {
    admin: {
        id: string;
        nome: string;
        email: string;
    };
    token: string;
}

@injectable()
class AuthenticateAdminUseCase {
    constructor(
        @inject("AdminAisamRepository")
        private adminAisamRepository: IAdminAisamRepository,

        @inject("HashProvider")
        private hashProvider: IHashProvider
    ) { }

    async execute({ email, senha }: IRequest): Promise<IResponse> {
        const admin = await this.adminAisamRepository.findByEmail(email);

        if (!admin) {
            throw new AppError("E-mail ou senha incorretos", 401);
        }

        const passwordMatch = await this.hashProvider.compareHash(
            senha,
            admin.senha
        );

        if (!passwordMatch) {
            throw new AppError("E-mail ou senha incorretos", 401);
        }

        const token = sign(
            {
                role: "ADMIN_AISAM"
            },
            authConfig.jwt.secret,
            {
                subject: admin.id,
                expiresIn: authConfig.jwt.expiresIn
            }
        );

        return {
            admin: {
                id: admin.id,
                nome: admin.nome,
                email: admin.email
            },
            token
        };
    }
}

export { AuthenticateAdminUseCase };
