import { Request, Response, NextFunction } from "express";
import { RateLimiterMemory } from "rate-limiter-flexible";
import { AppError } from "@shared/errors/AppError";

// Configuração do rate limiter (em memória)
const rateLimiter = new RateLimiterMemory({
    points: 5, // 5 tentativas
    duration: 900, // em 15 minutos (900 segundos)
    blockDuration: 900 // Bloquear por 15 minutos após atingir o limite
});

export async function rateLimiterMiddleware(
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> {
    try {
        // Usa o IP do cliente como chave
        const key = request.ip;

        await rateLimiter.consume(key);

        next();
    } catch (error) {
        throw new AppError(
            "Muitas tentativas de login. Por favor, tente novamente em 15 minutos.",
            429
        );
    }
}
