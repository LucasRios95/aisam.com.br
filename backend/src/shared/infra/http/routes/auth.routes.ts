import { Router } from "express";
import { AuthenticateAdminController } from "modules/AdminAisam/useCases/AuthenticateAdmin/AuthenticateAdminController";
import { AuthenticateRecrutadorController } from "modules/Recrutador/useCases/AuthenticateRecrutador/AuthenticateRecrutadorController";
import { GenerateMagicLinkController } from "modules/Candidato/useCases/GenerateMagicLink/GenerateMagicLinkController";
import { ValidateMagicLinkController } from "modules/Candidato/useCases/ValidateMagicLink/ValidateMagicLinkController";
import { rateLimiterMiddleware } from "../middlewares/rateLimiter";
import { validateDTO } from "../middlewares/validateDTO";
import { AuthenticateRecrutadorDTO } from "modules/Recrutador/dtos/AuthenticateRecrutadorDTO";

const authRoutes = Router();

const authenticateAdminController = new AuthenticateAdminController();
const authenticateRecrutadorController = new AuthenticateRecrutadorController();
const generateMagicLinkController = new GenerateMagicLinkController();
const validateMagicLinkController = new ValidateMagicLinkController();

/**
 * @openapi
 * /auth/recrutador:
 *   post:
 *     tags:
 *       - Autenticação
 *     summary: Autenticação de recrutador
 *     description: Autentica um recrutador usando email e senha, retornando um token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: recrutador@example.com
 *               senha:
 *                 type: string
 *                 minLength: 6
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Autenticação bem-sucedida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       422:
 *         description: Erro de validação
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       429:
 *         description: Muitas tentativas
 */

// Rate limiting aplicado em todas as rotas de autenticação
authRoutes.post("/admin", rateLimiterMiddleware, validateDTO(AuthenticateRecrutadorDTO), authenticateAdminController.handle);
authRoutes.post("/recrutador", rateLimiterMiddleware, validateDTO(AuthenticateRecrutadorDTO), authenticateRecrutadorController.handle);
authRoutes.post("/candidato/magic-link", rateLimiterMiddleware, generateMagicLinkController.handle);
authRoutes.post("/candidato/validate-magic-link", rateLimiterMiddleware, validateMagicLinkController.handle);

export { authRoutes };
