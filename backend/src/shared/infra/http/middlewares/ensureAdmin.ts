import { Request, Response, NextFunction } from "express";
import { AppError } from "shared/errors/AppError";

export function ensureAdmin(
    request: Request,
    response: Response,
    next: NextFunction
) {
    const { role } = request.user;

    if (role !== "ADMIN_AISAM") {
        throw new AppError("Acesso negado. Apenas administradores.", 403);
    }

    next();
}
