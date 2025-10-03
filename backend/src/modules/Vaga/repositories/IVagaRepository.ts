import { ICreateVagaDTO } from "../dtos/ICreateVagaDTO";
import { IUpdateVagaDTO } from "../dtos/IUpdateVagaDTO";
import { IFilterVagasDTO } from "../dtos/IFilterVagasDTO";
import { Vaga } from "../infra/typeorm/entities/Vaga";

interface IVagaRepository {
    create(data: ICreateVagaDTO): Promise<Vaga>;
    findById(id: string): Promise<Vaga>;
    findByRecrutadorId(recrutador_id: string): Promise<Vaga[]>;
    findByAssociadoId(associado_id: string): Promise<Vaga[]>;
    list(filters?: IFilterVagasDTO): Promise<Vaga[]>;
    update(data: IUpdateVagaDTO): Promise<Vaga>;
    delete(id: string): Promise<void>;
}

export { IVagaRepository };
