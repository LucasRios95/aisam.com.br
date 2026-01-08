import { Repository, getRepository } from "typeorm";
import { ICandidaturaRepository } from "@modules/Candidatura/repositories/ICandidaturaRepository";
import { ICreateCandidaturaDTO } from "@modules/Candidatura/dtos/ICreateCandidaturaDTO";
import { IFilterCandidaturasDTO } from "@modules/Candidatura/dtos/IFilterCandidaturasDTO";
import { IUpdateStatusCandidaturaDTO } from "@modules/Candidatura/dtos/IUpdateStatusCandidaturaDTO";
import { Candidatura } from "../entities/Candidatura";

class CandidaturaRepository implements ICandidaturaRepository {
    private repository: Repository<Candidatura>;

    constructor() {
        this.repository = getRepository(Candidatura, "vagas");
    }

    async create(data: ICreateCandidaturaDTO): Promise<Candidatura> {
        const candidatura = this.repository.create(data);
        await this.repository.save(candidatura);
        return candidatura;
    }

    async findById(id: string): Promise<Candidatura | undefined> {
        const candidatura = await this.repository.findOne({
            where: { id },
            relations: ["candidato", "vaga", "vaga.associado", "vaga.recrutador"]
        });
        return candidatura || undefined;
    }

    async findByCandidatoAndVaga(candidato_id: string, vaga_id: string): Promise<Candidatura | undefined> {
        const candidatura = await this.repository.findOne({
            where: { candidato_id, vaga_id }
        });
        return candidatura || undefined;
    }

    async list(filters?: IFilterCandidaturasDTO): Promise<Candidatura[]> {
        const query = this.repository.createQueryBuilder("candidatura")
            .leftJoinAndSelect("candidatura.candidato", "candidato")
            .leftJoinAndSelect("candidatura.vaga", "vaga")
            .leftJoinAndSelect("vaga.associado", "associado")
            .leftJoinAndSelect("vaga.recrutador", "recrutador");

        if (filters) {
            if (filters.candidato_id) {
                query.andWhere("candidatura.candidato_id = :candidato_id", {
                    candidato_id: filters.candidato_id
                });
            }

            if (filters.vaga_id) {
                query.andWhere("candidatura.vaga_id = :vaga_id", {
                    vaga_id: filters.vaga_id
                });
            }

            if (filters.recrutador_id) {
                query.andWhere("vaga.recrutador_id = :recrutador_id", {
                    recrutador_id: filters.recrutador_id
                });
            }

            if (filters.associado_id) {
                query.andWhere("vaga.associado_id = :associado_id", {
                    associado_id: filters.associado_id
                });
            }

            if (filters.status) {
                query.andWhere("candidatura.status = :status", {
                    status: filters.status
                });
            }

            if (filters.limit) {
                query.take(filters.limit);
            }

            if (filters.offset) {
                query.skip(filters.offset);
            }
        }

        query.orderBy("candidatura.created_at", "DESC");

        const candidaturas = await query.getMany();
        return candidaturas;
    }

    async updateStatus(data: IUpdateStatusCandidaturaDTO): Promise<Candidatura> {
        const candidatura = await this.repository.findOne({
            where: { id: data.id }
        });

        if (!candidatura) {
            throw new Error("Candidatura não encontrada");
        }

        candidatura.status = data.status;

        if (data.observacoes_recrutador !== undefined) {
            candidatura.observacoes_recrutador = data.observacoes_recrutador;
        }

        await this.repository.save(candidatura);
        return candidatura;
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}

export { CandidaturaRepository };
