import { getRepository, Repository, In } from "typeorm";
import { ICreateCandidatoDTO } from "modules/Candidato/dtos/ICreateCandidatoDTO";
import { IUpdateCandidatoDTO } from "modules/Candidato/dtos/IUpdateCandidatoDTO";
import { ICandidatoRepository } from "modules/Candidato/repositories/ICandidatoRepository";
import { Candidato } from "../entities/Candidato";

class CandidatoRepository implements ICandidatoRepository {
    private repository: Repository<Candidato>;

    constructor() {
        this.repository = getRepository(Candidato, "vagas");
    }

    async create({
        nome,
        email,
        telefone,
        cidade,
        estado,
        resumo_curriculo,
        areas_atuacao,
        curriculo_url,
        curriculo_upload_date,
        consentimento_dados,
        acesso_expirado
    }: ICreateCandidatoDTO): Promise<Candidato> {
        const candidato = this.repository.create({
            nome,
            email,
            telefone,
            cidade,
            estado,
            resumo_curriculo,
            areas_atuacao,
            curriculo_url,
            curriculo_upload_date,
            consentimento_dados,
            acesso_expirado
        });

        await this.repository.save(candidato);

        return candidato;
    }

    async findById(id: string): Promise<Candidato> {
        const candidato = await this.repository.findOne(id);
        return candidato;
    }

    async findByEmail(email: string): Promise<Candidato> {
        const candidato = await this.repository.findOne({
            where: { email }
        });
        return candidato;
    }

    async findByAreasAtuacao(areas: string[]): Promise<Candidato[]> {
        const candidatos = await this.repository
            .createQueryBuilder("candidato")
            .where("candidato.areas_atuacao && ARRAY[:...areas]", { areas })
            .getMany();

        return candidatos;
    }

    async findAll(): Promise<Candidato[]> {
        const candidatos = await this.repository.find();
        return candidatos;
    }

    async list(limit?: number, offset?: number): Promise<Candidato[]> {
        const query = this.repository.createQueryBuilder("candidato");

        if (offset) {
            query.skip(offset);
        }

        if (limit) {
            query.take(limit);
        }

        const candidatos = await query
            .orderBy("candidato.created_at", "DESC")
            .getMany();

        return candidatos;
    }

    async update({
        id,
        nome,
        email,
        telefone,
        cidade,
        estado,
        resumo_curriculo,
        areas_atuacao,
        curriculo_url,
        curriculo_upload_date
    }: IUpdateCandidatoDTO): Promise<Candidato> {
        const candidato = await this.repository.findOne(id);

        if (nome) candidato.nome = nome;
        if (email) candidato.email = email;
        if (telefone) candidato.telefone = telefone;
        if (cidade) candidato.cidade = cidade;
        if (estado) candidato.estado = estado;
        if (resumo_curriculo) candidato.resumo_curriculo = resumo_curriculo;
        if (areas_atuacao) candidato.areas_atuacao = areas_atuacao;
        if (curriculo_url) candidato.curriculo_url = curriculo_url;
        if (curriculo_upload_date) candidato.curriculo_upload_date = curriculo_upload_date;

        await this.repository.save(candidato);

        return candidato;
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}

export { CandidatoRepository };
