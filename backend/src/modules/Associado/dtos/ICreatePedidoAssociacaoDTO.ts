import { Status } from "../infra/typeorm/entities/Pedido_Associado";

interface ICreatePedidoAssociacao {

    razao_social: string;
    cnpj: string;
    email_corporativo: string;
    setor?: string;
    numero_funcionarios?: number;
    representante: string;
    email_representante?: string;
    telefone?: string;
    endereco?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
    descricao?: string;
    observacao: string;
    status: Status;
    created_at: Date;
}

export { ICreatePedidoAssociacao };