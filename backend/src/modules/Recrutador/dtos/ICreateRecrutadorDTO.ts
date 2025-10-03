import { PerfilRecrutador, StatusRecrutador } from "../infra/typeorm/entities/Recrutador";

interface ICreateRecrutadorDTO {
    nome: string;
    email: string;
    senha: string;
    perfil?: PerfilRecrutador;
    status?: StatusRecrutador;
    associado_id?: string;
}

export { ICreateRecrutadorDTO };
