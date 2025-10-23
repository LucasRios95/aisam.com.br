import { StatusAssociado } from "../infra/typeorm/entities/Associado";

interface IUpdateAssociadoDTO {
    id: string;
    razao_social?: string;
    nome_fantasia?: string;
    email?: string;
    telefone?: string;
    endereco?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
    status?: StatusAssociado;
}

export { IUpdateAssociadoDTO }