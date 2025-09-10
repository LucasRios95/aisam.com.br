import { Associado } from "../infra/typeorm/entities/Associado";
import { ICreateAssociadoDTO } from "../dtos/ICreateAssociadoDTO";
import { IUpdateAssociadoDTO } from "../dtos/IUpdateAssociadoDTO";

interface IAssociadoRepository {
    create(data: ICreateAssociadoDTO): Promise<Associado>;
    update(data: IUpdateAssociadoDTO): Promise<void>;
    list(): Promise<Associado[]>;
    delete(id: string): Promise<boolean>;
    findById(id: string): Promise<Associado | undefined>;
    findByCnpj(cnpj: string): Promise<Associado | undefined>;
}

export { IAssociadoRepository }