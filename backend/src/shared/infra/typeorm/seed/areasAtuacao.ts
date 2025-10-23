import { createConnection } from "typeorm";
import { v4 as uuidv4 } from "uuid";

interface AreaAtuacao {
    id: string;
    nome: string;
    slug: string;
    descricao: string;
    ativo: boolean;
}

const areasAtuacao: Omit<AreaAtuacao, "id">[] = [
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

async function seed() {
    console.log("🌱 Iniciando seed de áreas de atuação...");

    const connection = await createConnection();

    try {
        for (const area of areasAtuacao) {
            const areaExists = await connection.query(
                "SELECT id FROM vagas.area_atuacao WHERE slug = $1",
                [area.slug]
            );

            if (areaExists.length === 0) {
                await connection.query(
                    `INSERT INTO vagas.area_atuacao (id, nome, slug, descricao, ativo, created_at, updated_at)
                     VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
                    [uuidv4(), area.nome, area.slug, area.descricao, area.ativo]
                );
                console.log(`✅ Área criada: ${area.nome}`);
            } else {
                console.log(`⏭️  Área já existe: ${area.nome}`);
            }
        }

        console.log("✨ Seed de áreas de atuação concluído!");
    } catch (error) {
        console.error("❌ Erro ao executar seed:", error);
    } finally {
        await connection.close();
    }
}

seed();
