import { StatusAssociado } from "../infra/typeorm/entities/Associado";

interface IUpdateAssociadoDTO {
    id?: string;
    razao_social: string;
    cnpj: string;
    status: StatusAssociado;
    updated_at: Date;
}

export { IUpdateAssociadoDTO }