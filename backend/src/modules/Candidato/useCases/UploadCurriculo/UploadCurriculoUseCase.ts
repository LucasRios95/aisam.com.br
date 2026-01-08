import { inject, injectable } from "tsyringe";
import { ICandidatoRepository } from "../../repositories/ICandidatoRepository";
import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
    candidato_id: string;
    curriculo_filename: string;
}

@injectable()
class UploadCurriculoUseCase {
    constructor(
        @inject("CandidatoRepository")
        private candidatoRepository: ICandidatoRepository,

        @inject("StorageProvider")
        private storageProvider: IStorageProvider
    ) { }

    async execute({ candidato_id, curriculo_filename }: IRequest): Promise<void> {
        const candidato = await this.candidatoRepository.findById(candidato_id);

        if (!candidato) {
            throw new AppError("Candidato não encontrado", 404);
        }

        // Se já existe um currículo, deleta o antigo
        if (candidato.curriculo_url) {
            const oldFilename = candidato.curriculo_url.split('/').pop();
            if (oldFilename) {
                await this.storageProvider.delete(oldFilename, "curriculos");
            }
        }

        // Salva o novo currículo
        await this.storageProvider.save(curriculo_filename, "curriculos");

        // Atualiza o candidato com a URL do currículo
        const curriculo_url = this.storageProvider.getFileUrl(curriculo_filename, "curriculos");

        candidato.curriculo_url = curriculo_url;
        candidato.curriculo_upload_date = new Date();

        await this.candidatoRepository.update(candidato);
    }
}

export { UploadCurriculoUseCase };
