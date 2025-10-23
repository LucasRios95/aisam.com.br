import { Request, Response, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { AppError } from '@shared/errors/AppError';

export function validateDTO(dtoClass: any) {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Converter o body para a classe DTO
        const dtoInstance = plainToClass(dtoClass, req.body);

        // Validar o DTO
        const errors: ValidationError[] = await validate(dtoInstance);

        if (errors.length > 0) {
            // Formatar os erros de validação
            const formattedErrors = errors.map(error => ({
                field: error.property,
                constraints: error.constraints,
                messages: Object.values(error.constraints || {})
            }));

            // Criar uma mensagem de erro mais amigável
            const errorMessages = formattedErrors
                .map(error => error.messages.join(', '))
                .join('; ');

            throw new AppError(`Erro de validação: ${errorMessages}`, 422);
        }

        // Se passou na validação, substituir o body pelo DTO validado
        req.body = dtoInstance;
        next();
    };
}
