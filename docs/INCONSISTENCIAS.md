# 🔴 RELATÓRIO COMPLETO DE INCONSISTÊNCIAS - AISAM SYSTEM

**Data:** 2025-10-21
**Análise:** Frontend-app + Backend + Banco de Dados

---

## ❌ INCONSISTÊNCIAS CRÍTICAS

### 1. **ENTIDADE CANDIDATO - Campos faltando no banco de dados**

**Localização:**
- Entidade: `backend/src/modules/Candidato/infra/typeorm/entities/Candidato.ts:28-35`
- Migration: `backend/src/shared/infra/typeorm/migrations/vagas/1756149754971-CreateCandidato.ts`

**Problema:**
A entidade `Candidato` declara 3 campos que NÃO existem no banco de dados:

```typescript
@Column({ type: 'simple-array', nullable: true })
areas_atuacao: string[];  // ❌ COLUNA NÃO EXISTE

@Column({ nullable: true })
curriculo_url: string;  // ❌ COLUNA NÃO EXISTE

@Column({ nullable: true })
curriculo_upload_date: Date;  // ❌ COLUNA NÃO EXISTE
```

**Impacto:**
- ✅ Job de notificações FALHANDO constantemente com erro: `column Candidato.areas_atuacao does not exist`
- ✅ Qualquer operação que envolva candidatos pode falhar
- ✅ TypeORM tenta buscar colunas que não existem

**Solução necessária:**
Criar migration para adicionar as 3 colunas faltantes na tabela `vagas.candidato`

---

### 2. **TABELA ASSOCIADO - Nome da tabela incorreto**

**Localização:**
- Entidade: `backend/src/modules/Associado/infra/typeorm/entities/Associado.ts:10`
- Migration: `backend/src/shared/infra/typeorm/migrations/vagas/1756138593853-CreateAssociado.ts:7`

**Problema:**
```typescript
// ENTIDADE define:
@Entity("associados")  // ❌ Plural
export class Associado

// MIGRATION criou:
name: "associado",  // ❌ Singular
```

**Impacto:**
- ✅ TypeORM pode não encontrar a tabela corretamente
- ✅ Queries podem falhar
- ✅ Inconsistência entre código e banco

**Solução necessária:**
Decidir: usar "associado" (singular) ou "associados" (plural) e alinhar entidade com migration

---

### 3. **ENTIDADE ASSOCIADO - Enum status vs migration status**

**Localização:**
- Migration original: `backend/src/shared/infra/typeorm/migrations/vagas/1756138593853-CreateAssociado.ts:29`
- Migration de correção: `backend/src/shared/infra/typeorm/migrations/vagas/1760000000000-FixAssociadoStatusEnum.ts`

**Problema original (JÁ CORRIGIDO):**
```typescript
// Migration original criou:
enum: ["pendente", "aprovado", "recusado"]  // ❌

// Entidade esperava:
enum StatusAssociado {
    ATIVO = "ativo",    // ✅
    INATIVO = "inativo"  // ✅
}
```

**Status:** ✅ **CORRIGIDO** com migration `1760000000000-FixAssociadoStatusEnum`

---

## ⚠️ INCONSISTÊNCIAS MODERADAS

### 4. **FRONTEND - Conversão status ↔ ativo**

**Localização:**
- Backend: Usa `status: "ativo" | "inativo"` (enum)
- Frontend: Usa `ativo: boolean`

**Problema:**
Necessário transformação manual em todos os controllers:

```typescript
// Backend → Frontend
const associadoFormatado = {
    ...associado,
    ativo: associado.status === "ativo"
};

// Frontend → Backend
const status = ativo ? StatusAssociado.ATIVO : StatusAssociado.INATIVO;
```

**Impacto:**
- ⚠️ Código duplicado em vários controllers
- ⚠️ Risco de esquecer a conversão em novos endpoints
- ⚠️ Aumenta complexidade

**Solução recomendada:**
Criar um DTO transformer/mapper centralizado ou usar o mesmo formato em ambos os lados

---

### 5. **PEDIDO_ASSOCIACAO - Campos não utilizados na criação do Associado**

**Localização:**
- `backend/src/modules/Associado/useCases/AprovarPedidoAssociacao/AprovarPedidoAssociacaoUseCase.ts:41-52`

**Problema:**
`Pedido_Associacao` tem muitos campos mas só alguns são copiados para `Associado`:

**Campos de Pedido_Associacao:**
- razao_social ✅
- cnpj ✅
- email_corporativo → email ✅
- setor ❌ NÃO COPIADO
- numero_funcionarios ❌ NÃO COPIADO
- representante ❌ NÃO COPIADO
- email_representante ❌ NÃO COPIADO
- descricao ❌ NÃO COPIADO
- observacao ❌ NÃO COPIADO

**Impacto:**
- ⚠️ Perda de dados durante aprovação
- ⚠️ Informações do pedido não ficam associadas ao associado

**Solução recomendada:**
Decidir se Associado deve ter mais campos ou se devemos manter referência ao Pedido original

---

## 🟡 INCONSISTÊNCIAS MENORES

### 6. **NOME DA TABELA - Inconsistência de nomenclatura**

**Problema:**
Algumas tabelas usam singular, outras plural:

```
vagas.candidato           ✅ Singular
vagas.associado           ✅ Singular (mas entidade usa @Entity("associados"))
vagas.admin_aisam         ✅ Singular
vagas.vagas               ❌ Plural
vagas.candidaturas        ❌ Plural
vagas.area_atuacao        ✅ Singular
vagas.pedido_associacao   ✅ Singular
```

**Impacto:**
- 🟡 Confusão na nomenclatura
- 🟡 Falta de padrão

**Solução recomendada:**
Adotar padrão (singular recomendado) e documentar

---

### 7. **ASSOCIADO - Campo created_at sem default**

**Localização:**
- Migration: `backend/src/shared/infra/typeorm/migrations/vagas/1756138593853-CreateAssociado.ts:32-36`

**Problema:**
```typescript
{
    name: "created_at",
    type: "timestamp",
    // ❌ SEM default: "now()"
}
```

Outras tabelas têm `default: "now()"` mas associado não tem.

**Impacto:**
- 🟡 created_at pode ser NULL se não fornecido
- 🟡 Inconsistência com outras tabelas

**Solução:**
Adicionar default na migration

---

## 📋 SUMÁRIO DE AÇÕES NECESSÁRIAS

### 🔴 CRÍTICO (Fazer IMEDIATAMENTE):
1. ✅ **Criar migration para adicionar colunas em Candidato:**
   - areas_atuacao (text ou simple-array)
   - curriculo_url (varchar, nullable)
   - curriculo_upload_date (timestamp, nullable)

2. ✅ **Corrigir nome da tabela Associado:**
   - Decidir: "associado" ou "associados"
   - Alinhar entidade com migration

### ⚠️ IMPORTANTE (Fazer logo):
3. ⚠️ **Criar mapper/transformer centralizado para status ↔ ativo**

4. ⚠️ **Revisar campos copiados de Pedido → Associado**

### 🟡 MELHORIAS (Quando possível):
5. 🟡 **Padronizar nomenclatura de tabelas (singular)**

6. 🟡 **Adicionar default: "now()" em created_at de Associado**

---

## 🎯 PRIORIDADE DE CORREÇÃO

```
1. Candidato (URGENTE - causando erros em produção)
2. Associado nome da tabela (bloqueando operações)
3. Mapper status/ativo (evitar bugs futuros)
4. Resto conforme necessidade
```

---

**Próximos passos:** Corrigir cada inconsistência seguindo a ordem de prioridade
