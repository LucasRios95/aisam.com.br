import winston from 'winston';
import path from 'path';

// Formato customizado para logs
const customFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack, ...metadata }) => {
        let msg = `${timestamp} [${level.toUpperCase()}]: ${message}`;

        // Adicionar stack trace se houver
        if (stack) {
            msg += `\n${stack}`;
        }

        // Adicionar metadata se houver
        if (Object.keys(metadata).length > 0) {
            msg += `\n${JSON.stringify(metadata, null, 2)}`;
        }

        return msg;
    })
);

// Criar diretório de logs se não existir
const logsDir = path.resolve(__dirname, '..', '..', 'logs');

// Configuração do logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: {
        service: 'aisam-api',
        environment: process.env.NODE_ENV || 'development'
    },
    transports: [
        // Logs de erro em arquivo separado
        new winston.transports.File({
            filename: path.join(logsDir, 'error.log'),
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),

        // Logs combinados (todos os níveis)
        new winston.transports.File({
            filename: path.join(logsDir, 'combined.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
    ],
    // Não sair em caso de exceção não tratada
    exitOnError: false,
});

// Em desenvolvimento, também logar no console
if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: customFormat,
        })
    );
}

// Em produção, logar apenas no console com formato JSON
if (process.env.NODE_ENV === 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
        })
    );
}

// Capturar exceções não tratadas
logger.exceptions.handle(
    new winston.transports.File({
        filename: path.join(logsDir, 'exceptions.log'),
        maxsize: 5242880,
        maxFiles: 5,
    })
);

// Capturar rejeições de promises não tratadas
logger.rejections.handle(
    new winston.transports.File({
        filename: path.join(logsDir, 'rejections.log'),
        maxsize: 5242880,
        maxFiles: 5,
    })
);

export { logger };
