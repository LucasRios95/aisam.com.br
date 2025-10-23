import { Connection, createConnections } from "typeorm";

let connections: Connection[] = [];

/**
 * Cria múltiplas conexões com o banco de dados
 */
export default async (): Promise<Connection[]> => {
    if (connections.length > 0) {
        return connections;
    }

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
            migrations: ["./src/shared/infra/typeorm/migrations/vagas/*.ts"]
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
            migrations: ["./src/shared/infra/typeorm/migrations/noticias/*.ts"]
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
            migrations: ["./src/shared/infra/typeorm/migrations/common/*.ts"]
        }
    ]);

    console.log("✅ Conexões com banco de dados estabelecidas");
    return connections;
};