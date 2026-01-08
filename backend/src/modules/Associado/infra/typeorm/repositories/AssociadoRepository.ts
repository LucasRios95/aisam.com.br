import { getRepository, Repository } from "typeorm";
import { Associado } from "../entities/Associado";
import { IAssociadoRepository } from "@modules/Associado/repositories/IAssociadoRepository";
import { ICreateAssociadoDTO } from "@modules/Associado/dtos/ICreateAssociadoDTO";
import { IUpdateAssociadoDTO } from "@modules/Associado/dtos/IUpdateAssociadoDTO";


class AssociadoRepository implements IAssociadoRepository {
    private associadoRepository: Repository<Associado>;

    constructor() {
        this.associadoRepository = getRepository(Associado, "vagas");
    }

    async create({
        razao_social,
        nome_fantasia,
        cnpj,
        email,
        telefone,
        endereco,
        cidade,
        estado,
        cep,
        status,
        created_at,

    }: ICreateAssociadoDTO): Promise<Associado> {
        const associado = this.associadoRepository.create({
            razao_social,
            nome_fantasia,
            cnpj,
            email,
            telefone,
            endereco,
            cidade,
            estado,
            cep,
            status,
            created_at,
        });


        await this.associadoRepository.save(associado);

        return associado;

    }

    async update({
        id,
        razao_social,
        nome_fantasia,
        email,
        telefone,
        endereco,
        cidade,
        estado,
        cep,
        status
    }: IUpdateAssociadoDTO): Promise<Associado> {
        const associado = await this.associadoRepository.findOne(id);

        if (!associado) {
            throw new Error("Associado não encontrado");
        }

        // Atualizar apenas os campos fornecidos
        if (razao_social !== undefined) associado.razao_social = razao_social;
        if (nome_fantasia !== undefined) associado.nome_fantasia = nome_fantasia;
        if (email !== undefined) associado.email = email;
        if (telefone !== undefined) associado.telefone = telefone;
        if (endereco !== undefined) associado.endereco = endereco;
        if (cidade !== undefined) associado.cidade = cidade;
        if (estado !== undefined) associado.estado = estado;
        if (cep !== undefined) associado.cep = cep;
        if (status !== undefined) associado.status = status;

        await this.associadoRepository.save(associado);

        return associado;
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