import * as XLSX from 'xlsx';
import * as path from 'path';

const planilhaPath = path.join(__dirname, '..', 'PLANILHA -ASSOCIADAS - E-MAIL RH .xlsx');

try {
    // Ler planilha
    const workbook = XLSX.readFile(planilhaPath);

    // Pegar primeira aba
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Converter para JSON
    const data = XLSX.utils.sheet_to_json(worksheet);

    console.log('📊 Total de linhas:', data.length);
    console.log('\n📋 Estrutura dos dados (primeira linha):');
    console.log(JSON.stringify(data[0], null, 2));

    console.log('\n📋 Todas as colunas encontradas:');
    if (data.length > 0) {
        console.log(Object.keys(data[0]));
    }

    console.log('\n📋 Primeiras 5 linhas:');
    console.log(JSON.stringify(data.slice(0, 5), null, 2));

} catch (error) {
    console.error('❌ Erro ao ler planilha:', error);
}
