import { Router, Request, Response } from "express";
import { getConnectionManager } from "typeorm";

const healthRoutes = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Verifica o status da aplicação
 *     description: Retorna informações sobre a saúde da aplicação, incluindo status do banco de dados, uptime e memória
 *     responses:
 *       200:
 *         description: Aplicação saudável
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Health'
 *       503:
 *         description: Aplicação não saudável
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Health'
 */
healthRoutes.get("/", async (request: Request, response: Response) => {
    try {
        // Verificar conexões com o banco de dados
        const connectionManager = getConnectionManager();
        const connections = connectionManager.connections;

        const dbStatus = connections.map(conn => ({
            name: conn.name,
            isConnected: conn.isConnected
        }));

        const allConnected = connections.every(conn => conn.isConnected);

        // Informações básicas de saúde
        const healthInfo = {
            status: allConnected ? "healthy" : "unhealthy",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || "development",
            version: "1.0.0",
            database: {
                status: allConnected ? "connected" : "disconnected",
                connections: dbStatus
            },
            memory: {
                used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
                total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
                unit: "MB"
            }
        };

        // Retornar status 503 se não estiver saudável
        const statusCode = allConnected ? 200 : 503;

        return response.status(statusCode).json(healthInfo);
    } catch (error) {
        return response.status(503).json({
            status: "unhealthy",
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});

export { healthRoutes };
