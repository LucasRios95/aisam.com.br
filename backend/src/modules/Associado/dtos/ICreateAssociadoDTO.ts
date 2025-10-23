import { StatusAssociado } from "../infra/typeorm/entities/Associado";

interface ICreateAssociadoDTO {
    id?: string;
    razao_social: string;
    nome_fantasia?: string;
    cnpj: string;
    email: string;
    telefone?: string;
    endereco?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
    status?: StatusAssociado;
    created_at?: Date;
}

export { ICreateAssociadoDTO }