import { ICreateRecrutadorDTO } from "../dtos/ICreateRecrutadorDTO";
import { IUpdateRecrutadorDTO } from "../dtos/IUpdateRecrutadorDTO";
import { Recrutador } from "../infra/typeorm/entities/Recrutador";

interface IRecrutadorRepository {
    create(data: ICreateRecrutadorDTO): Promise<Recrutador>;
    findById(id: string): Promise<Recrutador>;
    findByEmail(email: string): Promise<Recrutador>;
    findByConviteToken(token: string): Promise<Recrutador>;
    findByResetToken(token: string): Promise<Recrutador>;
    findByAssociadoId(associado_id: string): Promise<Recrutador[]>;
    list(): Promise<Recrutador[]>;
    update(data: IUpdateRecrutadorDTO | Recrutador): Promise<Recrutador>;
    save(recrutador: Recrutador): Promise<Recrutador>;
    delete(id: string): Promise<void>;
}

export { IRecrutadorRepository };
