import { inject, injectable } from "tsyringe";
import { INotificacaoRepository } from "modules/Notificacao/repositories/INotificacaoRepository";
import { Notificacao, TipoNotificacao } from "modules/Notificacao/infra/typeorm/entities/Notificacao";

interface IRequest {
    destinatario_id?: string;
    tipo?: TipoNotificacao;
    lida?: boolean;
    limit?: number;
    offset?: number;
}

@injectable()
class ListNotificacoesUseCase {
    constructor(
        @inject("NotificacaoRepository")
        private notificacaoRepository: INotificacaoRepository
    ) {}

    async execute(filters: IRequest): Promise<Notificacao[]> {
        const notificacoes = await this.notificacaoRepository.list(filters);
        return notificacoes;
    }
}

export { ListNotificacoesUseCase };
