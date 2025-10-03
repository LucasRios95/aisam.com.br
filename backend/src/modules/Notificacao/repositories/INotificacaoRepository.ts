import { ICreateNotificacaoDTO } from "../dtos/ICreateNotificacaoDTO";
import { IFilterNotificacoesDTO } from "../dtos/IFilterNotificacoesDTO";
import { Notificacao } from "../infra/typeorm/entities/Notificacao";

interface INotificacaoRepository {
    create(data: ICreateNotificacaoDTO): Promise<Notificacao>;
    findById(id: string): Promise<Notificacao | undefined>;
    list(filters?: IFilterNotificacoesDTO): Promise<Notificacao[]>;
    marcarComoLida(id: string): Promise<Notificacao>;
    marcarTodasComoLidas(destinatario_id: string): Promise<void>;
    delete(id: string): Promise<void>;
}

export { INotificacaoRepository };
