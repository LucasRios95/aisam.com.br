import { ICreateAreaAtuacaoDTO } from "../dtos/ICreateAreaAtuacaoDTO";
import { AreaAtuacao } from "../infra/typeorm/entities/AreaAtuacao";

export interface IAreaAtuacaoRepository {
    create(data: ICreateAreaAtuacaoDTO): Promise<AreaAtuacao>;
    findById(id: string): Promise<AreaAtuacao | undefined>;
    findBySlug(slug: string): Promise<AreaAtuacao | undefined>;
    findByNome(nome: string): Promise<AreaAtuacao | undefined>;
    list(): Promise<AreaAtuacao[]>;
    listAtivas(): Promise<AreaAtuacao[]>;
    update(area: AreaAtuacao): Promise<AreaAtuacao>;
    delete(id: string): Promise<void>;
}
