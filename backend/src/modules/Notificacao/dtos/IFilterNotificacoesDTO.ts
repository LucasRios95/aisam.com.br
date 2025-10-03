import { TipoNotificacao } from "../infra/typeorm/entities/Notificacao";

interface IFilterNotificacoesDTO {
    destinatario_id?: string;
    tipo?: TipoNotificacao;
    lida?: boolean;
    limit?: number;
    offset?: number;
}

export { IFilterNotificacoesDTO };
