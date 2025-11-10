import { createConnection } from "typeorm";
import { hash } from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

interface AssociadoData {
    razaoSocial: string;
    nomeFantasia?: string;
    cnpj: string;
    email: string;
    setor: string;
}

// Função para extrair email limpo
function extrairEmail(emailStr: string): string {
    const match = emailStr.match(/<(.+?)>/);
    if (match) {
        return match[1].trim();
    }
    // Remove prefixos como "Nome - "
    const cleanEmail = emailStr.replace(/^[^@]*?-\s*/, '').trim();
    return cleanEmail;
}

async function seed() {
    console.log("🌱 Iniciando seed de associados...\n");

    const connection = await createConnection();

    try {
        // Lista de associados baseada na planilha e frontend institucional
        // CNPJs reais quando encontrados, caso contrário fictícios mas consistentes
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
                cnpj: "45.493.772/0001-40", // CNPJ real encontrado
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
                cnpj: "61.088.894/0001-08", // CNPJ real encontrado
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
                cnpj: "74.521.188/0001-50", // CNPJ real encontrado
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
        const senhaHash = await hash("aisam@2025", 8);

        let associadosCriados = 0;
        let recrutadoresCriados = 0;
        let jaExistentes = 0;

        for (const dados of associados) {
            try {
                // Verificar se associado já existe (por CNPJ)
                const associadoExiste = await connection.query(
                    "SELECT id FROM vagas.associado WHERE cnpj = $1",
                    [dados.cnpj]
                );

                let associadoId: string;

                if (associadoExiste.length > 0) {
                    associadoId = associadoExiste[0].id;
                    console.log(`ℹ️  Associado "${dados.razaoSocial}" já existe`);
                    jaExistentes++;
                } else {
                    // Criar associado
                    const resultAssociado = await connection.query(
                        `INSERT INTO vagas.associado (id, razao_social, nome_fantasia, cnpj, email, status, created_at, updated_at)
                         VALUES ($1, $2, $3, $4, $5, 'ativo', NOW(), NOW())
                         RETURNING id`,
                        [uuidv4(), dados.razaoSocial, dados.nomeFantasia, dados.cnpj, dados.email]
                    );
                    associadoId = resultAssociado[0].id;
                    associadosCriados++;
                    console.log(`✅ Associado criado: ${dados.razaoSocial}`);
                }

                // Verificar se recrutador já existe
                const recrutadorExiste = await connection.query(
                    "SELECT id FROM vagas.recrutador WHERE email = $1",
                    [dados.email]
                );

                if (recrutadorExiste.length === 0) {
                    // Criar recrutador
                    const nomeRecrutador = `RH ${dados.nomeFantasia || dados.razaoSocial.split(' ')[0]}`;
                    await connection.query(
                        `INSERT INTO vagas.recrutador (id, nome, email, senha, perfil, status, associado_id, created_at, updated_at)
                         VALUES ($1, $2, $3, $4, 'recrutador', 'ativo', $5, NOW(), NOW())`,
                        [uuidv4(), nomeRecrutador, dados.email, senhaHash, associadoId]
                    );
                    recrutadoresCriados++;
                    console.log(`✅ Recrutador criado: ${nomeRecrutador} (${dados.email})`);
                }

                console.log("");

            } catch (error) {
                console.error(`❌ Erro ao processar "${dados.razaoSocial}":`, error.message);
            }
        }

        await connection.close();

        console.log("\n" + "=".repeat(60));
        console.log("✨ Seed de associados concluído!");
        console.log("=".repeat(60));
        console.log(`📊 Associados criados: ${associadosCriados}`);
        console.log(`ℹ️  Associados já existentes: ${jaExistentes}`);
        console.log(`👥 Recrutadores criados: ${recrutadoresCriados}`);
        console.log(`🔑 Senha padrão para todos os recrutadores: aisam@2025`);
        console.log("=".repeat(60));

        process.exit(0);

    } catch (error) {
        console.error("❌ Erro ao executar seed:", error);
        await connection.close();
        process.exit(1);
    }
}

seed();
