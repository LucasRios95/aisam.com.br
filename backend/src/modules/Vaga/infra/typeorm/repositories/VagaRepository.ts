import { getRepository, Repository } from "typeorm";
import { ICreateVagaDTO } from "modules/Vaga/dtos/ICreateVagaDTO";
import { IUpdateVagaDTO } from "modules/Vaga/dtos/IUpdateVagaDTO";
import { IFilterVagasDTO } from "modules/Vaga/dtos/IFilterVagasDTO";
import { IVagaRepository } from "modules/Vaga/repositories/IVagaRepository";
import { Vaga } from "../entities/Vaga";

class VagaRepository implements IVagaRepository {
    private repository: Repository<Vaga>;

    constructor() {
        this.repository = getRepository(Vaga);
    }

    async create({
        titulo,
        descricao,
        senioridade,
        areas_atuacao,
        regime,
        localidade,
        email_contato,
        empresa_anonima,
        status,
        recrutador_id,
        associado_id
    }: ICreateVagaDTO): Promise<Vaga> {
        const vaga = this.repository.create({
            titulo,
            descricao,
            senioridade,
            areas_atuacao,
            regime,
            localidade,
            email_contato,
            empresa_anonima,
            status,
            recrutador_id,
            associado_id
        });

        await this.repository.save(vaga);

        return vaga;
    }

    async findById(id: string): Promise<Vaga> {
        const vaga = await this.repository.findOne(id, {
            relations: ["recrutador", "associado"]
        });
        return vaga;
    }

    async findByRecrutadorId(recrutador_id: string): Promise<Vaga[]> {
        const vagas = await this.repository.find({
            where: { recrutador_id },
            relations: ["recrutador", "associado"],
            order: { created_at: "DESC" }
        });
        return vagas;
    }

    async findByAssociadoId(associado_id: string): Promise<Vaga[]> {
        const vagas = await this.repository.find({
            where: { associado_id },
            relations: ["recrutador", "associado"],
            order: { created_at: "DESC" }
        });
        return vagas;
    }

    async list(filters?: IFilterVagasDTO): Promise<Vaga[]> {
        const query = this.repository
            .createQueryBuilder("vaga")
            .leftJoinAndSelect("vaga.recrutador", "recrutador")
            .leftJoinAndSelect("vaga.associado", "associado");

        if (filters) {
            if (filters.areas_atuacao && filters.areas_atuacao.length > 0) {
                query.andWhere("vaga.areas_atuacao && ARRAY[:...areas]", { areas: filters.areas_atuacao });
            }

            if (filters.senioridade) {
                query.andWhere("vaga.senioridade = :senioridade", { senioridade: filters.senioridade });
            }

            if (filters.regime) {
                query.andWhere("vaga.regime = :regime", { regime: filters.regime });
            }

            if (filters.localidade) {
                query.andWhere("vaga.localidade ILIKE :localidade", { localidade: `%${filters.localidade}%` });
            }

            if (filters.status) {
                query.andWhere("vaga.status = :status", { status: filters.status });
            }

            if (filters.offset) {
                query.skip(filters.offset);
            }

            if (filters.limit) {
                query.take(filters.limit);
            }
        }

        const vagas = await query
            .orderBy("vaga.created_at", "DESC")
            .getMany();

        return vagas;
    }

    async update({
        id,
        titulo,
        descricao,
        senioridade,
        areas_atuacao,
        regime,
        localidade,
        email_contato,
        empresa_anonima,
        status
    }: IUpdateVagaDTO): Promise<Vaga> {
        const vaga = await this.repository.findOne(id);

        if (titulo) vaga.titulo = titulo;
        if (descricao) vaga.descricao = descricao;
        if (senioridade) vaga.senioridade = senioridade;
        if (areas_atuacao) vaga.areas_atuacao = areas_atuacao;
        if (regime) vaga.regime = regime;
        if (localidade !== undefined) vaga.localidade = localidade;
        if (email_contato) vaga.email_contato = email_contato;
        if (empresa_anonima !== undefined) vaga.empresa_anonima = empresa_anonima;
        if (status) vaga.status = status;

        await this.repository.save(vaga);

        return vaga;
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}

export { VagaRepository };
