import { Repository, getRepository } from "typeorm";
import { AdminAisam } from "../entities/AdminAisam";
import { IAdminAisamRepository } from "modules/AdminAisam/repositories/IAdminAisamRepository";
import { ICreateAdminAisamDTO } from "modules/AdminAisam/dtos/ICreateAdminAisam";


class AdminAisamRepository implements IAdminAisamRepository {
    private repository: Repository<AdminAisam>;

    constructor() {
        this.repository = getRepository(AdminAisam);
    }

    async create({
        id,
        nome,
        email,
        senha,
        mfa_enabled,
    }: ICreateAdminAisamDTO): Promise<AdminAisam> {
        const admin_aisam = this.repository.create({
            id,
            nome,
            email,
            senha,
            mfa_enabled,
        });

        await this.repository.save(admin_aisam);

        return admin_aisam;
    }

    async list(): Promise<AdminAisam[]> {
        const listUsers = await this.repository.find();
        return listUsers;
    }

    async findById(id: string): Promise<AdminAisam> {
        const user = await this.repository.findOne(id);
        return user;
    }

    async findByEmail(email: string): Promise<AdminAisam> {
        const user = await this.repository.findOne({ email });
        return user;
    }

    async delete(id: string): Promise<boolean> {
        const isDeleted = await this.repository.delete(id)

        if (!isDeleted) {
            throw new Error("Erro ao deletar pedido")
        }

        return true;
    }
}

export { AdminAisamRepository };

