import { Connection, createConnections } from "typeorm";
import { URL } from "url";

let connections: Connection[] = [];

/**
 * Extrai configurações do banco a partir da DATABASE_URL ou variáveis individuais
 */
function getDatabaseConfig() {
    // Se DATABASE_URL está presente (Railway, Heroku, etc), usar ela
    if (process.env.DATABASE_URL) {
        const parsedUrl = new URL(process.env.DATABASE_URL);
        return {
            host: parsedUrl.hostname,
            port: Number(parsedUrl.port) || 5432,
            username: parsedUrl.username,
            password: parsedUrl.password,
            database: parsedUrl.pathname.slice(1), // Remove a barra inicial
            ssl: process.env.NODE_ENV === 'production' ? {
                rejectUnauthorized: false
            } : false
        };
    }

    // Caso contrário, usar variáveis individuais (desenvolvimento local)
    return {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 5432,
        username: process.env.DB_USER || "docker",
        password: process.env.DB_PASS || "Lc_150595",
        database: process.env.DB_NAME || "database_aisam",
    };
}

/**
 * Cria múltiplas conexões com o banco de dados
 */
export default async (): Promise<Connection[]> => {
    if (connections.length > 0) {
        return connections;
    }

    const dbConfig = getDatabaseConfig();
    console.log(`🔗 [v2] Conectando ao banco: ${dbConfig.database} em ${dbConfig.host}`);

    connections = await createConnections([
        {
            name: "vagas",
            type: "postgres",
            ...dbConfig,
            schema: "vagas",
            entities: [
                "./src/modules/Vaga/infra/typeorm/entities/*.ts",
                "./src/modules/Candidato/infra/typeorm/entities/*.ts",
                "./src/modules/Candidatura/infra/typeorm/entities/*.ts",
                "./src/modules/Recrutador/infra/typeorm/entities/*.ts",
                "./src/modules/Associado/infra/typeorm/entities/*.ts",
                "./src/modules/AdminAisam/infra/typeorm/entities/*.ts",
                "./src/modules/AreaAtuacao/infra/typeorm/entities/*.ts"
            ],
            migrations: ["./src/shared/infra/typeorm/migrations/vagas/*.ts"]
        },
        {
            name: "noticias",
            type: "postgres",
            ...dbConfig,
            schema: "noticias",
            entities: [
                "./src/modules/Noticia/infra/typeorm/entities/*.ts"
            ],
            migrations: ["./src/shared/infra/typeorm/migrations/noticias/*.ts"]
        },
        {
            name: "common",
            type: "postgres",
            ...dbConfig,
            schema: "public",
            entities: [
                "./src/modules/Notificacao/infra/typeorm/entities/*.ts",
                "./src/modules/Auditoria/infra/typeorm/entities/*.ts"
            ],
            migrations: ["./src/shared/infra/typeorm/migrations/common/*.ts"]
        }
    ]);

    console.log("✅ Conexões com banco de dados estabelecidas");
    return connections;
};