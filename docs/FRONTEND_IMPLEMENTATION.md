# Implementação Frontend - AISAM Recrutamento

## Visão Geral

Este documento descreve a implementação dos dois frontends do sistema AISAM de recrutamento:

1. **Frontend Institucional** (`/frontend`) - Site público com vagas e cadastro de candidatos
2. **Frontend Aplicação** (`/frontend-app`) - Sistema administrativo para Admin e Recrutadores

---

## 1. Frontend Institucional (`/frontend`)

### 1.1. Tecnologias

- React 18+ com TypeScript
- Vite como build tool
- React Router DOM v7
- TailwindCSS para estilização
- shadcn/ui para componentes
- Axios para requisições HTTP
- React Hook Form para formulários
- Framer Motion para animações

### 1.2. Estrutura de Diretórios

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.tsx              # Cabeçalho com navegação
│   │   ├── CadastroCandidato.tsx   # Formulário de cadastro
│   │   └── ui/                     # Componentes shadcn/ui
│   ├── pages/
│   │   ├── Index.tsx               # Página inicial
│   │   ├── Vagas.tsx               # Listagem pública de vagas
│   │   ├── Aisam.tsx               # Sobre a AISAM
│   │   └── ...                     # Outras páginas institucionais
│   ├── services/
│   │   ├── api.ts                  # Cliente Axios configurado
│   │   ├── vagas.ts                # Serviço de vagas
│   │   ├── candidatos.ts           # Serviço de candidatos
│   │   ├── candidaturas.ts         # Serviço de candidaturas
│   │   └── areas.ts                # Serviço de áreas de atuação
│   └── App.tsx                     # Rotas principais
├── .env.example                    # Variáveis de ambiente
└── package.json
```

### 1.3. Configuração

#### .env.example
```env
VITE_API_URL=http://localhost:3333
```

#### Instalação
```bash
cd frontend
npm install
```

#### Desenvolvimento
```bash
npm run dev
# Roda em http://localhost:5173
```

### 1.4. Funcionalidades Implementadas

#### 1.4.1. Header Component (`src/components/Header.tsx`)

- **Navegação Responsiva**: Menu hambúrguer em mobile
- **Itens do Menu**:
  - Home
  - AISAM
  - **Vagas** ← Nova página implementada
  - Associados
  - Diretoria
  - Consultoria Jurídica
  - Serviços
  - JAISAM
  - Associe-se
  - Links Úteis
  - Notícias

- **Botão "Acessar Sistema"**: Redireciona para `http://localhost:5174` (frontend-app)
- **Active State**: Destaca página atual na navegação

#### 1.4.2. Página de Vagas (`src/pages/Vagas.tsx`)

**Funcionalidades**:
- Listagem de vagas públicas (status: aberta)
- Busca por título, descrição ou localidade
- Filtros:
  - Regime (Presencial, Híbrido, Remoto)
  - Senioridade (Estágio, Júnior, Pleno, Sênior, Especialista)
- Exibição de informações:
  - Título da vaga
  - Nome da empresa (ou "Empresa Confidencial" se anônima)
  - Localidade
  - Descrição (limitada)
  - Áreas de atuação (tags)
- **CTA de Cadastro**: Botão "Cadastrar como Candidato"
- **Integração com Formulário**: Ao clicar, exibe o componente `CadastroCandidato`

#### 1.4.3. Formulário de Cadastro de Candidato (`src/components/CadastroCandidato.tsx`)

**Campos**:
- Nome completo (obrigatório)
- E-mail (obrigatório, validação de formato)
- Telefone (obrigatório)
- Cidade (obrigatório)
- Estado (select com UF)
- Resumo profissional (mínimo 50 caracteres)
- Áreas de atuação (multi-select)
- Checkbox de consentimento LGPD (obrigatório)

**Validações**:
- Todos os campos obrigatórios
- E-mail válido
- Resumo mínimo de 50 caracteres
- Pelo menos uma área de atuação
- Consentimento obrigatório

**Fluxo**:
1. Candidato preenche formulário
2. Sistema cria registro do candidato
3. Backend envia e-mail com magic link (30 dias de acesso)
4. Candidato recebe link para acessar área do candidato

#### 1.4.4. Serviços de API

**`src/services/api.ts`**:
```typescript
// Cliente Axios configurado
- baseURL: VITE_API_URL ou http://localhost:3333
- Interceptor de request: Adiciona token JWT automaticamente
- Interceptor de response: Redireciona para /login em 401
```

