import { Request, Response, NextFunction } from 'express';
import { logger } from '@config/logger';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();

    // Capturar o fim da resposta
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const { method, originalUrl, ip } = req;
        const { statusCode } = res;

        const logLevel = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';

        logger.log(logLevel, 'HTTP Request', {
            method,
            url: originalUrl,
            statusCode,
            duration: `${duration}ms`,
            ip,
            userAgent: req.get('user-agent'),
        });
    });

    next();
}
