import { ICreateCandidaturaDTO } from "../dtos/ICreateCandidaturaDTO";
import { IFilterCandidaturasDTO } from "../dtos/IFilterCandidaturasDTO";
import { IUpdateStatusCandidaturaDTO } from "../dtos/IUpdateStatusCandidaturaDTO";
import { Candidatura } from "../infra/typeorm/entities/Candidatura";

interface ICandidaturaRepository {
    create(data: ICreateCandidaturaDTO): Promise<Candidatura>;
    findById(id: string): Promise<Candidatura | undefined>;
    findByCandidatoAndVaga(candidato_id: string, vaga_id: string): Promise<Candidatura | undefined>;
    list(filters?: IFilterCandidaturasDTO): Promise<Candidatura[]>;
    updateStatus(data: IUpdateStatusCandidaturaDTO): Promise<Candidatura>;
    delete(id: string): Promise<void>;
}

export { ICandidaturaRepository };
