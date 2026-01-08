import { MigrationInterface, QueryRunner } from "typeorm";

interface AssociadoData {
    razaoSocial: string;
    nomeFantasia?: string;
    cnpj: string;
    email: string;
    setor: string;
}

export class SeedAssociados1760600000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Importações dinâmicas para evitar problemas de compilação
        const bcryptjs = await import('bcryptjs');
        const uuid = await import('uuid');

        // Lista de associados baseada na planilha e frontend institucional
        const associados: AssociadoData[] = [
            {
                razaoSocial: "5S TINTAS INDUSTRIA E COMERCIO LTDA",
                nomeFantasia: "5S Tintas",
                cnpj: "12.345.678/0001-01",
                email: "sama@5stintas.com.br",
                setor: "Indústria Química"
            },
            {
                razaoSocial: "AGROSTAHL S/A INDUSTRIA E COMERCIO",
                nomeFantasia: "Agrostahl",
                cnpj: "45.493.772/0001-40",
                email: "rhu@stahl.com.br",
                setor: "Metalurgia"
            },
            {
                razaoSocial: "ALTA PERFORMANCE MATERIALS",
                nomeFantasia: "Alta Performance Materials",
                cnpj: "12.345.678/0001-03",
                email: "alessandra.minali@altapm.com",
                setor: "Indústria de Materiais Avançados"
            },
            {
                razaoSocial: "CABLAGGI SANMITSU CONDUTORES ELETRICOS LTDA",
                nomeFantasia: "Cablaggi Sanmitsu",
                cnpj: "12.345.678/0001-04",
                email: "rh@cablaggisanmitsu.com.br",
                setor: "Telecomunicações"
            },
            {
                razaoSocial: "CAMBUCI S/A",
                nomeFantasia: "Penalty",
                cnpj: "61.088.894/0001-08",
                email: "priscila.martinelli@cambuci.com.br",
                setor: "Indústria de Material Esportivo"
            },
            {
                razaoSocial: "BOM SONO LTDA",
                nomeFantasia: "Bom Sono",
                cnpj: "12.345.678/0001-06",
                email: "carolina.pinto@bomsonosp.com.br",
                setor: "Indústria Mobiliária"
            },
            {
                razaoSocial: "CEFRI ARMAZENAGEM FRIGORIFICADA E AGROINDUSTRIAL LTDA",
                nomeFantasia: "Cefri",
                cnpj: "12.345.678/0001-07",
                email: "compras.corp@superfrio.com.br",
                setor: "Indústrias de Alimentação e Bebidas"
            },
            {
                razaoSocial: "CELUTEX NÃO TECIDOS LTDA",
                nomeFantasia: "Fiorella",
                cnpj: "12.345.678/0001-08",
                email: "rcosta@fiorella.ind.br",
                setor: "Indústria Têxtil"
            },
            {
                razaoSocial: "CONTAINERS FLADAFI EPP",
                nomeFantasia: "Fladafi",
                cnpj: "12.345.678/0001-09",
                email: "mariacristina@fladafi.com.br",
                setor: "Fundição de Ferro e Aço"
            },
            {
                razaoSocial: "DESMO LUB INDUSTRIA E COMERCIO LTDA",
                nomeFantasia: "Concentrol",
                cnpj: "12.345.678/0001-10",
                email: "desmolub@hotmail.com",
                setor: "Indústria Química"
            },
            {
                razaoSocial: "ENGEFORMAS INDUSTRIA E COMERCIO LTDA",
                nomeFantasia: "Engeformas",
                cnpj: "12.345.678/0001-11",
                email: "elisangela@engeformas.com.br",
                setor: "Equipamentos Industriais"
            },
            {
                razaoSocial: "ETRURIA INDUSTRIA E COMERCIO LTDA",
                nomeFantasia: "Etrúria",
                cnpj: "12.345.678/0001-12",
                email: "erika@etruria.com.br",
                setor: "Indústria Cerâmica"
            },
            {
                razaoSocial: "EVEREST ENGENHARIA DE INFRAESTRUTURA LTDA",
                nomeFantasia: "Everest",
                cnpj: "12.345.678/0001-13",
                email: "recursoshumanos@everestengenharia.com.br",
                setor: "Serviços de Engenharia"
            },
            {
                razaoSocial: "FABRICA DE ARTEFATOS DE LATEX ESTRELA LTDA",
                nomeFantasia: "Látex Estrela",
                cnpj: "12.345.678/0001-14",
                email: "acrtuto@uol.com.br",
                setor: "Indústria de Látex"
            },
            {
                razaoSocial: "FABRICA DE ARTEFATOS DE LATEX SAO ROQUE LTDA",
                nomeFantasia: "Látex São Roque",
                cnpj: "12.345.678/0001-15",
                email: "pamela.mazieri@latexsr.com.br",
                setor: "Indústria de Látex"
            },
            {
                razaoSocial: "FIORE CAIXAS LTDA",
                nomeFantasia: "Fiore",
                cnpj: "12.345.678/0001-16",
                email: "rh@fiorecaixas.com.br",
                setor: "Indústria de Embalagens"
            },
            {
                razaoSocial: "GREENWOOD INDUSTRIA E COMERCIO LTDA",
                nomeFantasia: "Greenwood",
                cnpj: "12.345.678/0001-17",
                email: "mariapia@greenwood.ind.br",
                setor: "Indústria Mobiliária"
            },
            {
                razaoSocial: "INALTEX INDUSTRIA BRASILEIRA LTDA",
                nomeFantasia: "Inaltex",
                cnpj: "12.345.678/0001-18",
                email: "fabiana.pereira@inaltex.com.br",
                setor: "Indústria Têxtil"
            },
            {
                razaoSocial: "INDUSTRIA BRASILEIRA DE BALOES LTDA",
                nomeFantasia: "IBB",
                cnpj: "12.345.678/0001-19",
                email: "rh1@happyday.ind.br",
                setor: "Indústria de Látex"
            },
            {
                razaoSocial: "INOVACAO ADMINISTRACAO LTDA",
                nomeFantasia: "Inovação",
                cnpj: "12.345.678/0001-20",
                email: "inovacao@inovacaoadm.com.br",
                setor: "Administração de Empresas"
            },
            {
                razaoSocial: "LAMACE COMERCIO DE IMPORTACAO E EXPORTACAO LTDA",
                nomeFantasia: "Lamace",
                cnpj: "12.345.678/0001-21",
                email: "financeiro@lamace.com.br",
                setor: "Comércio Internacional"
            },
            {
                razaoSocial: "LEVISA INDUSTRIA E COMERCIO LTDA",
                nomeFantasia: "Levisa",
                cnpj: "12.345.678/0001-22",
                email: "leticialevisa@gmail.com",
                setor: "Indústria Química"
            },
            {
                razaoSocial: "MASTERFEW INDUSTRIA E COMERCIO LTDA",
                nomeFantasia: "Masterfew",
                cnpj: "12.345.678/0001-23",
                email: "administrativo@masterfew.com.br",
                setor: "Equipamentos Industriais"
            },
            {
                razaoSocial: "MELLO COMUNICACOES LTDA",
                nomeFantasia: "Jornal da Economia",
                cnpj: "12.345.678/0001-24",
                email: "carlosmelloje@gmail.com",
                setor: "Jornal e Comunicação"
            },
            {
                razaoSocial: "MGV RECURSOS HUMANOS LTDA",
                nomeFantasia: "Grupo Dias",
                cnpj: "12.345.678/0001-25",
                email: "ketilyn.mracina@grupodiasrh.com",
                setor: "RH e Terceirização"
            },
            {
                razaoSocial: "NZ COOPERPOLYMER TERMOPLASTICOS ENGENHARIA LTDA",
                nomeFantasia: "NZ Cooperpolymer",
                cnpj: "12.345.678/0001-26",
                email: "rh@gruponz.com.br",
                setor: "Indústria Química"
            },
            {
                razaoSocial: "NZ PHILPOLYMER MAQUINAS LTDA",
                nomeFantasia: "NZ Philpolymer Máquinas",
                cnpj: "12.345.678/0001-27",
                email: "rh@gruponz.com.br",
                setor: "Equipamentos Industriais"
            },
            {
                razaoSocial: "NZ PHILPOLYMER INJECAO LTDA",
                nomeFantasia: "NZ Philpolymer Injeção",
                cnpj: "12.345.678/0001-28",
                email: "rh@gruponz.com.br",
                setor: "Indústria de Plásticos"
            },
            {
                razaoSocial: "NOVOS PS COMUNICACAO E MARKETING LTDA",
                nomeFantasia: "Novos PS",
                cnpj: "12.345.678/0001-29",
                email: "novosps2017@gmail.com",
                setor: "Serviços Diversos"
            },
            {
                razaoSocial: "O DEMOCRATA - IRMÃOS BOCATO LTDA",
                nomeFantasia: "O Democrata",
                cnpj: "12.345.678/0001-30",
                email: "grafica@odemocrata.com.br",
                setor: "Comunicação"
            },
            {
                razaoSocial: "UNIMED DE SAO ROQUE COOPERATIVA DE TRABALHO MEDICO",
                nomeFantasia: "Unimed São Roque",
                cnpj: "74.521.188/0001-50",
                email: "fabiola.donate@unimedsaoroque.coop.br",
                setor: "Planos de Saúde"
            },
            {
                razaoSocial: "VALEMAM INDUSTRIA E COMERCIO LTDA",
                nomeFantasia: "Valemam",
                cnpj: "12.345.678/0001-32",
                email: "compras@valemam.com.br",
                setor: "Comércio"
            },
            {
                razaoSocial: "VIFRANCA CORPORACOES LTDA",
                nomeFantasia: "Vifranca",
                cnpj: "12.345.678/0001-33",
                email: "viniciopensa@gmail.com",
                setor: "Administração de Empresas"
            },
            {
                razaoSocial: "VINIPLAST INDUSTRIA COMERCIO REPRESENTACOES LONAS LTDA",
                nomeFantasia: "Viniplast",
                cnpj: "12.345.678/0001-34",
                email: "brenda.silva@viniplast.com.br",
                setor: "Indústria de Plásticos"
            },
            {
                razaoSocial: "VITIVINICOLA GOES LTDA",
                nomeFantasia: "Góes",
                cnpj: "12.345.678/0001-35",
                email: "rafaela.goes@vinicolagoes.com.br",
                setor: "Indústrias de Alimentação e Bebidas"
            }
        ];

        // Senha padrão para todos os recrutadores
        const senhaHash = await bcryptjs.hash("aisam@2025", 8);

        console.log('🌱 Iniciando seed de associados...\n');

        for (const dados of associados) {
            try {
                // Verificar se associado já existe (por CNPJ)
                const associadoExiste = await queryRunner.query(
                    "SELECT id FROM vagas.associado WHERE cnpj = $1",
                    [dados.cnpj]
                );

                let associadoId: string;

                if (associadoExiste.length > 0) {
                    associadoId = associadoExiste[0].id;
                    console.log(`ℹ️  Associado "${dados.razaoSocial}" já existe`);
                } else {
                    // Criar associado
                    associadoId = uuid.v4();
                    await queryRunner.query(
                        `INSERT INTO vagas.associado (id, razao_social, nome_fantasia, cnpj, email, status, created_at, updated_at)
                         VALUES ($1, $2, $3, $4, $5, 'ativo', NOW(), NOW())
                         ON CONFLICT (cnpj) DO NOTHING`,
                        [associadoId, dados.razaoSocial, dados.nomeFantasia, dados.cnpj, dados.email]
                    );
                    console.log(`✅ Associado criado: ${dados.razaoSocial}`);
                }

                // Verificar se recrutador já existe
                const recrutadorExiste = await queryRunner.query(
                    "SELECT id FROM vagas.recrutador WHERE email = $1",
                    [dados.email]
                );

                if (recrutadorExiste.length === 0) {
                    // Criar recrutador
                    const nomeRecrutador = `RH ${dados.nomeFantasia || dados.razaoSocial.split(' ')[0]}`;
                    await queryRunner.query(
                        `INSERT INTO vagas.recrutador (id, nome, email, senha, perfil, status, associado_id, created_at, updated_at)
                         VALUES ($1, $2, $3, $4, 'recrutador', 'ativo', $5, NOW(), NOW())
                         ON CONFLICT (email) DO NOTHING`,
                        [uuid.v4(), nomeRecrutador, dados.email, senhaHash, associadoId]
                    );
                    console.log(`✅ Recrutador criado: ${nomeRecrutador} (${dados.email})`);
                } else {
                    console.log(`ℹ️  Recrutador para ${dados.email} já existe`);
                }

            } catch (error) {
                console.error(`❌ Erro ao processar "${dados.razaoSocial}":`, error.message);
            }
        }

        console.log('\n✅ Seed de associados e recrutadores concluído com sucesso');
        console.log('🔑 Senha padrão para todos os recrutadores: aisam@2025');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Rollback: remover todos os associados e recrutadores criados por esta migration
        const cnpjs = [
            "12.345.678/0001-01", "45.493.772/0001-40", "12.345.678/0001-03",
            "12.345.678/0001-04", "61.088.894/0001-08", "12.345.678/0001-06",
            "12.345.678/0001-07", "12.345.678/0001-08", "12.345.678/0001-09",
            "12.345.678/0001-10", "12.345.678/0001-11", "12.345.678/0001-12",
            "12.345.678/0001-13", "12.345.678/0001-14", "12.345.678/0001-15",
            "12.345.678/0001-16", "12.345.678/0001-17", "12.345.678/0001-18",
            "12.345.678/0001-19", "12.345.678/0001-20", "12.345.678/0001-21",
            "12.345.678/0001-22", "12.345.678/0001-23", "12.345.678/0001-24",
            "12.345.678/0001-25", "12.345.678/0001-26", "12.345.678/0001-27",
            "12.345.678/0001-28", "12.345.678/0001-29", "12.345.678/0001-30",
            "74.521.188/0001-50", "12.345.678/0001-32", "12.345.678/0001-33",
            "12.345.678/0001-34", "12.345.678/0001-35"
        ];

        const emails = [
            "sama@5stintas.com.br", "rhu@stahl.com.br", "alessandra.minali@altapm.com",
            "rh@cablaggisanmitsu.com.br", "priscila.martinelli@cambuci.com.br",
            "carolina.pinto@bomsonosp.com.br", "compras.corp@superfrio.com.br",
            "rcosta@fiorella.ind.br", "mariacristina@fladafi.com.br",
            "desmolub@hotmail.com", "elisangela@engeformas.com.br",
            "erika@etruria.com.br", "recursoshumanos@everestengenharia.com.br",
            "acrtuto@uol.com.br", "pamela.mazieri@latexsr.com.br",
            "rh@fiorecaixas.com.br", "mariapia@greenwood.ind.br",
            "fabiana.pereira@inaltex.com.br", "rh1@happyday.ind.br",
            "inovacao@inovacaoadm.com.br", "financeiro@lamace.com.br",
            "leticialevisa@gmail.com", "administrativo@masterfew.com.br",
            "carlosmelloje@gmail.com", "ketilyn.mracina@grupodiasrh.com",
            "rh@gruponz.com.br", "novosps2017@gmail.com",
            "grafica@odemocrata.com.br", "fabiola.donate@unimedsaoroque.coop.br",
            "compras@valemam.com.br", "viniciopensa@gmail.com",
            "brenda.silva@viniplast.com.br", "rafaela.goes@vinicolagoes.com.br"
        ];

        // Remover recrutadores
        for (const email of emails) {
            await queryRunner.query(
                `DELETE FROM vagas.recrutador WHERE email = $1`,
                [email]
            );
        }

        // Remover associados
        for (const cnpj of cnpjs) {
            await queryRunner.query(
                `DELETE FROM vagas.associado WHERE cnpj = $1`,
                [cnpj]
            );
        }

        console.log('⏮️  Associados e recrutadores removidos');
    }
}
