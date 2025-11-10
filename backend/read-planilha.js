const XLSX = require('xlsx');
const path = require('path');

const planilhaPath = path.join(__dirname, 'PLANILHA -ASSOCIADAS - LOGO E E-MAIL RH (2).xlsx');
const workbook = XLSX.readFile(planilhaPath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const dados = XLSX.utils.sheet_to_json(worksheet);

console.log('Total de registros:', dados.length);
console.log('\n--- Primeiros 5 registros ---\n');
dados.slice(0, 5).forEach((item, index) => {
    console.log(`\nRegistro ${index + 1}:`);
    console.log(JSON.stringify(item, null, 2));
});

console.log('\n--- Colunas disponíveis ---');
if (dados.length > 0) {
    console.log(Object.keys(dados[0]));
}
