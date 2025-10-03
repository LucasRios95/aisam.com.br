import { PerfilRecrutador, StatusRecrutador } from "../infra/typeorm/entities/Recrutador";

interface IUpdateRecrutadorDTO {
    id: string;
    nome?: string;
    email?: string;
    perfil?: PerfilRecrutador;
    status?: StatusRecrutador;
    associado_id?: string;
}

export { IUpdateRecrutadorDTO };
