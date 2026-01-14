import { inject, injectable } from "tsyringe";
import { IAdminAisamRepository } from "@modules/AdminAisam/repositories/IAdminAisamRepository";
import { AppError } from "@shared/errors/AppError";

interface IResponse {
    id: string;
    nome: string;
    email: string;
    mfa_enabled: boolean;
    created_at: Date;
}

@injectable()
class GetAdminProfileUseCase {
    constructor(
        @inject("AdminAisamRepository")
        private adminAisamRepository: IAdminAisamRepository
    ) {}

    async execute(adminId: string): Promise<IResponse> {
        const admin = await this.adminAisamRepository.findById(adminId);

        if (!admin) {
            throw new AppError("Admin não encontrado!", 404);
        }

        return {
            id: admin.id,
            nome: admin.nome,
            email: admin.email,
            mfa_enabled: admin.mfa_enabled,
            created_at: admin.created_at
        };
    }
}

export { GetAdminProfileUseCase };
