import { Request, Response, NextFunction } from "express";
import { AppError } from "@shared/errors/AppError";

export function ensureRecrutador(
    request: Request,
    response: Response,
    next: NextFunction
) {
    const { role } = request.user;

    if (role !== "RECRUTADOR" && role !== "ADMIN_AISAM") {
        throw new AppError("Acesso negado. Apenas recrutadores.", 403);
    }

    next();
}
