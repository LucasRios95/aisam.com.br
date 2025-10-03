import { getRepository, Repository } from "typeorm";
import { ICreateRecrutadorDTO } from "modules/Recrutador/dtos/ICreateRecrutadorDTO";
import { IUpdateRecrutadorDTO } from "modules/Recrutador/dtos/IUpdateRecrutadorDTO";
import { IRecrutadorRepository } from "modules/Recrutador/repositories/IRecrutadorRepository";
import { Recrutador } from "../entities/Recrutador";

class RecrutadorRepository implements IRecrutadorRepository {
    private repository: Repository<Recrutador>;

    constructor() {
        this.repository = getRepository(Recrutador);
    }

    async create({
        nome,
        email,
        senha,
        perfil,
        status,
        associado_id
    }: ICreateRecrutadorDTO): Promise<Recrutador> {
        const recrutador = this.repository.create({
            nome,
            email,
            senha,
            perfil,
            status,
            associado_id
        });

        await this.repository.save(recrutador);

        return recrutador;
    }

    async findById(id: string): Promise<Recrutador> {
        const recrutador = await this.repository.findOne(id, {
            relations: ["associado"]
        });
        return recrutador;
    }

    async findByEmail(email: string): Promise<Recrutador> {
        const recrutador = await this.repository.findOne({
            where: { email }
        });
        return recrutador;
    }

    async findByConviteToken(token: string): Promise<Recrutador> {
        const recrutador = await this.repository.findOne({
            where: { convite_token: token }
        });
        return recrutador;
    }

    async findByAssociadoId(associado_id: string): Promise<Recrutador[]> {
        const recrutadores = await this.repository.find({
            where: { associado_id },
            relations: ["associado"]
        });
        return recrutadores;
    }

    async list(): Promise<Recrutador[]> {
        const recrutadores = await this.repository.find({
            relations: ["associado"]
        });
        return recrutadores;
    }

    async update({
        id,
        nome,
        email,
        perfil,
        status,
        associado_id
    }: IUpdateRecrutadorDTO): Promise<Recrutador> {
        const recrutador = await this.repository.findOne(id);

        if (nome) recrutador.nome = nome;
        if (email) recrutador.email = email;
        if (perfil) recrutador.perfil = perfil;
        if (status) recrutador.status = status;
        if (associado_id) recrutador.associado_id = associado_id;

        await this.repository.save(recrutador);

        return recrutador;
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}

export { RecrutadorRepository };
