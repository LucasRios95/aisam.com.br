-- ===================================
-- SCRIPT DE SETUP DO BANCO DE DADOS
-- KINGHOST - POSTGRESQL
-- ===================================

-- Execute este script após criar o banco na KingHost

-- 1. Criar os schemas necessários
CREATE SCHEMA IF NOT EXISTS vagas;
CREATE SCHEMA IF NOT EXISTS noticias;
-- O schema public já existe por padrão

-- 2. Verificar schemas criados
SELECT schema_name FROM information_schema.schemata
WHERE schema_name IN ('vagas', 'noticias', 'public');

-- 3. Dar permissões ao usuário (substitua 'seu_usuario' pelo usuário real)
-- GRANT ALL PRIVILEGES ON SCHEMA vagas TO seu_usuario;
-- GRANT ALL PRIVILEGES ON SCHEMA noticias TO seu_usuario;
-- GRANT ALL PRIVILEGES ON SCHEMA public TO seu_usuario;

-- 4. Verificar conexão
SELECT current_database(), current_user, inet_server_addr(), inet_server_port();

-- ===================================
-- PRÓXIMOS PASSOS:
-- ===================================
-- Após executar este script:
-- 1. Configure o .env do backend com os dados da KingHost
-- 2. Execute: npm run migration:run:all
-- 3. Execute: npm run seed:admin
-- 4. Execute: npm run seed:areas
-- 5. Execute: npm run seed:associados
-- ===================================
