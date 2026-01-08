import { Repository, getRepository } from "typeorm";
import { INotificacaoRepository } from "@modules/Notificacao/repositories/INotificacaoRepository";
import { ICreateNotificacaoDTO } from "@modules/Notificacao/dtos/ICreateNotificacaoDTO";
import { IFilterNotificacoesDTO } from "@modules/Notificacao/dtos/IFilterNotificacoesDTO";
import { Notificacao } from "../entities/Notificacao";

class NotificacaoRepository implements INotificacaoRepository {
    private repository: Repository<Notificacao>;

    constructor() {
        this.repository = getRepository(Notificacao, "common");
    }

    async create(data: ICreateNotificacaoDTO): Promise<Notificacao> {
        const notificacao = this.repository.create(data);
        await this.repository.save(notificacao);
        return notificacao;
    }

    async findById(id: string): Promise<Notificacao | undefined> {
        const notificacao = await this.repository.findOne({
            where: { id }
        });
        return notificacao || undefined;
    }

    async list(filters?: IFilterNotificacoesDTO): Promise<Notificacao[]> {
        const query = this.repository.createQueryBuilder("notificacao");

        if (filters) {
            if (filters.destinatario_id) {
                query.andWhere("notificacao.destinatario_id = :destinatario_id", {
                    destinatario_id: filters.destinatario_id
                });
            }

            if (filters.tipo) {
                query.andWhere("notificacao.tipo = :tipo", {
                    tipo: filters.tipo
                });
            }

            if (filters.lida !== undefined) {
                query.andWhere("notificacao.lida = :lida", {
                    lida: filters.lida
                });
            }

            if (filters.limit) {
                query.take(filters.limit);
            }

            if (filters.offset) {
                query.skip(filters.offset);
            }
        }

        query.orderBy("notificacao.created_at", "DESC");

        const notificacoes = await query.getMany();
        return notificacoes;
    }

    async marcarComoLida(id: string): Promise<Notificacao> {
        const notificacao = await this.repository.findOne({
            where: { id }
        });

        if (!notificacao) {
            throw new Error("Notificação não encontrada");
        }

        notificacao.lida = true;
        await this.repository.save(notificacao);
        return notificacao;
    }

    async marcarTodasComoLidas(destinatario_id: string): Promise<void> {
        await this.repository.update(
            { destinatario_id, lida: false },
            { lida: true }
        );
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}

export { NotificacaoRepository };
