import { ICreateAdminAisamDTO } from "../dtos/ICreateAdminAisam";
import { AdminAisam } from "../infra/typeorm/entities/AdminAisam";


interface IAdminAisamRepository {
    create(data: ICreateAdminAisamDTO): Promise<AdminAisam>;
    list(): Promise<AdminAisam[]>;
    findByEmail(email: string): Promise<AdminAisam>;
    findById(id: string): Promise<AdminAisam>;
    findByResetToken(token: string): Promise<AdminAisam>;
    save(admin: AdminAisam): Promise<AdminAisam>;
    delete(id: string): Promise<boolean>;
}

export { IAdminAisamRepository }