import { AppError } from "@shared/errors/AppError";
import { AuthenticateRecrutadorUseCase } from "./AuthenticateRecrutadorUseCase";
import { IRecrutadorRepository } from "@modules/Recrutador/repositories/IRecrutadorRepository";
import { IHashProvider } from "@shared/container/providers/HashProvider/IHashProvider";
import { Recrutador, StatusRecrutador } from "@modules/Recrutador/infra/typeorm/entities/Recrutador";

// Mocks
let authenticateRecrutadorUseCase: AuthenticateRecrutadorUseCase;
let recrutadorRepositoryMock: jest.Mocked<IRecrutadorRepository>;
let hashProviderMock: jest.Mocked<IHashProvider>;

// Mock do JWT
jest.mock("jsonwebtoken", () => ({
    sign: jest.fn(() => "mocked-jwt-token"),
}));

describe("AuthenticateRecrutadorUseCase", () => {
    beforeEach(() => {
        recrutadorRepositoryMock = {
            findByEmail: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            list: jest.fn(),
            delete: jest.fn(),
        } as any;

        hashProviderMock = {
            generateHash: jest.fn(),
            compareHash: jest.fn(),
        } as any;

        authenticateRecrutadorUseCase = new AuthenticateRecrutadorUseCase(
            recrutadorRepositoryMock,
            hashProviderMock
        );
    });

    it("deve autenticar recrutador com credenciais válidas", async () => {
        // Arrange
        const credentials = {
            email: "recrutador@example.com",
            senha: "senha123",
        };

        const mockRecrutador = {
            id: "recrutador-123",
            nome: "João Recrutador",
            email: credentials.email,
            senha: "hashed-password",
            perfil: "ADMIN",
            status: StatusRecrutador.ATIVO,
        } as Recrutador;

        recrutadorRepositoryMock.findByEmail.mockResolvedValue(mockRecrutador);
        hashProviderMock.compareHash.mockResolvedValue(true);

        // Act
        const result = await authenticateRecrutadorUseCase.execute(credentials);

        // Assert
        expect(recrutadorRepositoryMock.findByEmail).toHaveBeenCalledWith(credentials.email);
        expect(hashProviderMock.compareHash).toHaveBeenCalledWith(
            credentials.senha,
            mockRecrutador.senha
        );
        expect(result).toEqual({
            recrutador: {
                id: mockRecrutador.id,
                nome: mockRecrutador.nome,
                email: mockRecrutador.email,
                perfil: mockRecrutador.perfil,
            },
            token: "mocked-jwt-token",
        });
    });

    it("não deve autenticar com email inexistente", async () => {
        // Arrange
        const credentials = {
            email: "naoexiste@example.com",
            senha: "senha123",
        };

        recrutadorRepositoryMock.findByEmail.mockResolvedValue(null);

        // Act & Assert
        await expect(
            authenticateRecrutadorUseCase.execute(credentials)
        ).rejects.toEqual(
            expect.objectContaining({
                message: "E-mail ou senha incorretos",
                statusCode: 401
            })
        );

        expect(hashProviderMock.compareHash).not.toHaveBeenCalled();
    });

    it("não deve autenticar com senha incorreta", async () => {
        // Arrange
        const credentials = {
            email: "recrutador@example.com",
            senha: "senha-errada",
        };

        const mockRecrutador = {
            id: "recrutador-123",
            nome: "João Recrutador",
            email: credentials.email,
            senha: "hashed-password",
            status: StatusRecrutador.ATIVO,
        } as Recrutador;

        recrutadorRepositoryMock.findByEmail.mockResolvedValue(mockRecrutador);
        hashProviderMock.compareHash.mockResolvedValue(false);

        // Act & Assert
        await expect(
            authenticateRecrutadorUseCase.execute(credentials)
        ).rejects.toEqual(
            expect.objectContaining({
                message: "E-mail ou senha incorretos",
                statusCode: 401
            })
        );
    });

    it("não deve autenticar recrutador inativo", async () => {
        // Arrange
        const credentials = {
            email: "recrutador@example.com",
            senha: "senha123",
        };

        const mockRecrutador = {
            id: "recrutador-123",
            nome: "João Recrutador",
            email: credentials.email,
            senha: "hashed-password",
            perfil: "ADMIN",
            status: StatusRecrutador.INATIVO, // Inativo
        } as Recrutador;

        recrutadorRepositoryMock.findByEmail.mockResolvedValue(mockRecrutador);

        // Act & Assert
        await expect(
            authenticateRecrutadorUseCase.execute(credentials)
        ).rejects.toEqual(
            expect.objectContaining({
                message: "Recrutador inativo",
                statusCode: 401
            })
        );

        expect(hashProviderMock.compareHash).not.toHaveBeenCalled();
    });

    it("deve retornar token JWT válido", async () => {
        // Arrange
        const credentials = {
            email: "recrutador@example.com",
            senha: "senha123",
        };

        const mockRecrutador = {
            id: "recrutador-123",
            email: credentials.email,
            senha: "hashed-password",
            status: StatusRecrutador.ATIVO,
        } as Recrutador;

        recrutadorRepositoryMock.findByEmail.mockResolvedValue(mockRecrutador);
        hashProviderMock.compareHash.mockResolvedValue(true);

        // Act
        const result = await authenticateRecrutadorUseCase.execute(credentials);

        // Assert
        expect(result.token).toBe("mocked-jwt-token");
        expect(typeof result.token).toBe("string");
    });
});
