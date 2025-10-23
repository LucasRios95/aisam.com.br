import { inject, injectable } from "tsyringe";
import { IAreaAtuacaoRepository } from "../../repositories/IAreaAtuacaoRepository";
import { AppError } from "@shared/errors/AppError";
import { AreaAtuacao } from "../../infra/typeorm/entities/AreaAtuacao";

interface IRequest {
    nome: string;
    slug: string;
    descricao?: string;
}

@injectable()
export class CreateAreaAtuacaoUseCase {
    constructor(
        @inject("AreaAtuacaoRepository")
        private areaAtuacaoRepository: IAreaAtuacaoRepository
    ) {}

    async execute({ nome, slug, descricao }: IRequest): Promise<AreaAtuacao> {
        const areaExistsByNome = await this.areaAtuacaoRepository.findByNome(nome);

        if (areaExistsByNome) {
            throw new AppError("Já existe uma área de atuação com este nome");
        }

        const areaExistsBySlug = await this.areaAtuacaoRepository.findBySlug(slug);

        if (areaExistsBySlug) {
            throw new AppError("Já existe uma área de atuação com este slug");
        }

        const area = await this.areaAtuacaoRepository.create({
            nome,
            slug,
            descricao
        });

        return area;
    }
}
