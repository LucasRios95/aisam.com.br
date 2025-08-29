import { Associado } from "../infra/typeorm/entities/Associado";
import { ICreateAssociadoDTO } from "../dtos/ICreateAssociadoDTO";

interface IAssociadoRepository {
    create(data: ICreateAssociadoDTO): Promise<Associado>;
    update(data: ICreateAssociadoDTO): Promise<Associado>;
    delete(id: string): Promise<void>;
    findById(id: string): Promise<Associado | undefined>;
    findByCnpj(cnpj: string): Promise<Associado | undefined>;
}

export { IAssociadoRepository }