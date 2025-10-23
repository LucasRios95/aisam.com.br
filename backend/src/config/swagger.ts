import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'AISAM - API de Recrutamento e Seleção',
            version: '1.0.0',
            description: 'Sistema de gestão de vagas, candidatos e processos seletivos da AISAM',
            contact: {
                name: 'AISAM',
                email: 'contato@aisam.com.br',
                url: 'https://aisam.com.br',
            },
            license: {
                name: 'Proprietário',
                url: 'https://aisam.com.br',
            },
        },
        servers: [
            {
                url: process.env.API_URL || 'http://localhost:3333',
                description: 'Servidor de ' + (process.env.NODE_ENV || 'desenvolvimento'),
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Token JWT obtido após autenticação',
                },
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            description: 'Mensagem de erro',
                        },
                    },
                },
                ValidationError: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            description: 'Mensagem de erro de validação',
                        },
                    },
                },
                Candidato: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                        },
                        nome: {
                            type: 'string',
                            example: 'João Silva',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'joao@example.com',
                        },
                        telefone: {
                            type: 'string',
                            example: '(11) 98765-4321',
                        },
                        cidade: {
                            type: 'string',
                            example: 'São Paulo',
                        },
                        estado: {
                            type: 'string',
                            example: 'SP',
                        },
                        resumo_curriculo: {
                            type: 'string',
                        },
                        areas_atuacao: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                        },
                        curriculo_url: {
                            type: 'string',
                            nullable: true,
                        },
                        consentimento_dados: {
                            type: 'boolean',
                        },
                        acesso_expirado: {
                            type: 'string',
                            format: 'date-time',
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time',
                        },
                        updated_at: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
                CreateCandidato: {
                    type: 'object',
                    required: ['nome', 'email', 'telefone', 'cidade', 'estado', 'resumo_curriculo', 'consentimento_dados'],
                    properties: {
                        nome: {
                            type: 'string',
                            minLength: 3,
                            maxLength: 255,
                            example: 'João Silva',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'joao@example.com',
                        },
                        telefone: {
                            type: 'string',
                            pattern: '^(\\(?\\d{2}\\)?\\s?)?9?\\d{4}-?\\d{4}$',
                            example: '(11) 98765-4321',
                        },
                        cidade: {
                            type: 'string',
                            minLength: 2,
                            maxLength: 100,
                            example: 'São Paulo',
                        },
                        estado: {
                            type: 'string',
                            pattern: '^[A-Z]{2}$',
                            example: 'SP',
                        },
                        resumo_curriculo: {
                            type: 'string',
                            minLength: 50,
                            maxLength: 5000,
                        },
                        areas_atuacao: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                        },
                        consentimento_dados: {
                            type: 'boolean',
                        },
                    },
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        recrutador: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'string',
                                    format: 'uuid',
                                },
                                nome: {
                                    type: 'string',
                                },
                                email: {
                                    type: 'string',
                                    format: 'email',
                                },
                                perfil: {
                                    type: 'string',
                                },
                            },
                        },
                        token: {
                            type: 'string',
                            description: 'Token JWT para autenticação',
                        },
                    },
                },
                Health: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            enum: ['healthy', 'unhealthy'],
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time',
                        },
                        uptime: {
                            type: 'number',
                            description: 'Tempo de atividade em segundos',
                        },
                        environment: {
                            type: 'string',
                        },
                        version: {
                            type: 'string',
                        },
                        database: {
                            type: 'object',
                            properties: {
                                status: {
                                    type: 'string',
                                    enum: ['connected', 'disconnected'],
                                },
                                connections: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            name: {
                                                type: 'string',
                                            },
                                            isConnected: {
                                                type: 'boolean',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        memory: {
                            type: 'object',
                            properties: {
                                used: {
                                    type: 'number',
                                },
                                total: {
                                    type: 'number',
                                },
                                unit: {
                                    type: 'string',
                                },
                            },
                        },
                    },
                },
            },
        },
        tags: [
            {
                name: 'Health',
                description: 'Endpoints de saúde e status da aplicação',
            },
            {
                name: 'Autenticação',
                description: 'Endpoints de autenticação e autorização',
            },
            {
                name: 'Candidatos',
                description: 'Gestão de candidatos',
            },
            {
                name: 'Associados',
                description: 'Gestão de empresas associadas',
            },
            {
                name: 'Vagas',
                description: 'Gestão de vagas de emprego',
            },
            {
                name: 'Recrutadores',
                description: 'Gestão de recrutadores',
            },
        ],
    },
    apis: ['./src/shared/infra/http/routes/*.ts'], // Caminhos para os arquivos com anotações
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerSpec };
