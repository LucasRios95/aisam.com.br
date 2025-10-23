import { getRepository, Repository } from "typeorm";
import { IAreaAtuacaoRepository } from "../../../repositories/IAreaAtuacaoRepository";
import { ICreateAreaAtuacaoDTO } from "../../../dtos/ICreateAreaAtuacaoDTO";
import { AreaAtuacao } from "../entities/AreaAtuacao";

export class AreaAtuacaoRepository implements IAreaAtuacaoRepository {
    private repository: Repository<AreaAtuacao>;

    constructor() {
        this.repository = getRepository(AreaAtuacao, "vagas");
    }

    async create(data: ICreateAreaAtuacaoDTO): Promise<AreaAtuacao> {
        const area = this.repository.create(data);
        await this.repository.save(area);
        return area;
    }

    async findById(id: string): Promise<AreaAtuacao | undefined> {
        const area = await this.repository.findOne(id);
        return area;
    }

    async findBySlug(slug: string): Promise<AreaAtuacao | undefined> {
        const area = await this.repository.findOne({ where: { slug } });
        return area;
    }

    async findByNome(nome: string): Promise<AreaAtuacao | undefined> {
        const area = await this.repository.findOne({ where: { nome } });
        return area;
    }

    async list(): Promise<AreaAtuacao[]> {
        const areas = await this.repository.find({
            order: { nome: "ASC" }
        });
        return areas;
    }

    async listAtivas(): Promise<AreaAtuacao[]> {
        const areas = await this.repository.find({
            where: { ativo: true },
            order: { nome: "ASC" }
        });
        return areas;
    }

    async update(area: AreaAtuacao): Promise<AreaAtuacao> {
        await this.repository.save(area);
        return area;
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}
