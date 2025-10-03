import { StatusCandidatura } from "../infra/typeorm/entities/Candidatura";

interface IUpdateStatusCandidaturaDTO {
    id: string;
    status: StatusCandidatura;
    observacoes_recrutador?: string;
}

export { IUpdateStatusCandidaturaDTO };
