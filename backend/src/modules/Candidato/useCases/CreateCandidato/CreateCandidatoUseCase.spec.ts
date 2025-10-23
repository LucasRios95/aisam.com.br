import { AppError } from "@shared/errors/AppError";
import { CreateCandidatoUseCase } from "./CreateCandidatoUseCase";
import { ICandidatoRepository } from "@modules/Candidato/repositories/ICandidatoRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { Candidato } from "@modules/Candidato/infra/typeorm/entities/Candidato";

// Mocks
let createCandidatoUseCase: CreateCandidatoUseCase;
let candidatoRepositoryMock: jest.Mocked<ICandidatoRepository>;
let dateProviderMock: jest.Mocked<IDateProvider>;

describe("CreateCandidatoUseCase", () => {
    beforeEach(() => {
        // Criar mocks
        candidatoRepositoryMock = {
            findByEmail: jest.fn(),
            create: jest.fn(),
            findById: jest.fn(),
            list: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findByAreasAtuacao: jest.fn(),
        } as any;

        dateProviderMock = {
            addDays: jest.fn(),
            addHours: jest.fn(),
            compareInHours: jest.fn(),
            compareInDays: jest.fn(),
            convertToUTC: jest.fn(),
            dateNow: jest.fn(),
            compareIfBefore: jest.fn(),
        } as any;

        createCandidatoUseCase = new CreateCandidatoUseCase(
            candidatoRepositoryMock,
            dateProviderMock
        );
    });

    it("deve criar um candidato com sucesso", async () => {
        // Arrange
        const candidatoData = {
            nome: "João Silva",
            email: "joao@example.com",
            telefone: "(11) 98765-4321",
            cidade: "São Paulo",
            estado: "SP",
            resumo_curriculo: "Desenvolvedor com 5 anos de experiência em React e Node.js",
            areas_atuacao: ["Tecnologia", "Desenvolvimento"],
            consentimento_dados: true,
        };

        const expectedExpirationDate = new Date("2025-11-21");
        const mockCandidato = { id: "123", ...candidatoData, acesso_expirado: expectedExpirationDate } as Candidato;

        candidatoRepositoryMock.findByEmail.mockResolvedValue(null);
        candidatoRepositoryMock.create.mockResolvedValue(mockCandidato);
        dateProviderMock.addDays.mockReturnValue(expectedExpirationDate);

        // Act
        const result = await createCandidatoUseCase.execute(candidatoData);

        // Assert
        expect(candidatoRepositoryMock.findByEmail).toHaveBeenCalledWith(candidatoData.email);
        expect(dateProviderMock.addDays).toHaveBeenCalledWith(30);
        expect(candidatoRepositoryMock.create).toHaveBeenCalledWith({
            ...candidatoData,
            curriculo_url: undefined,
            curriculo_upload_date: undefined,
            acesso_expirado: expectedExpirationDate,
        });
        expect(result).toEqual(mockCandidato);
    });

    it("não deve criar candidato se email já existe", async () => {
        // Arrange
        const candidatoData = {
            nome: "João Silva",
            email: "joao@example.com",
            telefone: "(11) 98765-4321",
            cidade: "São Paulo",
            estado: "SP",
            resumo_curriculo: "Desenvolvedor com 5 anos de experiência",
            consentimento_dados: true,
        };

        const existingCandidato = { id: "123", email: candidatoData.email } as Candidato;
        candidatoRepositoryMock.findByEmail.mockResolvedValue(existingCandidato);

        // Act & Assert
        await expect(createCandidatoUseCase.execute(candidatoData)).rejects.toEqual(
            expect.objectContaining({
                message: "Candidato já existe com este email!",
                statusCode: 400
            })
        );
        expect(candidatoRepositoryMock.create).not.toHaveBeenCalled();
    });

    it("não deve criar candidato sem consentimento LGPD", async () => {
        // Arrange
        const candidatoData = {
            nome: "João Silva",
            email: "joao@example.com",
            telefone: "(11) 98765-4321",
            cidade: "São Paulo",
            estado: "SP",
            resumo_curriculo: "Desenvolvedor com 5 anos de experiência",
            consentimento_dados: false, // Sem consentimento
        };

        candidatoRepositoryMock.findByEmail.mockResolvedValue(null);

        // Act & Assert
        await expect(createCandidatoUseCase.execute(candidatoData)).rejects.toEqual(
            expect.objectContaining({
                message: "É necessário consentimento para tratamento de dados (LGPD)!",
                statusCode: 400
            })
        );
        expect(candidatoRepositoryMock.create).not.toHaveBeenCalled();
    });

    it("deve criar candidato com áreas de atuação opcionais", async () => {
        // Arrange
        const candidatoData = {
            nome: "Maria Santos",
            email: "maria@example.com",
            telefone: "(21) 99999-8888",
            cidade: "Rio de Janeiro",
            estado: "RJ",
            resumo_curriculo: "Gerente de projetos com certificação PMP",
            consentimento_dados: true,
            // Sem areas_atuacao
        };

        const expectedExpirationDate = new Date("2025-11-21");
        const mockCandidato = { id: "456", ...candidatoData, acesso_expirado: expectedExpirationDate } as Candidato;

        candidatoRepositoryMock.findByEmail.mockResolvedValue(null);
        candidatoRepositoryMock.create.mockResolvedValue(mockCandidato);
        dateProviderMock.addDays.mockReturnValue(expectedExpirationDate);

        // Act
        const result = await createCandidatoUseCase.execute(candidatoData);

        // Assert
        expect(result).toEqual(mockCandidato);
        expect(candidatoRepositoryMock.create).toHaveBeenCalledWith(
            expect.objectContaining({
                nome: candidatoData.nome,
                email: candidatoData.email,
                acesso_expirado: expectedExpirationDate,
            })
        );
    });
});
