# Frontend AISAM - Sistema de Recrutamento

## 🚀 Estrutura Criada

### Instalado:
- ✅ React + TypeScript + Vite
- ✅ React Router DOM
- ✅ Axios
- ✅ TailwindCSS
- ✅ Headless UI
- ✅ Lucide React (ícones)

### Configurado:
- ✅ AuthContext com gestão de autenticação
- ✅ Serviço API com interceptors
- ✅ TailwindCSS com tema customizado

---

## 📁 Estrutura de Pastas Necessária

```
src/
├── components/
│   ├── Layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Layout.tsx
│   ├── Vagas/
│   │   ├── VagaCard.tsx
│   │   └── VagaForm.tsx
│   └── Common/
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Modal.tsx
├── contexts/
│   └── AuthContext.tsx ✅
├── pages/
│   ├── Login.tsx
│   ├── Public/
│   │   ├── Vagas.tsx
│   │   ├── CadastroCandidato.tsx
│   │   └── AceitarConvite.tsx
│   ├── Admin/
│   │   ├── Dashboard.tsx
│   │   ├── Recrutadores.tsx
│   │   ├── Associados.tsx
│   │   └── Auditoria.tsx
│   ├── Recrutador/
│   │   ├── Dashboard.tsx
│   │   ├── Vagas.tsx
│   │   └── Candidaturas.tsx
│   └── Candidato/
│       ├── Area.tsx
│       └── MinhasCandidaturas.tsx
├── services/
│   └── api.ts ✅
└── App.tsx
```

---

## 🔌 Endpoints da API

### Autenticação
```typescript
POST /auth/admin                    // { email, senha }
POST /auth/recrutador              // { email, senha }
POST /auth/candidato/magic-link    // { email }
```

### Admin
```typescript
GET  /auditoria
POST /recrutadores/convite
GET  /recrutadores
GET  /associados
POST /associados/pedido-associacao
PUT  /associados/aprovar-pedido
```

### Recrutador
```typescript
GET  /vagas
POST /vagas
PUT  /vagas/:id
PATCH /vagas/:id/arquivar
GET  /candidaturas
PATCH /candidaturas/:id/status
GET  /candidatos
```

### Público/Candidato
```typescript
GET  /vagas                        // Listar vagas
POST /candidatos                   // Cadastrar
GET  /candidatos/profile           // Perfil (autenticado)
PATCH /candidatos/:id/curriculo    // Upload PDF
POST /candidaturas                 // Candidatar-se
POST /recrutadores/aceitar-convite // Aceitar convite
```

---

## 🎨 Componentes Principais

### Login
- Tabs para Admin/Recrutador
- Form de e-mail/senha
- Link para área de candidatos

### Dashboard Admin
- Estatísticas gerais
- Lista de pedidos de associação pendentes
- Gestão de recrutadores
- Logs de auditoria

### Dashboard Recrutador
- Vagas ativas/arquivadas
- Candidaturas recentes
- Criar nova vaga
- Buscar candidatos

### Área do Candidato
- Contador de dias restantes
- Minhas candidaturas
- Upload de currículo
- Buscar vagas

### Vagas Públicas
- Grid de vagas disponíveis
- Filtros por área/localidade
- Botão "Candidatar-se"

---

## 🔐 Fluxos de Autenticação

### Admin/Recrutador
1. Login com email/senha
2. Recebe token JWT (7 dias)
3. Token salvo no localStorage
4. Interceptor adiciona em todas requests

### Candidato
1. Informa e-mail
2. Recebe link mágico (token 24h)
3. Acesso válido por 30 dias
4. Contador de dias restantes
5. Notificações D-7 e D-1

---

## 🚀 Próximos Passos

1. Criar componentes de layout (Header, Sidebar)
2. Criar páginas principais (Login, Dashboards)
3. Implementar formulários (Vagas, Candidatos)
4. Criar listagens com paginação
5. Implementar upload de arquivo
6. Adicionar notificações (toast)
7. Responsividade mobile

---

## 📝 Comandos

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

---

## 🌐 Variáveis de Ambiente

Criar arquivo `.env`:

```env
VITE_API_URL=http://localhost:3333
```

---

## 📦 Pacotes Adicionais Sugeridos

```bash
npm install react-hot-toast       # Notificações
npm install date-fns               # Manipulação de datas
npm install react-hook-form        # Formulários
npm install @tanstack/react-query  # Cache de dados
npm install clsx                   # Utilitário de classes CSS
```

---

**O frontend está estruturado e pronto para desenvolvimento das páginas!**
