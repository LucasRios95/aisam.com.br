import { Request, Response, NextFunction } from "express";
import { AppError } from "shared/errors/AppError";
import { getRepository } from "typeorm";
import { Recrutador } from "modules/Recrutador/infra/typeorm/entities/Recrutador";

/**
 * Middleware que permite acesso a admins ou ao próprio recrutador/associado dono do registro
 */
export async function ensureAdminOrRecrutadorOwner(
    request: Request,
    response: Response,
    next: NextFunction
) {
    const { role, sub: userId } = request.user;
    const { id: recrutadorId } = request.params;

    // Admin tem acesso total
    if (role === "ADMIN_AISAM") {
        return next();
    }

    // Se for recrutador, verificar se é o próprio recrutador
    if (role === "RECRUTADOR") {
        if (userId !== recrutadorId) {
            throw new AppError("Acesso negado. Você só pode atualizar seu próprio perfil.", 403);
        }
        return next();
    }

    throw new AppError("Acesso negado.", 403);
}
