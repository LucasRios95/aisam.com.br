# Rotas de Gerenciamento de Candidatos - Admin

Este documento descreve as rotas disponíveis para administradores gerenciarem candidatos no sistema.

## Autenticação

Todas as rotas de admin requerem:
- Header `Authorization: Bearer {token}`
- Token deve ser de um usuário admin (role: `ADMIN_AISAM`)

## Rotas Disponíveis

### 1. Listar Candidatos
```http
GET /candidatos
Authorization: Bearer {token}
```

**Permissão**: Admin ou Recrutador

**Resposta de sucesso (200)**:
```json
[
  {
    "id": "uuid",
    "nome": "João Silva",
    "email": "joao@email.com",
    "telefone": "(11) 99999-9999",
    "cidade": "São Paulo",
    "estado": "SP",
    "resumo_curriculo": "Profissional com experiência em...",
    "areas_atuacao": ["Tecnologia da Informação"],
    "curriculo_url": "url_do_curriculo",
    "consentimento_dados": true,
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z"
  }
]
```

---

### 2. Buscar Candidato por ID
```http
GET /candidatos/:id
Authorization: Bearer {token}
```

**Permissão**: Admin ou Recrutador

**Parâmetros**:
- `id` (path): UUID do candidato

**Resposta de sucesso (200)**:
```json
{
  "id": "uuid",
  "nome": "João Silva",
  "email": "joao@email.com",
  "telefone": "(11) 99999-9999",
  "cidade": "São Paulo",
  "estado": "SP",
  "resumo_curriculo": "Profissional com experiência em...",
  "areas_atuacao": ["Tecnologia da Informação"],
  "curriculo_url": "url_do_curriculo",
  "consentimento_dados": true,
  "created_at": "2025-01-01T00:00:00.000Z",
  "updated_at": "2025-01-01T00:00:00.000Z"
}
```

**Resposta de erro (404)**:
```json
{
  "message": "Candidato não encontrado"
}
```

---

### 3. Criar Candidato (Admin)
```http
POST /candidatos/admin
Authorization: Bearer {token}
Content-Type: application/json
```

**Permissão**: Apenas Admin

**Body**:
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "telefone": "(11) 99999-9999",
  "cidade": "São Paulo",
  "estado": "SP",
  "resumo_curriculo": "Profissional com experiência em...",
  "areas_atuacao": ["Tecnologia da Informação"],
  "consentimento_dados": true
}
```

**Resposta de sucesso (201)**:
```json
{
  "id": "uuid",
  "nome": "João Silva",
  "email": "joao@email.com",
  "telefone": "(11) 99999-9999",
  "cidade": "São Paulo",
  "estado": "SP",
  "resumo_curriculo": "Profissional com experiência em...",
  "areas_atuacao": ["Tecnologia da Informação"],
  "consentimento_dados": true,
  "created_at": "2025-01-01T00:00:00.000Z",
  "updated_at": "2025-01-01T00:00:00.000Z"
}
```

---

### 4. Atualizar Candidato
```http
PUT /candidatos/:id
Authorization: Bearer {token}
Content-Type: application/json
```

**Permissão**: Apenas Admin

**Parâmetros**:
- `id` (path): UUID do candidato

**Body** (todos os campos são opcionais):
```json
{
  "nome": "João Silva Atualizado",
  "email": "joao.novo@email.com",
  "telefone": "(11) 88888-8888",
  "cidade": "São Paulo",
  "estado": "SP",
  "resumo_curriculo": "Profissional atualizado...",
  "areas_atuacao": ["Tecnologia da Informação", "Marketing"]
}
```

**Resposta de sucesso (200)**:
```json
{
  "id": "uuid",
  "nome": "João Silva Atualizado",
  "email": "joao.novo@email.com",
  "telefone": "(11) 88888-8888",
  "cidade": "São Paulo",
  "estado": "SP",
  "resumo_curriculo": "Profissional atualizado...",
  "areas_atuacao": ["Tecnologia da Informação", "Marketing"],
  "consentimento_dados": true,
  "created_at": "2025-01-01T00:00:00.000Z",
  "updated_at": "2025-01-01T12:00:00.000Z"
}
```

**Resposta de erro (404)**:
```json
{
  "message": "Candidato não encontrado"
}
```

---

### 5. Excluir Candidato
```http
DELETE /candidatos/:id
Authorization: Bearer {token}
```

**Permissão**: Apenas Admin

**Parâmetros**:
- `id` (path): UUID do candidato

**Resposta de sucesso (204)**:
```
No Content
```

**Resposta de erro (404)**:
```json
{
  "message": "Candidato não encontrado"
}
```

**Resposta de erro (403)**:
```json
{
  "message": "Acesso negado. Apenas administradores."
}
```

---

## Exemplo de Uso com cURL

### Fazer login como admin
```bash
curl -X POST http://localhost:3333/auth/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "email": "aisam@aisam.com.br",
    "password": "ind@2025#"
  }'
```

### Listar candidatos
```bash
curl -X GET http://localhost:3333/candidatos \
  -H "Authorization: Bearer {seu_token}"
```

### Criar candidato
```bash
curl -X POST http://localhost:3333/candidatos/admin \
  -H "Authorization: Bearer {seu_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Santos",
    "email": "maria@email.com",
    "telefone": "(11) 99999-9999",
    "cidade": "São Paulo",
    "estado": "SP",
    "resumo_curriculo": "Profissional experiente...",
    "areas_atuacao": ["Recursos Humanos"],
    "consentimento_dados": true
  }'
```

### Atualizar candidato
```bash
curl -X PUT http://localhost:3333/candidatos/{id} \
  -H "Authorization: Bearer {seu_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Santos Silva",
    "telefone": "(11) 88888-8888"
  }'
```

### Excluir candidato
```bash
curl -X DELETE http://localhost:3333/candidatos/{id} \
  -H "Authorization: Bearer {seu_token}"
```

---

## Notas Importantes

1. **Permissões**:
   - **Admin**: Pode criar, listar, visualizar, atualizar e excluir candidatos
   - **Recrutador**: Pode apenas listar e visualizar candidatos

2. **Validações**:
   - Email deve ser único no sistema
   - Todos os campos obrigatórios devem ser preenchidos na criação
   - O consentimento de dados é obrigatório

3. **Segurança**:
   - Todas as rotas de admin exigem autenticação
   - Tentativas de acesso sem permissão retornam erro 403
   - Tokens expirados retornam erro 401

4. **Integração com Candidaturas**:
   - Ao excluir um candidato, todas as suas candidaturas são afetadas conforme configuração do banco
   - Recomenda-se verificar se o candidato possui candidaturas ativas antes de excluir
