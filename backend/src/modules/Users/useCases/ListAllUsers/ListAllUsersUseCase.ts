import { inject, injectable } from "tsyringe";
import { ICandidatoRepository } from "../../../Candidato/repositories/ICandidatoRepository";
import { IRecrutadorRepository } from "../../../Recrutador/repositories/IRecrutadorRepository";
import { IAdminAisamRepository } from "../../../AdminAisam/repositories/IAdminAisamRepository";

interface IUserResponse {
    user_id: string;
    full_name: string;
    email: string;
    company?: string;
    created_at: Date;
    user_roles: Array<{
        id: string;
        user_id: string;
        role: string;
        approved_by?: string;
        approved_at?: Date;
    }>;
}

@injectable()
class ListAllUsersUseCase {
    constructor(
        @inject("CandidatoRepository")
        private candidatoRepository: ICandidatoRepository,

        @inject("RecrutadorRepository")
        private recrutadorRepository: IRecrutadorRepository,

        @inject("AdminAisamRepository")
        private adminAisamRepository: IAdminAisamRepository
    ) { }

    async execute(): Promise<IUserResponse[]> {
        const users: IUserResponse[] = [];

        // Busca todos os candidatos
        const candidatos = await this.candidatoRepository.list({});
        candidatos.forEach(candidato => {
            users.push({
                user_id: candidato.id,
                full_name: candidato.nome,
                email: candidato.email,
                company: undefined,
                created_at: candidato.created_at,
                user_roles: [{
                    id: candidato.id,
                    user_id: candidato.id,
                    role: "CANDIDATO",
                    approved_by: undefined,
                    approved_at: candidato.created_at
                }]
            });
        });

        // Busca todos os recrutadores
        const recrutadores = await this.recrutadorRepository.list();
        recrutadores.forEach(recrutador => {
            users.push({
                user_id: recrutador.id,
                full_name: recrutador.nome,
                email: recrutador.email,
                company: recrutador.associado?.razao_social || recrutador.associado?.nome_fantasia,
                created_at: recrutador.created_at,
                user_roles: [{
                    id: recrutador.id,
                    user_id: recrutador.id,
                    role: "RECRUTADOR",
                    approved_by: undefined,
                    approved_at: recrutador.created_at
                }]
            });
        });

        // Busca todos os admins
        const admins = await this.adminAisamRepository.list();
        admins.forEach(admin => {
            users.push({
                user_id: admin.id,
                full_name: admin.nome,
                email: admin.email,
                company: "AISAM",
                created_at: admin.created_at,
                user_roles: [{
                    id: admin.id,
                    user_id: admin.id,
                    role: "ADMIN_AISAM",
                    approved_by: undefined,
                    approved_at: admin.created_at
                }]
            });
        });

        // Ordena por data de criação (mais recente primeiro)
        return users.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
    }
}

export { ListAllUsersUseCase };
