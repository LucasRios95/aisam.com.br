import { getRepository, Repository } from "typeorm";
import { Associado } from "../entities/Associado";
import { IAssociadoRepository } from "modules/Associado/repositories/IAssociadoRepository";
import { ICreateAssociadoDTO } from "modules/Associado/dtos/ICreateAssociadoDTO";
import { IUpdateAssociadoDTO } from "modules/Associado/dtos/IUpdateAssociadoDTO";


class AssociadoRepository implements IAssociadoRepository {
    private associadoRepository: Repository<Associado>;

    constructor() {
        this.associadoRepository = getRepository(Associado);
    }

    async create({
        razao_social,
        cnpj,
        status,
        created_at,

    }: ICreateAssociadoDTO): Promise<Associado> {
        const associado = this.associadoRepository.create({
            razao_social,
            cnpj,
            status,
            created_at,
        });


        await this.associadoRepository.save(associado);

        return associado;

    }

    async update({
        razao_social,
        cnpj,
        status,
        updated_at
    }: IUpdateAssociadoDTO): Promise<void> {
        await this.associadoRepository.save({
            razao_social,
            cnpj,
            status,
            updated_at
        });
    }

    async list(): Promise<Associado[]> {
        const associados = await this.associadoRepository.find();

        return associados;
    }

    async delete(id: string): Promise<boolean> {
        const isDeleted = await this.associadoRepository.delete(id)

        if (!isDeleted) {
            throw new Error("Erro ao deletar associado")

        }


        return true;
    }

    async findById(id: string): Promise<Associado | undefined> {
        const associado = await this.associadoRepository.findOne(id);

        return associado;

    }

    findByCnpj(cnpj: string): Promise<Associado | undefined> {
        const associado = this.associadoRepository.findOne({ cnpj })

        return associado;
    }

}

export { AssociadoRepository }