import { RegimeTrabalho, Senioridade, StatusVaga } from "../infra/typeorm/entities/Vaga";

interface ICreateVagaDTO {
    titulo: string;
    descricao: string;
    senioridade: Senioridade;
    areas_atuacao: string[];
    regime: RegimeTrabalho;
    localidade?: string;
    email_contato: string;
    empresa_anonima?: boolean;
    status?: StatusVaga;
    recrutador_id: string;
    associado_id: string;
}

export { ICreateVagaDTO };
