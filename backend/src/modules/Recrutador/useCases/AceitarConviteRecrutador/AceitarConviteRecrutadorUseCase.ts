import { inject, injectable } from "tsyringe";
import { IRecrutadorRepository } from "../../repositories/IRecrutadorRepository";
import { IHashProvider } from "@shared/container/providers/HashProvider/IHashProvider";
import { AppError } from "@shared/errors/AppError";
import { StatusRecrutador } from "../../infra/typeorm/entities/Recrutador";

interface IRequest {
    token: string;
    senha: string;
}

@injectable()
class AceitarConviteRecrutadorUseCase {
    constructor(
        @inject("RecrutadorRepository")
        private recrutadorRepository: IRecrutadorRepository,

        @inject("HashProvider")
        private hashProvider: IHashProvider
    ) { }

    async execute({ token, senha }: IRequest): Promise<void> {
        const recrutador = await this.recrutadorRepository.findByConviteToken(token);

        if (!recrutador) {
            throw new AppError("Convite inválido", 404);
        }

        if (recrutador.convite_aceito) {
            throw new AppError("Convite já foi aceito", 400);
        }

        if (recrutador.convite_expires_at && new Date() > recrutador.convite_expires_at) {
            throw new AppError("Convite expirado", 400);
        }

        // Hash da nova senha
        const senhaHash = await this.hashProvider.generateHash(senha);

        // Ativa o recrutador
        recrutador.senha = senhaHash;
        recrutador.status = StatusRecrutador.ATIVO;
        recrutador.convite_aceito = true;
        recrutador.convite_token = null;
        recrutador.convite_expires_at = null;

        await this.recrutadorRepository.update(recrutador);
    }
}

export { AceitarConviteRecrutadorUseCase };
