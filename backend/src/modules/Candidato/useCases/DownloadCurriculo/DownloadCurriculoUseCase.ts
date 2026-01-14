import { inject, injectable } from "tsyringe";
import path from "path";
import fs from "fs";
import { ICandidatoRepository } from "@modules/Candidato/repositories/ICandidatoRepository";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
    candidato_id: string;
    user_id: string;
    role: "ADMIN_AISAM" | "RECRUTADOR" | "CANDIDATO";
}

interface IResponse {
    filePath: string;
    originalName: string;
}

@injectable()
class DownloadCurriculoUseCase {
    constructor(
        @inject("CandidatoRepository")
        private candidatoRepository: ICandidatoRepository
    ) {}

    async execute({ candidato_id, user_id, role }: IRequest): Promise<IResponse> {
        // Busca o candidato
        const candidato = await this.candidatoRepository.findById(candidato_id);

        if (!candidato) {
            throw new AppError("Candidato não encontrado", 404);
        }

        // Verifica se o candidato tem currículo
        if (!candidato.curriculo_url) {
            throw new AppError("Candidato não possui currículo cadastrado", 404);
        }

        // Verifica permissões:
        // - CANDIDATO só pode baixar seu próprio currículo
        // - RECRUTADOR pode baixar qualquer currículo (para avaliar candidaturas)
        // - ADMIN_AISAM pode baixar qualquer currículo
        if (role === "CANDIDATO" && candidato_id !== user_id) {
            throw new AppError("Você não tem permissão para acessar este currículo", 403);
        }

        // Extrai o nome do arquivo da URL
        // curriculo_url é algo como: "/files/curriculos/abc123-curriculo.pdf"
        const fileName = candidato.curriculo_url.split('/').pop();

        if (!fileName) {
            throw new AppError("URL do currículo inválida", 400);
        }

        // Constrói o caminho completo do arquivo
        const uploadFolder = path.resolve(__dirname, "..", "..", "..", "..", "..", "tmp", "uploads");
        const filePath = path.join(uploadFolder, "curriculos", fileName);

        // Verifica se o arquivo existe
        if (!fs.existsSync(filePath)) {
            throw new AppError("Arquivo de currículo não encontrado no servidor", 404);
        }

        return {
            filePath,
            originalName: `curriculo-${candidato.nome.replace(/\s+/g, '-')}.pdf`
        };
    }
}

export { DownloadCurriculoUseCase };
