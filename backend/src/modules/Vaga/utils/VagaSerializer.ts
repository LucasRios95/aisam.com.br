import { Vaga } from "../infra/typeorm/entities/Vaga";

interface SerializedVaga {
    id: string;
    titulo: string;
    descricao: string;
    senioridade: string;
    areas_atuacao: string[];
    regime: string;
    localidade: string;
    email_contato: string;
    empresa_anonima: boolean;
    status: string;
    created_at: Date;
    updated_at: Date;
    associado?: {
        id?: string;
        razao_social?: string;
        cnpj?: string;
        email?: string;
    };
    recrutador?: {
        id?: string;
        nome?: string;
        email?: string;
    };
}

export class VagaSerializer {
    static serialize(vaga: Vaga, includeDetails = false): SerializedVaga {
        const serialized: SerializedVaga = {
            id: vaga.id,
            titulo: vaga.titulo,
            descricao: this.maskDescription(vaga.descricao, vaga.empresa_anonima),
            senioridade: vaga.senioridade,
            areas_atuacao: vaga.areas_atuacao,
            regime: vaga.regime,
            localidade: vaga.localidade,
            email_contato: vaga.empresa_anonima ? this.maskEmail(vaga.email_contato) : vaga.email_contato,
            empresa_anonima: vaga.empresa_anonima,
            status: vaga.status,
            created_at: vaga.created_at,
            updated_at: vaga.updated_at
        };

        // Se a empresa é anônima, não incluir dados do associado
        if (!vaga.empresa_anonima && vaga.associado) {
            serialized.associado = {
                id: includeDetails ? vaga.associado.id : undefined,
                razao_social: vaga.associado.razao_social,
                cnpj: includeDetails ? vaga.associado.cnpj : undefined,
                email: includeDetails ? vaga.associado.email : undefined
            };
        }

        // Informações do recrutador apenas para usuários autenticados
        if (includeDetails && vaga.recrutador) {
            serialized.recrutador = {
                id: vaga.recrutador.id,
                nome: vaga.recrutador.nome,
                email: vaga.recrutador.email
            };
        }

        return serialized;
    }

    static serializeList(vagas: Vaga[], includeDetails = false): SerializedVaga[] {
        return vagas.map(vaga => this.serialize(vaga, includeDetails));
    }

    private static maskEmail(email: string): string {
        // Retorna um email genérico para vagas anônimas
        return "candidaturas@aisam.com.br";
    }

    private static maskDescription(descricao: string, isAnonima: boolean): string {
        if (!isAnonima) {
            return descricao;
        }

        // Remove potenciais menções a nomes de empresas, domínios, URLs
        let masked = descricao;

        // Remove URLs
        masked = masked.replace(/https?:\/\/[^\s]+/gi, "[LINK REMOVIDO]");

        // Remove emails com domínios específicos (mantém apenas emails genéricos)
        masked = masked.replace(/[\w.-]+@(?!aisam\.com\.br)[\w.-]+\.[a-z]{2,}/gi, "[EMAIL REMOVIDO]");

        // Remove CNPJs
        masked = masked.replace(/\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/g, "[CNPJ REMOVIDO]");

        return masked;
    }
}
