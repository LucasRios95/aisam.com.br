import { inject, injectable } from "tsyringe";
import { IAdminAisamRepository } from "@modules/AdminAisam/repositories/IAdminAisamRepository";
import { IHashProvider } from "@shared/container/providers/HashProvider/IHashProvider";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
    adminId: string;
    nome?: string;
    senha_atual?: string;
    nova_senha?: string;
}

interface IResponse {
    id: string;
    nome: string;
    email: string;
    mfa_enabled: boolean;
}

@injectable()
class UpdateAdminProfileUseCase {
    constructor(
        @inject("AdminAisamRepository")
        private adminAisamRepository: IAdminAisamRepository,
        @inject("HashProvider")
        private hashProvider: IHashProvider
    ) {}

    async execute({
        adminId,
        nome,
        senha_atual,
        nova_senha
    }: IRequest): Promise<IResponse> {
        const admin = await this.adminAisamRepository.findById(adminId);

        if (!admin) {
            throw new AppError("Admin não encontrado!", 404);
        }

        // Atualiza o nome se fornecido
        if (nome) {
            admin.nome = nome;
        }

        // Atualiza a senha se fornecida
        if (nova_senha) {
            if (!senha_atual) {
                throw new AppError("Senha atual é obrigatória para alterar a senha!", 400);
            }

            const senhaCorreta = await this.hashProvider.compareHash(senha_atual, admin.senha);

            if (!senhaCorreta) {
                throw new AppError("Senha atual incorreta!", 401);
            }

            if (nova_senha.length < 6) {
                throw new AppError("A nova senha deve ter pelo menos 6 caracteres!", 400);
            }

            admin.senha = await this.hashProvider.generateHash(nova_senha);
        }

        const updatedAdmin = await this.adminAisamRepository.save(admin);

        return {
            id: updatedAdmin.id,
            nome: updatedAdmin.nome,
            email: updatedAdmin.email,
            mfa_enabled: updatedAdmin.mfa_enabled
        };
    }
}

export { UpdateAdminProfileUseCase };
