import { inject, injectable } from "tsyringe";
import { IRecrutadorRepository } from "@modules/Recrutador/repositories/IRecrutadorRepository";
import { IHashProvider } from "@shared/container/providers/HashProvider/IHashProvider";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
    recrutadorId: string;
    nome?: string;
    senha_atual?: string;
    nova_senha?: string;
}

interface IResponse {
    id: string;
    nome: string;
    email: string;
    perfil: string;
    status: string;
}

@injectable()
class UpdateRecrutadorProfileUseCase {
    constructor(
        @inject("RecrutadorRepository")
        private recrutadorRepository: IRecrutadorRepository,
        @inject("HashProvider")
        private hashProvider: IHashProvider
    ) {}

    async execute({
        recrutadorId,
        nome,
        senha_atual,
        nova_senha
    }: IRequest): Promise<IResponse> {
        const recrutador = await this.recrutadorRepository.findById(recrutadorId);

        if (!recrutador) {
            throw new AppError("Recrutador não encontrado!", 404);
        }

        // Atualiza o nome se fornecido
        if (nome) {
            recrutador.nome = nome;
        }

        // Atualiza a senha se fornecida
        if (nova_senha) {
            if (!senha_atual) {
                throw new AppError("Senha atual é obrigatória para alterar a senha!", 400);
            }

            const senhaCorreta = await this.hashProvider.compareHash(senha_atual, recrutador.senha);

            if (!senhaCorreta) {
                throw new AppError("Senha atual incorreta!", 401);
            }

            if (nova_senha.length < 6) {
                throw new AppError("A nova senha deve ter pelo menos 6 caracteres!", 400);
            }

            recrutador.senha = await this.hashProvider.generateHash(nova_senha);
        }

        const updatedRecrutador = await this.recrutadorRepository.save(recrutador);

        return {
            id: updatedRecrutador.id,
            nome: updatedRecrutador.nome,
            email: updatedRecrutador.email,
            perfil: updatedRecrutador.perfil,
            status: updatedRecrutador.status
        };
    }
}

export { UpdateRecrutadorProfileUseCase };
