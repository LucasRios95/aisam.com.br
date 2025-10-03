import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { AppError } from "shared/errors/AppError";
import authConfig from "config/auth";

interface IPayload {
    sub: string;
    role: "ADMIN_AISAM" | "RECRUTADOR" | "CANDIDATO";
}

export function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction
) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw new AppError("Token não fornecido", 401);
    }

    const [, token] = authHeader.split(" ");

    try {
        const { sub: user_id, role } = verify(
            token,
            authConfig.jwt.secret
        ) as IPayload;

        request.user = {
            id: user_id,
            role
        };

        next();
    } catch {
        throw new AppError("Token inválido", 401);
    }
}
