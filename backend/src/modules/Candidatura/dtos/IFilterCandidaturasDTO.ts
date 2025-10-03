import { StatusCandidatura } from "../infra/typeorm/entities/Candidatura";

interface IFilterCandidaturasDTO {
    candidato_id?: string;
    vaga_id?: string;
    status?: StatusCandidatura;
    limit?: number;
    offset?: number;
}

export { IFilterCandidaturasDTO };
