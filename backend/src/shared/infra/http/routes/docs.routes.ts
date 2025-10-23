import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '@config/swagger';

const docsRoutes = Router();

// Endpoint para servir a especificação OpenAPI em JSON
docsRoutes.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// Endpoint para servir a interface do Swagger UI
docsRoutes.use('/', swaggerUi.serve);
docsRoutes.get('/', swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'AISAM API - Documentação',
    customCss: '.swagger-ui .topbar { display: none }',
}));

export { docsRoutes };
