import "reflect-metadata"
import "dotenv/config";

import express, { Request, Response, NextFunction } from "express";
import "express-async-errors";
import cors from "cors";
import helmet from "helmet";
import path from "path";

import createConnection from "../typeorm";
import "../../container";

import { router } from "./routes";
import { AppError } from "../../errors/AppError";
import { logger } from "@config/logger";
import { requestLogger } from "./middlewares/requestLogger";
import { initializeSentry, Sentry } from "@config/sentry";

// Inicializar Sentry (deve ser o primeiro)
initializeSentry();

createConnection();
const app = express();

// Sentry request handler (deve ser o primeiro middleware)
app.use(Sentry.Handlers.requestHandler());

// Configurar helmet para segurança
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    crossOriginEmbedderPolicy: false, // Necessário para servir arquivos
}));

// Configurar CORS
const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "http://localhost:8080", // Frontend institucional
    "http://localhost:5174", // Frontend app (admin/recrutador)
    "http://localhost:5175",
];

app.use(cors({
    origin: (origin, callback) => {
        // Permitir requisições sem origin (como Postman, curl, etc.)
        if (!origin) return callback(null, true);

        // Em desenvolvimento, permitir qualquer localhost
        if (process.env.NODE_ENV === 'development' && origin?.includes('localhost')) {
            return callback(null, true);
        }

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            logger.warn('CORS: Origin rejected', { origin });
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(express.json());

// Middleware de logging de requisições
app.use(requestLogger);

// Servir arquivos estáticos (uploads)
app.use("/files", express.static(path.resolve(__dirname, "..", "..", "..", "tmp", "uploads")));

app.use(router);

// Sentry error handler (deve vir antes do error handler customizado)
app.use(Sentry.Handlers.errorHandler());

app.use(
    (err: Error, request: Request, response: Response, next: NextFunction) => {

        if (err instanceof AppError) {
            logger.warn('Application Error', {
                message: err.message,
                statusCode: err.statusCode,
                path: request.path,
                method: request.method,
            });

            // Incluir detalhes de validação se existirem
            const responseData: any = {
                message: err.message
            };

            if ((err as any).validationErrors) {
                responseData.errors = (err as any).validationErrors;
            }

            return response.status(err.statusCode).json(responseData);
        }

        // Logar erros não esperados
        logger.error('Unhandled Error', {
            message: err.message,
            stack: err.stack,
            path: request.path,
            method: request.method,
        });

        // Capturar erro no Sentry (se estiver configurado)
        if (process.env.SENTRY_DSN) {
            Sentry.captureException(err);
        }

        return response.status(500).json({
            status: "error",
            message: `internal server error - ${err.message}`
        });

        next();
    }
);

export { app };