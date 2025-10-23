/**
 * Script de setup inicial do banco de dados
 * Executa as migrations em ordem correta para as 3 aplicações separadas
 */

import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const runCommand = async (command: string, description: string) => {
  console.log(`\n🔄 ${description}...`);
  try {
    const { stdout, stderr } = await execAsync(command);
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    console.log(`✅ ${description} - Concluído`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} - Erro:`, error.message);
    return false;
  }
};

const setup = async () => {
  console.log("═══════════════════════════════════════════════════");
  console.log("    SETUP DO BANCO DE DADOS - APLICAÇÕES SEPARADAS");
  console.log("═══════════════════════════════════════════════════\n");

  // 1. Criar schemas (common - deve ser primeiro)
  const step1 = await runCommand(
    "npm run migration:run:common",
    "Passo 1/3: Criando schemas do PostgreSQL (common)"
  );
  if (!step1) {
    console.error("\n⚠️  Falha ao criar schemas. Abortando...");
    process.exit(1);
  }

  // 2. Rodar migrations do sistema de vagas
  const step2 = await runCommand(
    "npm run migration:run:vagas",
    "Passo 2/3: Executando migrations do sistema de vagas"
  );

  // 3. Rodar migrations do sistema de notícias
  const step3 = await runCommand(
    "npm run migration:run:noticias",
    "Passo 3/3: Executando migrations do sistema de notícias"
  );

  console.log("\n═══════════════════════════════════════════════════");
  if (step1 && step2 && step3) {
    console.log("✅ Setup concluído com sucesso!");
    console.log("\nPróximos passos:");
    console.log("  - npm run seed:admin   (criar usuário admin)");
    console.log("  - npm run seed:areas   (popular áreas de atuação)");
    console.log("  - npm run dev          (iniciar servidor)");
  } else {
    console.log("⚠️  Setup concluído com erros. Verifique os logs acima.");
  }
  console.log("═══════════════════════════════════════════════════\n");
};

setup().catch((error) => {
  console.error("❌ Erro fatal durante setup:", error);
  process.exit(1);
});
