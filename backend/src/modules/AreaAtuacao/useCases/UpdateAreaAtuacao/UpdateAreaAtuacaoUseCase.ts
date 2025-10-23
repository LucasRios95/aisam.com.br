import { inject, injectable } from "tsyringe";
import { IAreaAtuacaoRepository } from "../../repositories/IAreaAtuacaoRepository";
import { AppError } from "@shared/errors/AppError";
import { AreaAtuacao } from "../../infra/typeorm/entities/AreaAtuacao";

interface IRequest {
    id: string;
    nome?: string;
    slug?: string;
    descricao?: string;
    ativo?: boolean;
}

@injectable()
export class UpdateAreaAtuacaoUseCase {
    constructor(
        @inject("AreaAtuacaoRepository")
        private areaAtuacaoRepository: IAreaAtuacaoRepository
    ) {}

    async execute({ id, nome, slug, descricao, ativo }: IRequest): Promise<AreaAtuacao> {
        const area = await this.areaAtuacaoRepository.findById(id);

        if (!area) {
            throw new AppError("Área de atuação não encontrada", 404);
        }

        // Verificar duplicação de nome (se mudou)
        if (nome && nome !== area.nome) {
            const areaExistsByNome = await this.areaAtuacaoRepository.findByNome(nome);
            if (areaExistsByNome) {
                throw new AppError("Já existe uma área de atuação com este nome");
            }
            area.nome = nome;
        }

        // Verificar duplicação de slug (se mudou)
        if (slug && slug !== area.slug) {
            const areaExistsBySlug = await this.areaAtuacaoRepository.findBySlug(slug);
            if (areaExistsBySlug) {
                throw new AppError("Já existe uma área de atuação com este slug");
            }
            area.slug = slug;
        }

        if (descricao !== undefined) {
            area.descricao = descricao;
        }

        if (ativo !== undefined) {
            area.ativo = ativo;
        }

        const areaAtualizada = await this.areaAtuacaoRepository.update(area);

        return areaAtualizada;
    }
}
