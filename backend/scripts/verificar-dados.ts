import { createConnection } from 'typeorm';

async function verificar() {
    console.log('🔍 Verificando dados inseridos...\n');

    try {
        const connection = await createConnection();

        // Contar associados
        const associados = await connection.query('SELECT COUNT(*) as total FROM vagas.associado');
        console.log(`📊 Total de associados: ${associados[0].total}`);

        // Contar recrutadores
        const recrutadores = await connection.query('SELECT COUNT(*) as total FROM vagas.recrutador');
        console.log(`👥 Total de recrutadores: ${recrutadores[0].total}`);

        // Listar alguns associados
        console.log('\n📋 Primeiros 5 associados:');
        const primeiroAssociados = await connection.query(
            'SELECT razao_social, cnpj, email FROM vagas.associado LIMIT 5'
        );
        primeiroAssociados.forEach((a: any) => {
            console.log(`  - ${a.razao_social} (${a.cnpj}) - ${a.email}`);
        });

        // Listar alguns recrutadores
        console.log('\n👥 Primeiros 5 recrutadores:');
        const primeirosRecrutadores = await connection.query(
            `SELECT r.nome, r.email, a.razao_social
             FROM vagas.recrutador r
             LEFT JOIN vagas.associado a ON r.associado_id = a.id
             LIMIT 5`
        );
        primeirosRecrutadores.forEach((r: any) => {
            console.log(`  - ${r.nome} (${r.email}) - ${r.razao_social}`);
        });

        await connection.close();
        console.log('\n✅ Verificação concluída!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Erro ao verificar dados:', error);
        process.exit(1);
    }
}

verificar();
