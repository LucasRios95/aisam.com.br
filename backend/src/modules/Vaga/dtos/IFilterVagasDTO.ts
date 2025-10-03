import { RegimeTrabalho, Senioridade, StatusVaga } from "../infra/typeorm/entities/Vaga";

interface IFilterVagasDTO {
    areas_atuacao?: string[];
    senioridade?: Senioridade;
    regime?: RegimeTrabalho;
    localidade?: string;
    status?: StatusVaga;
    limit?: number;
    offset?: number;
}

export { IFilterVagasDTO };