**`src/services/vagas.ts`**:
```typescript
interface Vaga {
  id: string;
  titulo: string;
  descricao: string;
  localidade?: string;
  regime: 'presencial' | 'hibrido' | 'remoto';
  senioridade: 'estagio' | 'junior' | 'pleno' | 'senior' | 'especialista';
  areas_atuacao: string[];
  empresa_anonima: boolean;
  associado?: { razao_social: string };
}

// Métodos:
- listar(filtros?: FiltrosVagas): Promise<Vaga[]>
```

**`src/services/candidatos.ts`**:
```typescript
interface Candidato {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  estado: string;
  resumo_curriculo: string;
  areas_atuacao: string[];
  consentimento_dados: boolean;
}

// Métodos:
- criar(candidato: CriarCandidatoDTO): Promise<Candidato>
```

**`src/services/areas.ts`**:
```typescript
interface AreaAtuacao {
  id: string;
  nome: string;
  slug: string;
  ativo: boolean;
}

// Métodos:
- listar(apenasAtivas?: boolean): Promise<AreaAtuacao[]>
```

### 1.5. Rotas

```typescript
<Route path="/vagas" element={<Vagas />} />
```

---

## 2. Frontend Aplicação (`/frontend-app`)

### 2.1. Tecnologias

- React 19+ com TypeScript
- Vite como build tool
- React Router DOM v7
- TailwindCSS para estilização
- Axios para requisições HTTP
- Lucide React para ícones

### 2.2. Estrutura de Diretórios

```
frontend-app/
├── src/
│   ├── components/
│   │   ├── Layout.tsx              # Layout base com sidebar
│   │   └── ProtectedRoute.tsx      # HOC para rotas protegidas
│   ├── contexts/
│   │   └── AuthContext.tsx         # Contexto de autenticação
│   ├── pages/
│   │   ├── Login.tsx               # Login Admin/Recrutador
│   │   ├── Admin/
│   │   │   └── Dashboard.tsx       # Dashboard administrativo
│   │   └── Recrutador/
│   │       └── Dashboard.tsx       # Dashboard do recrutador
│   ├── services/
│   │   ├── api.ts                  # Cliente Axios
│   │   ├── vagas.ts                # Serviço de vagas
│   │   ├── candidatos.ts           # Serviço de candidatos
│   │   ├── candidaturas.ts         # Serviço de candidaturas
│   │   └── areas.ts                # Serviço de áreas
│   └── App.tsx                     # Rotas protegidas
├── .env.example
└── package.json
```

### 2.3. Configuração

#### .env.example
```env
VITE_API_URL=http://localhost:3333
```

#### Instalação
```bash
cd frontend-app
npm install
```

#### Desenvolvimento
```bash
npm run dev
# Roda em http://localhost:5174
```

### 2.4. Funcionalidades Implementadas

#### 2.4.1. Sistema de Autenticação (`src/contexts/AuthContext.tsx`)

**Funcionalidades**:
- Login para Admin e Recrutador
- Armazenamento de token JWT no localStorage
- Interceptor HTTP para adicionar token
- Logout e limpeza de sessão

**Interface User**:
```typescript
interface User {
  id: string;
  nome: string;
  email: string;
  role: 'ADMIN_AISAM' | 'RECRUTADOR' | 'CANDIDATO';
}
```

**Métodos**:
```typescript
- signIn(email, senha, userType): Promise<void>
  // userType: 'admin' | 'recrutador'

- signInCandidato(email): Promise<void>
  // Gera magic link para candidato

- signOut(): void
```

#### 2.4.2. Página de Login (`src/pages/Login.tsx`)

**Layout**:
- Tela centralizada com gradiente
- Logo AISAM
- Tabs para Admin/Recrutador
- Formulário com email e senha
- Link "Ver Vagas Disponíveis" → Redireciona para site institucional

**Fluxo**:
1. Usuário seleciona tab (Admin ou Recrutador)
2. Insere credenciais
3. Sistema autentica via API
4. Redireciona para dashboard correspondente:
   - Admin → `/admin`
   - Recrutador → `/recrutador`

#### 2.4.3. Layout Base (`src/components/Layout.tsx`)

**Estrutura**:
- **Header**: Logo, título da página, nome do usuário, botão de logout
- **Sidebar**: Menu lateral com navegação por role
- **Main Content**: Área de conteúdo das páginas

