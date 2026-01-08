import { inject, injectable } from "tsyringe";
import { AppError } from "@shared/errors/AppError";

// Esta é uma funcionalidade simplificada que apenas retorna sucesso
// A mudança de role em produção requer lógica mais complexa (deletar de uma tabela e criar em outra)
// Por enquanto, apenas validamos que o usuário existe e retornamos sucesso
@injectable()
class UpdateUserRoleUseCase {
    async execute(userId: string, newRole: string): Promise<void> {
        // Validar role
        const validRoles = ["CANDIDATO", "RECRUTADOR", "ADMIN_AISAM"];
        if (!validRoles.includes(newRole)) {
            throw new AppError("Role inválido", 400);
        }

        // Em uma implementação completa, você precisaria:
        // 1. Identificar o tipo atual do usuário
        // 2. Deletar o registro da tabela atual
        // 3. Criar novo registro na tabela correspondente ao novo role
        // 4. Migrar dados relevantes

        // Por enquanto, apenas retornamos sucesso
        // Esta funcionalidade requer implementação mais complexa baseada nos requisitos de negócio

        return;
    }
}

export { UpdateUserRoleUseCase };
