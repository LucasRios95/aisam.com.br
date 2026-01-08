require('dotenv').config();

module.exports = process.env.DATABASE_URL
    ? [
        {
            name: "default",
            type: "postgres",
            url: process.env.DATABASE_URL,
            entities: ["./src/modules/**/entities/*.ts"],
            migrations: ["./src/shared/infra/typeorm/migrations/*.ts"],
            cli: {
                migrationsDir: "./src/shared/infra/typeorm/migrations"
            },
            ssl: {
                rejectUnauthorized: false
            }
        }
    ]
    : [
        {
            name: "default",
            type: "postgres",
            host: process.env.DB_HOST || "database_aisam",
            port: parseInt(process.env.DB_PORT) || 5432,
            username: process.env.DB_USER || "docker",
            password: process.env.DB_PASS || "Lc_150595",
            database: process.env.DB_NAME || "database_aisam",
            entities: ["./src/modules/**/entities/*.ts"],
            migrations: ["./src/shared/infra/typeorm/migrations/*.ts"],
            cli: {
                migrationsDir: "./src/shared/infra/typeorm/migrations"
            }
        }
    ];
