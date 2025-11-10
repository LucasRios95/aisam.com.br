# Guia Rápido - Aplicações Separadas

## 🚀 Setup Inicial

```bash
npm run setup:db        # Setup completo do banco
npm run seed:admin      # Criar admin
npm run seed:areas      # Popular áreas
npm run dev            # Iniciar servidor
```

## 📦 Comandos de Migrations

### Executar Migrations

```bash
npm run migration:run:all        # Todas as aplicações
npm run migration:run:vagas      # Apenas vagas
npm run migration:run:noticias   # Apenas notícias
npm run migration:run:common     # Apenas comum
```

### Ver Status

```bash
npm run migration:show:vagas
npm run migration:show:noticias
npm run migration:show:common
```

### Criar Nova Migration

```bash
npm run migration:create:vagas -- NomeDaMigration
npm run migration:create:noticias -- NomeDaMigration
npm run migration:create:common -- NomeDaMigration
```

### Reverter Migration

```bash
npm run migration:revert:vagas
npm run migration:revert:noticias
npm run migration:revert:common
```

## 🗂️ Qual Schema Usar?

| Módulo | Schema | Config |
|--------|--------|--------|
| Vaga | `vagas` | ormconfig.vagas.json |
| Candidato | `vagas` | ormconfig.vagas.json |
| Candidatura | `vagas` | ormconfig.vagas.json |
| Recrutador | `vagas` | ormconfig.vagas.json |
| Associado | `vagas` | ormconfig.vagas.json |
| AdminAisam | `vagas` | ormconfig.vagas.json |
| AreaAtuacao | `vagas` | ormconfig.vagas.json |
| Noticia | `noticias` | ormconfig.noticias.json |
| Notificacao | `public` | ormconfig.common.json |
| Auditoria | `public` | ormconfig.common.json |

## 💻 Código

### Criar Repositório

```typescript
import { getConnectionRepository } from '@/shared/infra/typeorm/helpers/getConnectionRepository';
import { MinhaEntidade } from '../entities/MinhaEntidade';

class MeuRepository {
  private repository: Repository<MinhaEntidade>;

  constructor() {
    // Escolha: 'vagas', 'noticias' ou 'common'
    this.repository = getConnectionRepository(MinhaEntidade, 'vagas');
  }
}
```

### Usar Conexões

```typescript
import { createDatabaseConnections, getConnection } from '@/shared/infra/typeorm';

// Setup
await createDatabaseConnections();

// Obter conexão específica
const conn = getConnection('vagas');
```

## 🔍 SQL Útil

```sql
-- Ver schemas
SELECT schema_name FROM information_schema.schemata;

-- Ver tabelas do schema vagas
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'vagas';

-- Ver tabelas do schema noticias
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'noticias';
```

## 📂 Estrutura de Arquivos

```
ormconfig.vagas.json              ← Config vagas
ormconfig.noticias.json           ← Config notícias
ormconfig.common.json             ← Config comum

src/shared/infra/typeorm/
├── migrations/
│   ├── vagas/                    ← Migrations vagas
│   ├── noticias/                 ← Migrations notícias
│   └── common/                   ← Migrations comuns
├── data-sources.ts               ← Gerenciador de conexões
└── helpers/
    └── getConnectionRepository.ts ← Helper para repositórios
```

## ⚠️ Problemas Comuns

### Erro: "Connection not found"

```typescript
// ✗ Errado
getRepository(Entidade)

// ✓ Correto
getConnectionRepository(Entidade, 'vagas')
```

### Migration não encontrada

Verifique se está no diretório correto:
- Vagas: `src/shared/infra/typeorm/migrations/vagas/`
- Notícias: `src/shared/infra/typeorm/migrations/noticias/`
- Common: `src/shared/infra/typeorm/migrations/common/`

### Ordem de execução

Sempre execute nesta ordem:
1. `common` (cria schemas)
2. `vagas` e `noticias` (qualquer ordem)

Ou use: `npm run migration:run:all`
