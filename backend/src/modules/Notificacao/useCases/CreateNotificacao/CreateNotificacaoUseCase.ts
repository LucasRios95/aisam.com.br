import { inject, injectable } from "tsyringe";
import { INotificacaoRepository } from "@modules/Notificacao/repositories/INotificacaoRepository";
import { Notificacao, TipoNotificacao } from "@modules/Notificacao/infra/typeorm/entities/Notificacao";

interface IRequest {
    destinatario_id: string;
    tipo: TipoNotificacao;
    titulo: string;
    mensagem: string;
    metadata?: any;
}

@injectable()
class CreateNotificacaoUseCase {
    constructor(
        @inject("NotificacaoRepository")
        private notificacaoRepository: INotificacaoRepository
    ) {}

    async execute({ destinatario_id, tipo, titulo, mensagem, metadata }: IRequest): Promise<Notificacao> {
        const notificacao = await this.notificacaoRepository.create({
            destinatario_id,
            tipo,
            titulo,
            mensagem,
            metadata
        });

        return notificacao;
    }
}

export { CreateNotificacaoUseCase };
