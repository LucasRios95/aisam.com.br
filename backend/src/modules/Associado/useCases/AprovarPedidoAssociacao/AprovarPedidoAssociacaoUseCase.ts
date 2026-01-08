import { IAdminAisamRepository } from "@modules/AdminAisam/repositories/IAdminAisamRepository";
import { IUpdateStatusDTO } from "@modules/Associado/dtos/IUpdateStatusDTO";
import { StatusAssociado } from "@modules/Associado/infra/typeorm/entities/Associado";
import { Pedido_Associacao } from "@modules/Associado/infra/typeorm/entities/Pedido_Associado";
import { IAssociadoRepository } from "@modules/Associado/repositories/IAssociadoRepository";
import { IPedidoAssociacaoRepository } from "@modules/Associado/repositories/IPedidoAssociacaoRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class AprovarPedidoAssociacaoUseCase {
    constructor(
        @inject("PedidoAssociacaoRepository")
        private pedidoAssociacaoRepository: IPedidoAssociacaoRepository,
        @inject("AdminAisamRepository")
        private adminRepository: IAdminAisamRepository,
        @inject("AssociadoRepository")
        private associadoRepository: IAssociadoRepository
    ) { }

    async execute({
        id,
        status,
        Aprovado_Por,
    }: IUpdateStatusDTO): Promise<Pedido_Associacao> {
        const pedidoAssociacao = await this.pedidoAssociacaoRepository.findById(id);
        const adminAisam = await this.adminRepository.findById(Aprovado_Por);

        if (!pedidoAssociacao) {
            throw new Error("Pedido de associação não encontrado!");
        }

        const updatedPedidoAssociacao = await this.pedidoAssociacaoRepository.updateStatus({
            id,
            status,
            Aprovado_Por: adminAisam.id,
        });

        if (status === "aprovado") {
            try {
                await this.associadoRepository.create({
                    razao_social: pedidoAssociacao.razao_social,
                    cnpj: pedidoAssociacao.cnpj,
                    email: pedidoAssociacao.email_corporativo,
                    telefone: pedidoAssociacao.telefone,
                    endereco: pedidoAssociacao.endereco,
                    cidade: pedidoAssociacao.cidade,
                    estado: pedidoAssociacao.estado,
                    cep: pedidoAssociacao.cep,
                    status: StatusAssociado.ATIVO,
                    created_at: new Date(),
                });

            } catch (error) {
                console.error("Erro ao criar associado:", error);
                throw new AppError(`Erro ao criar associado: ${error.message}`);
            }
        }

        return updatedPedidoAssociacao
    }
}

export { AprovarPedidoAssociacaoUseCase }