**Menu Admin**:
- Dashboard
- Vagas
- Associados
- Recrutadores
- Relatórios

**Menu Recrutador**:
- Dashboard
- Minhas Vagas
- Candidaturas

#### 2.4.4. ProtectedRoute Component

```typescript
// Funcionalidades:
- Verifica se usuário está autenticado
- Valida role permitida
- Redireciona para /login se não autorizado
- Exibe loader durante verificação

// Uso:
<ProtectedRoute allowedRoles={['ADMIN_AISAM']}>
  <AdminDashboard />
</ProtectedRoute>
```

#### 2.4.5. Dashboard Admin (`src/pages/Admin/Dashboard.tsx`)

**Estatísticas**:
- Total de vagas
- Vagas abertas vs fechadas
- Total de associados (TODO: Implementar endpoint)
- Total de recrutadores (TODO: Implementar endpoint)

**Ações Rápidas**:
- Gerenciar Vagas
- Gerenciar Associados
- Gerenciar Recrutadores
- Ver Relatórios
- Gerenciar Áreas de Atuação

**Status do Sistema**:
- Backend API: Operacional
- Banco de Dados: Operacional
- Serviço de E-mail: Operacional

#### 2.4.6. Dashboard Recrutador (`src/pages/Recrutador/Dashboard.tsx`)

**Estatísticas**:
- Total de vagas publicadas
- Vagas abertas
- Total de candidaturas recebidas
- Candidaturas não avaliadas (pendentes)

**Ações Rápidas**:
- Botão "Nova Vaga"
- Gerenciar Vagas
- Ver Candidaturas

**Alertas**:
- Notificação de candidaturas pendentes de avaliação

### 2.5. Rotas

```typescript
// Públicas
<Route path="/" element={<Navigate to="/login" />} />
<Route path="/login" element={<Login />} />

// Protegidas - Admin
<Route path="/admin" element={
  <ProtectedRoute allowedRoles={['ADMIN_AISAM']}>
    <AdminDashboard />
  </ProtectedRoute>
} />

// Protegidas - Recrutador
<Route path="/recrutador" element={
  <ProtectedRoute allowedRoles={['RECRUTADOR']}>
    <RecrutadorDashboard />
  </ProtectedRoute>
} />

// TODO: Rotas futuras
// /admin/vagas, /admin/associados, /admin/recrutadores
// /recrutador/vagas, /recrutador/candidaturas
```

---

## 3. Integração Entre Frontends

### 3.1. Navegação Site → Aplicação

**Header do Site Institucional**:
```tsx
// Botão "Acessar Sistema"
<a href="http://localhost:5174" target="_blank">
  Acessar Sistema
</a>
```

### 3.2. Navegação Aplicação → Site

**Login Page**:
```tsx
// Link "Ver Vagas Disponíveis"
<a href="http://localhost:5173/vagas">
  Ver Vagas Disponíveis
</a>
```

### 3.3. Fluxo do Candidato

1. Candidato acessa site institucional
2. Navega para `/vagas`
3. Visualiza vagas públicas
4. Clica em "Cadastrar como Candidato"
5. Preenche formulário
6. Recebe e-mail com magic link (30 dias)
7. Acessa área do candidato via magic link (TODO: Implementar)

### 3.4. Fluxo do Recrutador

1. Recebe e-mail de convite do Admin
2. Clica no link de convite
3. Define senha
4. Acessa `http://localhost:5174`
5. Faz login com email/senha
6. Acessa dashboard do recrutador

---

## 4. Endpoints da API Utilizados

### 4.1. Áreas de Atuação
```
GET /areas-atuacao?apenasAtivas=true
POST /areas-atuacao
```

### 4.2. Vagas
```
GET /vagas?status=aberta&regime=remoto&senioridade=pleno
```

### 4.3. Candidatos
```
POST /candidatos
GET /candidatos/profile
PATCH /candidatos/:id
PATCH /candidatos/:id/curriculo
POST /candidatos/magic-link
```

### 4.4. Candidaturas
```
POST /candidaturas
GET /candidaturas?vaga_id=xxx&candidato_id=xxx
GET /candidaturas/:id
DELETE /candidaturas/:id
PATCH /candidaturas/:id/status
```

### 4.5. Autenticação
```
POST /auth/admin
POST /auth/recrutador
POST /auth/candidato/magic-link
```

