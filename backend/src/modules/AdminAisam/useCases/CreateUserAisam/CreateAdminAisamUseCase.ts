import { inject, injectable } from "tsyringe";
import { IAdminAisamRepository } from "modules/AdminAisam/repositories/IAdminAisamRepository";
import { AdminAisam } from "modules/AdminAisam/infra/typeorm/entities/AdminAisam";
import { AppError } from "shared/errors/AppError";

interface IRequest {
    nome: string;
    email: string;
    senha: string;
    mfa_enabled: boolean;
}

@injectable()
class CreateAdminAisamUseCase {
    constructor(
        @inject("AdminAisamRepository")
        private adminAisamRepository: IAdminAisamRepository
    ) { }

    async execute({
        nome,
        email,
        senha,
        mfa_enabled,
    }: IRequest): Promise<AdminAisam> {

        const adminAisamAlreadyExists = await this.adminAisamRepository.findByEmail(email);

        if (adminAisamAlreadyExists) {
            throw new AppError("usuário já cadastrado com este email");
        }


        const adminAisam = await this.adminAisamRepository.create({
            nome,
            email,
            senha,
            mfa_enabled,
        });

        return adminAisam;

    }
}

export { CreateAdminAisamUseCase };

//