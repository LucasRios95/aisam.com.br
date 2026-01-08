import { inject, injectable } from "tsyringe";
import { INotificacaoRepository } from "@modules/Notificacao/repositories/INotificacaoRepository";
import { Notificacao } from "@modules/Notificacao/infra/typeorm/entities/Notificacao";
import { AppError } from "shared/errors/AppError";

@injectable()
class MarcarComoLidaUseCase {
    constructor(
        @inject("NotificacaoRepository")
        private notificacaoRepository: INotificacaoRepository
    ) {}

    async execute(id: string): Promise<Notificacao> {
        const notificacao = await this.notificacaoRepository.findById(id);

        if (!notificacao) {
            throw new AppError("Notificação não encontrada!", 404);
        }

        const notificacaoAtualizada = await this.notificacaoRepository.marcarComoLida(id);
        return notificacaoAtualizada;
    }
}

export { MarcarComoLidaUseCase };