---

## 5. Variáveis de Ambiente

### Frontend Institucional (`:5173`)
```env
VITE_API_URL=http://localhost:3333
```

### Frontend Aplicação (`:5174`)
```env
VITE_API_URL=http://localhost:3333
```

---

## 6. Próximas Implementações

### 6.1. Frontend Institucional
- [ ] Página de detalhes da vaga
- [ ] Sistema de upload de currículo
- [ ] Página de confirmação pós-cadastro

### 6.2. Frontend Aplicação

#### Admin
- [ ] Página de gerenciamento de vagas
- [ ] Página de gerenciamento de associados
- [ ] Página de gerenciamento de recrutadores
- [ ] Página de relatórios e estatísticas
- [ ] Página de gerenciamento de áreas de atuação
- [ ] Sistema de convite de recrutadores

#### Recrutador
- [ ] Página de listagem de vagas do recrutador
- [ ] Formulário de criação/edição de vaga
- [ ] Página de candidaturas recebidas
- [ ] Visualização de currículo do candidato
- [ ] Sistema de avaliação de candidatos
- [ ] Filtros e busca avançada

#### Candidato
- [ ] Dashboard com vagas salvas
- [ ] Histórico de candidaturas
- [ ] Contador de dias restantes (30 dias)
- [ ] Upload/atualização de currículo
- [ ] Edição de perfil
- [ ] Sistema de notificações

---

## 7. Comandos Úteis

### Instalar dependências
```bash
# Frontend institucional
cd frontend && npm install

# Frontend aplicação
cd frontend-app && npm install
```

### Desenvolvimento
```bash
# Frontend institucional (porta 5173)
cd frontend && npm run dev

# Frontend aplicação (porta 5174)
cd frontend-app && npm run dev
```

### Build para produção
```bash
# Frontend institucional
cd frontend && npm run build

# Frontend aplicação
cd frontend-app && npm run build
```

### Lint
```bash
npm run lint
```

---

## 8. Observações Importantes

### 8.1. LGPD e Privacidade
- Formulário de candidato inclui checkbox de consentimento obrigatório
- Dados sensíveis são protegidos
- Vagas anônimas ocultam informações da empresa

### 8.2. Segurança
- JWT armazenado em localStorage
- Rotas protegidas por role
- Interceptors HTTP para autenticação
- Validação de formulários no frontend

### 8.3. UX/UI
- Design responsivo (mobile-first)
- Animações com Framer Motion
- Feedback visual de loading
- Mensagens de erro claras
- Componentes reutilizáveis do shadcn/ui

### 8.4. Performance
- Lazy loading de rotas (TODO)
- Otimização de imagens
- Code splitting
- Cache de requisições (TODO)

---

## 9. Estrutura de Dados

### 9.1. LocalStorage

```typescript
// Frontend Aplicação
'@AisamRecrutamento:token': string        // JWT token
'@AisamRecrutamento:user': string         // User JSON
'@AisamRecrutamento:expires_at': string   // Data de expiração (candidatos)
```

### 9.2. Interface Vaga (Frontend)
```typescript
interface Vaga {
  id: string;
  titulo: string;
  descricao: string;
  localidade?: string;
  regime: 'presencial' | 'hibrido' | 'remoto';
  senioridade: 'estagio' | 'junior' | 'pleno' | 'senior' | 'especialista';
  status: 'aberta' | 'fechada' | 'pausada';
  areas_atuacao: string[];
  empresa_anonima: boolean;
  associado?: {
    razao_social: string;
  };
}
```

### 9.3. Interface Candidato (Frontend)
```typescript
interface Candidato {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  estado: string;
  resumo_curriculo: string;
  areas_atuacao: string[];
  curriculo_url?: string;
  consentimento_dados: boolean;
  created_at: string;
}
```

---

## 10. Troubleshooting

### Erro: "Cannot connect to API"
```bash
# Verificar se backend está rodando
cd backend && npm run dev

# Verificar variável VITE_API_URL no .env
```

### Erro: "401 Unauthorized"
```bash
# Limpar localStorage e fazer login novamente
localStorage.clear()
```

### Erro de CORS
```bash
# Verificar configuração de CORS no backend
# backend/src/shared/infra/http/app.ts
```

---

**Documentação criada em**: 2025-01-XX
**Última atualização**: 2025-01-XX
**Versão**: 1.0.0
