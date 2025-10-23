import { Connection, createConnections } from "typeorm";

let connections: Connection[] = [];

/**
 * Cria múltiplas conexões com o banco de dados, uma para cada aplicação
 * - vagas: Sistema de recrutamento (vagas, candidatos, recrutadores, etc.)
 * - noticias: Sistema de notícias/blog
 * - common: Recursos compartilhados (notificações, auditoria)
 */
export const createDatabaseConnections = async (): Promise<Connection[]> => {
    connections = await createConnections([
        {
            name: "vagas",
            type: "postgres",
            host: process.env.DB_HOST || "localhost",
            port: Number(process.env.DB_PORT) || 5432,
            username: process.env.DB_USER || "docker",
            password: process.env.DB_PASS || "Lc_150595",
            database: process.env.DB_NAME || "database_aisam",
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
            migrations: ["./src/shared/infra/typeorm/migrations/vagas/*.ts"],
            logging: process.env.NODE_ENV === "development"
        },
        {
            name: "noticias",
            type: "postgres",
            host: process.env.DB_HOST || "localhost",
            port: Number(process.env.DB_PORT) || 5432,
            username: process.env.DB_USER || "docker",
            password: process.env.DB_PASS || "Lc_150595",
            database: process.env.DB_NAME || "database_aisam",
            schema: "noticias",
            entities: [
                "./src/modules/Noticia/infra/typeorm/entities/*.ts"
            ],
            migrations: ["./src/shared/infra/typeorm/migrations/noticias/*.ts"],
            logging: process.env.NODE_ENV === "development"
        },
        {
            name: "common",
            type: "postgres",
            host: process.env.DB_HOST || "localhost",
            port: Number(process.env.DB_PORT) || 5432,
            username: process.env.DB_USER || "docker",
            password: process.env.DB_PASS || "Lc_150595",
            database: process.env.DB_NAME || "database_aisam",
            schema: "public",
            entities: [
                "./src/modules/Notificacao/infra/typeorm/entities/*.ts",
                "./src/modules/Auditoria/infra/typeorm/entities/*.ts"
            ],
            migrations: ["./src/shared/infra/typeorm/migrations/common/*.ts"],
            logging: process.env.NODE_ENV === "development"
        }
    ]);

    console.log("✅ Conexões com banco de dados estabelecidas:");
    connections.forEach(conn => {
        console.log(`   - ${conn.name}: schema '${conn.options.schema || 'public'}'`);
    });

    return connections;
};

/**
 * Obtém uma conexão específica pelo nome
 */
export const getConnection = (name: "vagas" | "noticias" | "common"): Connection => {
    const connection = connections.find(conn => conn.name === name);

    if (!connection) {
        throw new Error(`Conexão '${name}' não encontrada. Certifique-se de que createDatabaseConnections() foi chamado.`);
    }

    return connection;
};

/**
 * Fecha todas as conexões
 */
export const closeDatabaseConnections = async (): Promise<void> => {
    await Promise.all(connections.map(conn => conn.close()));
    console.log("✅ Todas as conexões foram fechadas");
};
