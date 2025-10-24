import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as XLSX from 'xlsx';
import * as path from 'path';
import { hash } from 'bcryptjs';

interface DadosPlanilha {
    ASSOCIADA: string;
    'LOGO (S/N)': string;
    'E:MAIL DO RH': string;
}

// Função para extrair email de string com formato "Nome <email>" ou apenas "email"
function extrairEmail(emailStr: string): string {
    const match = emailStr.match(/<(.+?)>/);
    if (match) {
        return match[1].trim();
    }
    return emailStr.trim();
}

// Função para gerar CNPJ fictício (apenas para testes)
function gerarCNPJ(index: number): string {
    const num = String(index + 1).padStart(8, '0');
    return `${num}0001${String(index % 100).padStart(2, '0')}`;
}

// Função para gerar nome do recrutador a partir do email
function gerarNomeRecrutador(email: string, razaoSocial: string): string {
    const nomeEmail = email.split('@')[0];
    const nomeFormatado = nomeEmail
        .split('.')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');

    // Se conseguiu extrair nome do email, usa ele
    if (nomeFormatado && nomeFormatado !== nomeEmail) {
        return `${nomeFormatado} - RH`;
    }

    // Caso contrário, usa parte da razão social
    const palavras = razaoSocial.split(' ');
    return `RH ${palavras[0]}`;
}

async function seed() {
    console.log('🌱 Iniciando seed de associados e recrutadores...\n');

    try {
        // Conectar ao banco
        const connection = await createConnection();
        console.log('✅ Conectado ao banco de dados\n');

        // Ler planilha
        const planilhaPath = path.join(__dirname, '../../../../../', 'PLANILHA -ASSOCIADAS - E-MAIL RH .xlsx');
        const workbook = XLSX.readFile(planilhaPath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const dados: DadosPlanilha[] = XLSX.utils.sheet_to_json(worksheet);

        console.log(`📊 Total de registros na planilha: ${dados.length}\n`);

        // Senha padrão para todos os recrutadores
        const senhaHash = await hash('aisam@2025', 8);

        let associadosCriados = 0;
        let recrutadoresCriados = 0;
        let erros = 0;

        for (let i = 0; i < dados.length; i++) {
            const linha = dados[i];

            try {
                const razaoSocial = linha.ASSOCIADA?.trim();
                const emailRH = linha['E:MAIL DO RH'];

                if (!razaoSocial || !emailRH) {
                    console.log(`⚠️  Linha ${i + 1}: Dados incompletos, pulando...`);
                    continue;
                }

                const email = extrairEmail(emailRH);
                const cnpj = gerarCNPJ(i);

                // Verificar se associado já existe
                const associadoExiste = await connection.query(
                    'SELECT id FROM vagas.associado WHERE cnpj = $1',
                    [cnpj]
                );

                let associadoId: string;

                if (associadoExiste.length > 0) {
                    associadoId = associadoExiste[0].id;
                    console.log(`ℹ️  Associado "${razaoSocial}" já existe`);
                } else {
                    // Criar associado
                    const resultAssociado = await connection.query(
                        `INSERT INTO vagas.associado (id, razao_social, cnpj, email, status, created_at, updated_at)
                         VALUES (uuid_generate_v4(), $1, $2, $3, 'ativo', NOW(), NOW())
                         RETURNING id`,
                        [razaoSocial, cnpj, email]
                    );
                    associadoId = resultAssociado[0].id;
                    associadosCriados++;
                    console.log(`✅ Associado criado: ${razaoSocial}`);
                }

                // Verificar se recrutador já existe
                const recrutadorExiste = await connection.query(
                    'SELECT id FROM vagas.recrutador WHERE email = $1',
                    [email]
                );

                if (recrutadorExiste.length > 0) {
                    console.log(`ℹ️  Recrutador com email "${email}" já existe`);
                } else {
                    // Criar recrutador
                    const nomeRecrutador = gerarNomeRecrutador(email, razaoSocial);
                    await connection.query(
                        `INSERT INTO vagas.recrutador (id, nome, email, senha, perfil, status, associado_id, created_at, updated_at)
                         VALUES (uuid_generate_v4(), $1, $2, $3, 'recrutador', 'ativo', $4, NOW(), NOW())`,
                        [nomeRecrutador, email, senhaHash, associadoId]
                    );
                    recrutadoresCriados++;
                    console.log(`✅ Recrutador criado: ${nomeRecrutador} (${email})`);
                }

                console.log('');

            } catch (error) {
                console.error(`❌ Erro ao processar linha ${i + 1}:`, error.message);
                erros++;
            }
        }

        await connection.close();

        console.log('\n' + '='.repeat(60));
        console.log('✨ Seed concluído!');
        console.log('='.repeat(60));
        console.log(`📊 Associados criados: ${associadosCriados}`);
        console.log(`👥 Recrutadores criados: ${recrutadoresCriados}`);
        console.log(`❌ Erros: ${erros}`);
        console.log('🔑 Senha padrão para todos os recrutadores: aisam@2025');
        console.log('='.repeat(60));

        process.exit(0);

    } catch (error) {
        console.error('❌ Erro ao executar seed:', error);
        process.exit(1);
    }
}

seed();
