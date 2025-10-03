import { ICreateCandidatoDTO } from "../dtos/ICreateCandidatoDTO";
import { IUpdateCandidatoDTO } from "../dtos/IUpdateCandidatoDTO";
import { Candidato } from "../infra/typeorm/entities/Candidato";

interface ICandidatoRepository {
    create(data: ICreateCandidatoDTO): Promise<Candidato>;
    findById(id: string): Promise<Candidato>;
    findByEmail(email: string): Promise<Candidato>;
    findByAreasAtuacao(areas: string[]): Promise<Candidato[]>;
    findAll(): Promise<Candidato[]>;
    list(limit?: number, offset?: number): Promise<Candidato[]>;
    update(data: IUpdateCandidatoDTO | Candidato): Promise<Candidato>;
    delete(id: string): Promise<void>;
}

export { ICandidatoRepository };
