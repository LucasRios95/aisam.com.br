# Separação de Aplicações - Notícias e Vagas

## 📋 Visão Geral

Este documento descreve a refatoração realizada para **separar as aplicações de Notícias e Vagas** em schemas PostgreSQL distintos, evitando conflitos de migrations e permitindo evolução independente de cada sistema.

## 🎯 Problema Identificado

- ✗ Migrations de notícias e vagas compartilhando o mesmo diretório
- ✗ Conflitos ao executar migrations de diferentes sistemas
- ✗ Impossibilidade de evoluir os sistemas de forma independente
- ✗ Dificuldade em gerenciar dependências entre módulos

## ✅ Solução Implementada

Separação em **3 aplicações distintas** usando schemas PostgreSQL:

1. **vagas** - Sistema de recrutamento completo
2. **noticias** - Sistema de notícias/blog
3. **common** - Recursos compartilhados (notificações, auditoria)

---

## 📁 Estrutura de Diretórios

```
backend/
├── ormconfig.json                    # Config legada (mantida por compatibilidade)
├── ormconfig.vagas.json             # Config do sistema de vagas
├── ormconfig.noticias.json          # Config do sistema de notícias
├── ormconfig.common.json            # Config de recursos comuns
│
├── src/
│   ├── modules/
│   │   ├── Vaga/                    # Schema: vagas
│   │   ├── Candidato/               # Schema: vagas
│   │   ├── Candidatura/             # Schema: vagas
│   │   ├── Recrutador/              # Schema: vagas
│   │   ├── Associado/               # Schema: vagas
│   │   ├── AdminAisam/              # Schema: vagas
│   │   ├── AreaAtuacao/             # Schema: vagas
│   │   ├── Noticia/                 # Schema: noticias
│   │   ├── Notificacao/             # Schema: public (common)
│   │   └── Auditoria/               # Schema: public (common)
│   │
│   └── shared/
│       └── infra/
│           └── typeorm/
│               ├── migrations/
│               │   ├── vagas/       # Migrations do sistema de vagas
│               │   ├── noticias/    # Migrations do sistema de notícias
│               │   └── common/      # Migrations compartilhadas
│               │
│               ├── data-sources.ts  # Gerenciador de múltiplas conexões
│               ├── index.ts         # Export principal (compatibilidade)
│               └── helpers/
│                   └── getConnectionRepository.ts
│
└── scripts/
    └── setup-database.ts            # Script de setup automatizado
```

---

## 🗄️ Schemas do PostgreSQL

### Schema: `vagas`
Sistema completo de recrutamento

**Tabelas:**
- `vagas` - Vagas de emprego
- `candidatos` - Candidatos
- `candidaturas` - Candidaturas
- `recrutador` - Recrutadores
- `associado` - Associados
- `admin_aisam` - Administradores
- `area_atuacao` - Áreas de atuação
- `pedido_associacao` - Pedidos de associação

### Schema: `noticias`
Sistema de notícias/blog

**Tabelas:**
- `noticia` - Notícias e artigos

### Schema: `public` (common)
Recursos compartilhados entre aplicações

**Tabelas:**
- `notificacoes` - Sistema de notificações
- `audit_log` - Log de auditoria

---

## 🔧 Configuração do TypeORM

### Múltiplas Conexões

Arquivo: `src/shared/infra/typeorm/data-sources.ts`

```typescript
import { createDatabaseConnections, getConnection } from '@/shared/infra/typeorm';

// Criar todas as conexões
await createDatabaseConnections();

// Obter conexão específica
const vagasConnection = getConnection('vagas');
const noticiasConnection = getConnection('noticias');
const commonConnection = getConnection('common');
```

### Repositórios

Os repositórios agora usam o helper `getConnectionRepository` para obter a conexão correta:

```typescript
// Exemplo: NoticiasRepository
import { getConnectionRepository } from '@/shared/infra/typeorm/helpers/getConnectionRepository';

constructor() {
  this.repository = getConnectionRepository(Noticia, 'noticias');
}

// Exemplo: VagaRepository
constructor() {
  this.repository = getConnectionRepository(Vaga, 'vagas');
}
```

---

## 📦 Scripts NPM

### Migrations - Vagas

```bash
# Executar migrations
npm run migration:run:vagas

# Reverter última migration
npm run migration:revert:vagas

# Ver status das migrations
npm run migration:show:vagas

# Criar nova migration
npm run migration:create:vagas -- MinhaMigration
```

### Migrations - Notícias

```bash
# Executar migrations
npm run migration:run:noticias

# Reverter última migration
npm run migration:revert:noticias

# Ver status das migrations
npm run migration:show:noticias

# Criar nova migration
npm run migration:create:noticias -- MinhaMigration
```

### Migrations - Common

```bash
# Executar migrations
npm run migration:run:common

# Reverter última migration
npm run migration:revert:common

# Ver status das migrations
npm run migration:show:common

# Criar nova migration
npm run migration:create:common -- MinhaMigration
```

### Setup Inicial

```bash
# Executar todas as migrations em ordem correta
npm run migration:run:all

# OU usar o script automatizado (recomendado)
npm run setup:db
```

