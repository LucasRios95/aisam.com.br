import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedAreasAtuacao1760600000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const uuid = await import('uuid');

        const areasAtuacao = [
            {
                nome: "Tecnologia da Informação",
                slug: "tecnologia-informacao",
                descricao: "Desenvolvimento de software, infraestrutura, segurança da informação",
                ativo: true
            },
            {
                nome: "Recursos Humanos",
                slug: "recursos-humanos",
                descricao: "Recrutamento, treinamento, gestão de pessoas",
                ativo: true
            },
            {
                nome: "Marketing e Comunicação",
                slug: "marketing-comunicacao",
                descricao: "Marketing digital, comunicação corporativa, publicidade",
                ativo: true
            },
            {
                nome: "Vendas e Comercial",
                slug: "vendas-comercial",
                descricao: "Vendas, atendimento ao cliente, business development",
                ativo: true
            },
            {
                nome: "Financeiro e Contábil",
                slug: "financeiro-contabil",
                descricao: "Contabilidade, controladoria, planejamento financeiro",
                ativo: true
            },
            {
                nome: "Administrativo",
                slug: "administrativo",
                descricao: "Assistente administrativo, recepção, backoffice",
                ativo: true
            },
            {
                nome: "Jurídico",
                slug: "juridico",
                descricao: "Advocacia, compliance, direito corporativo",
                ativo: true
            },
            {
                nome: "Engenharia",
                slug: "engenharia",
                descricao: "Engenharia civil, mecânica, elétrica, produção",
                ativo: true
            },
            {
                nome: "Logística e Supply Chain",
                slug: "logistica-supply-chain",
                descricao: "Logística, compras, gestão de estoque",
                ativo: true
            },
            {
                nome: "Produção e Operações",
                slug: "producao-operacoes",
                descricao: "Operações industriais, controle de qualidade, manutenção",
                ativo: true
            },
            {
                nome: "Saúde",
                slug: "saude",
                descricao: "Medicina, enfermagem, farmácia, saúde ocupacional",
                ativo: true
            },
            {
                nome: "Educação",
                slug: "educacao",
                descricao: "Professores, coordenação pedagógica, treinamento",
                ativo: true
            },
            {
                nome: "Design e Criação",
                slug: "design-criacao",
                descricao: "Design gráfico, UX/UI, criação visual",
                ativo: true
            },
            {
                nome: "Atendimento ao Cliente",
                slug: "atendimento-cliente",
                descricao: "SAC, suporte técnico, customer success",
                ativo: true
            },
            {
                nome: "Qualidade",
                slug: "qualidade",
                descricao: "Gestão da qualidade, auditorias, certificações",
                ativo: true
            }
        ];

        // Inserir áreas de atuação (ON CONFLICT DO NOTHING para idempotência)
        for (const area of areasAtuacao) {
            const id = uuid.v4();
            await queryRunner.query(
                `INSERT INTO vagas.area_atuacao (id, nome, slug, descricao, ativo, created_at, updated_at)
                 VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
                 ON CONFLICT (slug) DO NOTHING`,
                [id, area.nome, area.slug, area.descricao, area.ativo]
            );
        }

        console.log('✅ Áreas de atuação criadas/verificadas com sucesso');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Rollback: remover apenas as áreas criadas por esta migration
        const slugs = [
            'tecnologia-informacao', 'recursos-humanos', 'marketing-comunicacao',
            'vendas-comercial', 'financeiro-contabil', 'administrativo',
            'juridico', 'engenharia', 'logistica-supply-chain',
            'producao-operacoes', 'saude', 'educacao',
            'design-criacao', 'atendimento-cliente', 'qualidade'
        ];

        await queryRunner.query(
            `DELETE FROM vagas.area_atuacao WHERE slug = ANY($1)`,
            [slugs]
        );

        console.log('⏮️  Áreas de atuação removidas');
    }
}
