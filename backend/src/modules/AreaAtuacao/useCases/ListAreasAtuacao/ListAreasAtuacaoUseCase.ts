import { inject, injectable } from "tsyringe";
import { IAreaAtuacaoRepository } from "../../repositories/IAreaAtuacaoRepository";
import { AreaAtuacao } from "../../infra/typeorm/entities/AreaAtuacao";

interface IRequest {
    apenasAtivas?: boolean;
}

@injectable()
export class ListAreasAtuacaoUseCase {
    constructor(
        @inject("AreaAtuacaoRepository")
        private areaAtuacaoRepository: IAreaAtuacaoRepository
    ) {}

    async execute({ apenasAtivas = true }: IRequest): Promise<AreaAtuacao[]> {
        if (apenasAtivas) {
            const areas = await this.areaAtuacaoRepository.listAtivas();
            return areas;
        }

        const areas = await this.areaAtuacaoRepository.list();
        return areas;
    }
}