---

## 🚀 Como Usar

### 1️⃣ Primeira Execução (Setup Inicial)

```bash
# 1. Setup completo do banco
npm run setup:db

# 2. Popular dados iniciais
npm run seed:admin
npm run seed:areas

# 3. Iniciar servidor
npm run dev
```

### 2️⃣ Criando Novas Migrations

Para o **sistema de vagas**:
```bash
npm run migration:create:vagas -- AddCampoNaVaga
```

Para o **sistema de notícias**:
```bash
npm run migration:create:noticias -- AddCategoriaNoticia
```

Para **recursos comuns**:
```bash
npm run migration:create:common -- UpdateNotificacoes
```

### 3️⃣ Executando Migrations

**Executar todas de uma vez:**
```bash
npm run migration:run:all
```

**Executar apenas uma aplicação:**
```bash
npm run migration:run:vagas
# ou
npm run migration:run:noticias
# ou
npm run migration:run:common
```

### 4️⃣ Verificar Status

```bash
# Ver todas as migrations
npm run migration:show:vagas
npm run migration:show:noticias
npm run migration:show:common
```

---

## 🔍 Verificação do Setup

Após executar o setup, você pode verificar no PostgreSQL:

```sql
-- Ver todos os schemas
SELECT schema_name FROM information_schema.schemata;

-- Ver tabelas do schema 'vagas'
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'vagas';

-- Ver tabelas do schema 'noticias'
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'noticias';

-- Ver tabelas do schema 'public' (common)
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';
```

---

## 📊 Mapa de Dependências

```
┌─────────────────────────────────────────────┐
│         PostgreSQL (database_aisam)         │
└─────────────────┬───────────────────────────┘
                  │
        ┌─────────┴──────────┬────────────────┐
        │                    │                │
   ┌────▼─────┐         ┌────▼────┐      ┌───▼────┐
   │  vagas   │         │noticias │      │ public │
   │ (schema) │         │(schema) │      │(common)│
   └────┬─────┘         └────┬────┘      └───┬────┘
        │                    │               │
   ┌────▼─────────┐     ┌────▼────┐     ┌───▼──────┐
   │ • vagas      │     │• noticia│     │• notif.  │
   │ • candidatos │     └─────────┘     │• audit   │
   │ • recrutador │                     └──────────┘
   │ • associado  │
   │ • admin      │
   │ • areas      │
   │ • candidat.  │
   └──────────────┘
```

---

## ⚠️ Importante

### Antes de Executar Migrations

1. **Backup do banco de dados**
   ```bash
   pg_dump -U docker database_aisam > backup_$(date +%Y%m%d).sql
   ```

2. **Verificar ordem de execução**
   - Sempre executar `common` primeiro (cria os schemas)
   - Depois `vagas` e `noticias` (ordem não importa entre elas)

3. **Ambiente de desenvolvimento**
   - Teste primeiro em desenvolvimento
   - Verifique os logs de cada migration

### Rollback

Se algo der errado, você pode reverter:

```bash
# Reverter por aplicação
npm run migration:revert:noticias
npm run migration:revert:vagas
npm run migration:revert:common
```

---

## 🆕 Adicionando Novo Módulo

### Passo 1: Decidir o Schema

- **Relacionado a vagas/recrutamento?** → `vagas`
- **Relacionado a notícias/blog?** → `noticias`
- **Compartilhado entre sistemas?** → `common` (public)

### Passo 2: Criar Migration

```bash
# Exemplo para novo módulo no sistema de vagas
npm run migration:create:vagas -- CreateMeuModulo
```

### Passo 3: Atualizar Repositório

```typescript
import { getConnectionRepository } from '@/shared/infra/typeorm/helpers/getConnectionRepository';

constructor() {
  // Use o schema correto: 'vagas', 'noticias' ou 'common'
  this.repository = getConnectionRepository(MinhaEntidade, 'vagas');
}
```

### Passo 4: Atualizar ormconfig

Adicione a entidade no arquivo de config apropriado:

**ormconfig.vagas.json:**
```json
{
  "entities": [
    "./src/modules/MeuModulo/infra/typeorm/entities/*.ts"
  ]
}
```

---

## 🧪 Testes

Para testar as conexões:

```typescript
import { createDatabaseConnections, getConnection } from '@/shared/infra/typeorm';

// Setup nos testes
beforeAll(async () => {
  await createDatabaseConnections();
});

// Usar conexão específica
const vagasConn = getConnection('vagas');
const noticiasConn = getConnection('noticias');
```

---

## 📚 Referências

- TypeORM Multi-connections: https://typeorm.io/multiple-connections
- PostgreSQL Schemas: https://www.postgresql.org/docs/current/ddl-schemas.html
- Clean Architecture: Separação de contextos bounded

---

## 👥 Suporte

Para dúvidas ou problemas:
1. Verifique os logs: `npm run migration:show:[app]`
2. Consulte esta documentação
3. Entre em contato com a equipe de desenvolvimento

---

**Última atualização:** 20 de Outubro de 2025
**Versão:** 1.0.0
