import { TipoNotificacao } from "../infra/typeorm/entities/Notificacao";

interface ICreateNotificacaoDTO {
    destinatario_id: string;
    tipo: TipoNotificacao;
    titulo: string;
    mensagem: string;
    metadata?: any;
}

export { ICreateNotificacaoDTO };
