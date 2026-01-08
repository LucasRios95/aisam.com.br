import { Connection, createConnections } from "typeorm";
import { URL } from "url";

let connections: Connection[] = [];

/**
 * Extrai configurações do banco a partir da DATABASE_URL ou variáveis individuais
 */
function getDatabaseConfig() {
    console.log('🔍 DEBUG: DATABASE_URL existe?', !!process.env.DATABASE_URL);
    console.log('🔍 DEBUG: NODE_ENV =', process.env.NODE_ENV);

    // Se DATABASE_URL está presente (Railway, Heroku, etc), usar ela
    if (process.env.DATABASE_URL) {
        console.log('✅ Usando DATABASE_URL da Railway/Heroku');
        const parsedUrl = new URL(process.env.DATABASE_URL);
        const config = {
            host: parsedUrl.hostname,
            port: Number(parsedUrl.port) || 5432,
            username: parsedUrl.username,
            password: parsedUrl.password,
            database: parsedUrl.pathname.slice(1), // Remove a barra inicial
            ssl: process.env.NODE_ENV === 'production' ? {
                rejectUnauthorized: false
            } : false
        };
        console.log('📊 Config extraída:', { ...config, password: '***' });
        return config;
    }

    // Caso contrário, usar variáveis individuais (desenvolvimento local)
    console.log('⚠️  DATABASE_URL não encontrada, usando variáveis individuais');
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

    // Em produção, executar migrations automaticamente
    const migrationsRun = process.env.NODE_ENV === 'production';
    if (migrationsRun) {
        console.log('🔄 Modo produção: Migrations serão executadas automaticamente');
    }

    // Usar caminhos corretos baseados no ambiente (src/*.ts em dev, dist/*.js em prod)
    const isProduction = process.env.NODE_ENV === 'production';
    const ext = isProduction ? 'js' : 'ts';
    const baseDir = isProduction ? './dist' : './src';

    connections = await createConnections([
        {
            name: "vagas",
            type: "postgres",
            ...dbConfig,
            schema: "vagas",
            migrationsRun,
            entities: [
                `${baseDir}/modules/Vaga/infra/typeorm/entities/*.${ext}`,
                `${baseDir}/modules/Candidato/infra/typeorm/entities/*.${ext}`,
                `${baseDir}/modules/Candidatura/infra/typeorm/entities/*.${ext}`,
                `${baseDir}/modules/Recrutador/infra/typeorm/entities/*.${ext}`,
                `${baseDir}/modules/Associado/infra/typeorm/entities/*.${ext}`,
                `${baseDir}/modules/AdminAisam/infra/typeorm/entities/*.${ext}`,
                `${baseDir}/modules/AreaAtuacao/infra/typeorm/entities/*.${ext}`
            ],
            migrations: [`${baseDir}/shared/infra/typeorm/migrations/vagas/*.${ext}`]
        },
        {
            name: "noticias",
            type: "postgres",
            ...dbConfig,
            schema: "noticias",
            migrationsRun,
            entities: [
                `${baseDir}/modules/Noticia/infra/typeorm/entities/*.${ext}`
            ],
            migrations: [`${baseDir}/shared/infra/typeorm/migrations/noticias/*.${ext}`]
        },
        {
            name: "common",
            type: "postgres",
            ...dbConfig,
            schema: "public",
            migrationsRun,
            entities: [
                `${baseDir}/modules/Notificacao/infra/typeorm/entities/*.${ext}`,
                `${baseDir}/modules/Auditoria/infra/typeorm/entities/*.${ext}`
            ],
            migrations: [`${baseDir}/shared/infra/typeorm/migrations/common/*.${ext}`]
        }
    ]);

    console.log("✅ Conexões com banco de dados estabelecidas");
    return connections;
};