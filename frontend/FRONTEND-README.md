# Frontend AISAM - Sistema de Recrutamento

## ✅ Implementações Concluídas

### 🎯 Funcionalidades Implementadas

#### 1. Serviços de Integração com API Backend

**Arquivos Criados:**
- `src/services/api.ts` - Cliente Axios configurado
- `src/services/vagas.ts` - Serviço de vagas
- `src/services/candidatos.ts` - Serviço de candidatos
- `src/services/candidaturas.ts` - Serviço de candidaturas
- `src/services/areas.ts` - Serviço de áreas de atuação

**Funcionalidades:**
- Cliente HTTP centralizado com interceptors
- Autenticação automática via token JWT
- Tratamento de erros 401 (redirecionamento para login)
- Tipagem completa em TypeScript
- Integração com backend Node.js

---

#### 2. Página de Listagem de Vagas Públicas

**Arquivo:** `src/pages/Vagas.tsx`

**Funcionalidades:**
- Listagem de vagas abertas com cards responsivos
- Busca por título, descrição ou localidade
- Filtros por:
  - Regime de trabalho (Presencial/Híbrido/Remoto)
  - Senioridade (Estágio/Júnior/Pleno/Sênior/Especialista)
- Contador de resultados
- Máscaramento automático para vagas anônimas
- Animações com Framer Motion
- Loading state
- Navegação para detalhes da vaga

**Destaques:**
- Respeita mascaramento de dados sensíveis do backend
- Exibe "Empresa Confidencial" para vagas anônimas
- Cards com hover effects e animações
- Responsivo (mobile-first)

---

#### 3. Página de Detalhes da Vaga

**Arquivo:** `src/pages/VagaDetalhes.tsx`

**Funcionalidades:**
- Visualização completa dos detalhes da vaga
- Botão de candidatura
- Verificação se usuário já se candidatou
- Badge de status da vaga
- Informações completas:
  - Título e descrição
  - Empresa (ou "Empresa Confidencial")
  - Localização, regime, senioridade
  - Áreas de atuação
  - Email de contato (mascarado se anônima)
- Navegação de volta para listagem
- Feedback visual de candidatura realizada

**Fluxo de Candidatura:**
1. Usuário clica em "Candidatar-se"
2. Sistema verifica autenticação
3. Se não autenticado, redireciona para login
4. Se autenticado, cria candidatura via API
5. Exibe mensagem de sucesso
6. Bloqueia nova candidatura

---

#### 4. Formulário de Cadastro de Candidato

**Arquivo:** `src/components/CadastroCandidato.tsx`

**Funcionalidades:**
- Formulário completo com validação (React Hook Form)
- Campos:
  - Nome completo
  - E-mail (com validação)
  - Telefone
  - Cidade e Estado
  - Áreas de atuação (seleção múltipla)
  - Resumo do currículo (mínimo 50 caracteres)
  - Consentimento LGPD (obrigatório)
- Seleção visual de áreas de atuação com badges clicáveis
- Envio para API com tratamento de erros
- Mensagem de sucesso com envio de link mágico
- Resetemático do formulário após sucesso

**Validações:**
- Todos os campos obrigatórios
- Formato de e-mail válido
- Pelo menos uma área de atuação
- Mínimo de 50 caracteres no resumo
- Consentimento obrigatório

**Avisos LGPD:**
- Informação clara sobre período de 30 dias
- Termo de consentimento explícito
- Aviso sobre link mágico (24h de validade)

---

### 📁 Estrutura de Arquivos

```
frontend/
├── src/
│   ├── services/
│   │   ├── api.ts                          # NOVO
│   │   ├── vagas.ts                        # NOVO
│   │   ├── candidatos.ts                   # NOVO
│   │   ├── candidaturas.ts                 # NOVO
│   │   └── areas.ts                        # NOVO
│   ├── components/
│   │   └── CadastroCandidato.tsx          # NOVO
│   ├── pages/
│   │   ├── Vagas.tsx                       # ATUALIZADO
│   │   ├── VagaDetalhes.tsx                # NOVO
│   │   └── Index.tsx                       # ATUALIZADO
│   └── App.tsx                             # ATUALIZADO
├── .env.example                            # NOVO
└── FRONTEND-README.md                      # NOVO (este arquivo)
```

---

### 🔧 Configuração

#### 1. Variáveis de Ambiente

Criar arquivo `.env` baseado em `.env.example`:

```env
VITE_API_URL=http://localhost:3333
```

#### 2. Instalação

```bash
npm install
```

#### 3. Desenvolvimento

```bash
npm run dev
```

O frontend rodará em `http://localhost:5173` (porta padrão do Vite).

---

### 🚀 Rotas Implementadas

```typescript
/vagas                  // Listagem de vagas
/vaga/:id               // Detalhes e candidatura
```

O componente `CadastroCandidato` pode ser usado em qualquer página.

---

### 📝 Fluxos de Usuário

#### Fluxo de Busca e Candidatura

```
1. Usuário acessa /vagas
2. Visualiza lista de vagas com filtros
3. Clica em "Ver Detalhes"
4. Vê informações completas da vaga
5. Clica em "Candidatar-se"
6. Sistema valida autenticação:
   - SE não autenticado → Redireciona para login
   - SE autenticado → Cria candidatura
7. Exibe confirmação de sucesso
```

#### Fluxo de Cadastro

```
1. Usuário preenche formulário de cadastro
2. Seleciona áreas de atuação
3. Aceita termos LGPD
4. Submit do formulário
5. API cria candidato
6. Sistema envia email com link mágico
7. Exibe mensagem de sucesso
8. Usuário recebe email (válido por 24h)
9. Acessa sistema via link mágico
10. Tem acesso por 30 dias
```

---

### 🎨 Componentes UI Utilizados

Do shadcn/ui:
- `Card` - Cards de vagas
- `Button` - Botões de ação
- `Badge` - Tags e status
- `Input` - Campos de formulário
- `Textarea` - Campo de texto longo
- `Select` - Filtros dropdown
- `Checkbox` - Consentimento
- `Label` - Labels de formulário
- `Separator` - Divisores

Bibliotecas:
- `framer-motion` - Animações
- `react-hook-form` - Gerenciamento de formulários
- `lucide-react` - Ícones
- `sonner` - Toast notifications
- `axios` - HTTP client

---

### 🔒 Autenticação e Segurança

#### Token JWT
- Armazenado em `localStorage`
- Chave: `@AisamAuth:token`
- Adicionado automaticamente em todas as requisições
- Interceptor remove token se resposta 401

#### Proteção de Rotas
- Verificação de token antes de candidatura
- Redirecionamento automático para login
- Estado de retorno após autenticação

---

### 📊 Integração com Backend

#### Endpoints Utilizados

```typescript
GET    /vagas                    // Listar vagas
GET    /vagas/:id                // Detalhes da vaga
GET    /areas-atuacao            // Listar áreas
POST   /candidatos               // Criar candidato
POST   /candidaturas             // Criar candidatura
GET    /candidaturas             // Listar candidaturas
```

#### Tipos de Dados

Todos os tipos estão definidos nos arquivos de serviço com correspondência exata ao backend:
- `Vaga` - Interface de vaga
- `Candidato` - Interface de candidato
- `Candidatura` - Interface de candidatura
- `AreaAtuacao` - Interface de área

---

### ✨ Funcionalidades Especiais

#### Mascaramento de Vagas Anônimas

O frontend respeita automaticamente o mascaramento feito pelo backend:
- URLs removidas
- Emails externos removidos
- CNPJs removidos
- Nome da empresa ocultado
- Email genérico exibido

#### Seleção de Áreas

Interface visual intuitiva:
- Badges clicáveis
- Feedback visual ao selecionar
- Ícone X para remover
- Lista dinâmica carregada da API

#### Validações

- Cliente-side com React Hook Form
- Feedback em tempo real
- Mensagens de erro claras
- Bloqueios visuais (disabled states)

---

### 🎯 Próximas Melhorias Sugeridas

#### Curto Prazo
- [ ] Paginação nas listagens de vagas
- [ ] Filtro por área de atuação na página de vagas
- [ ] Preview de currículo antes de upload
- [ ] Histórico de candidaturas do usuário

#### Médio Prazo
- [ ] Dashboard do candidato
- [ ] Notificações em tempo real
- [ ] Chat com recrutadores
- [ ] Sistema de favoritos

#### Longo Prazo
- [ ] PWA (Progressive Web App)
- [ ] Modo offline
- [ ] Notificações push
- [ ] Internacionalização (i18n)

---

### 🐛 Tratamento de Erros

#### Erros de API
```typescript
try {
  await vagasService.listar();
} catch (error) {
  toast.error('Mensagem amigável ao usuário');
  console.error('Log detalhado para debug');
}
```

#### Estados de Loading
- Spinner centralizado
- Skeleton screens (possível melhoria)
- Disabled states em botões

#### Feedback ao Usuário
- Toast notifications (sonner)
- Mensagens de sucesso
- Mensagens de erro
- Estados visuais

---

### 📱 Responsividade

Breakpoints utilizados:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px

Grid responsivo:
- Mobile: 1 coluna
- Tablet: 2 colunas
- Desktop: 3 colunas

---

### 🎨 Design System

#### Cores
- Primary: Azul AISAM
- Accent: Cor secundária
- Muted: Textos secundários
- Destructive: Erros

#### Typography
- Títulos: Bold, tamanhos variados
- Corpo: Regular, legível
- Descrições: Muted foreground

#### Espaçamento
- Consistente com Tailwind
- Sistema de 4px base
- Padding e margin padronizados

---

### 📖 Como Usar

#### Adicionar Cadastro a Qualquer Página

```tsx
import CadastroCandidato from "@/components/CadastroCandidato";

function MinhaPage() {
  return (
    <div>
      <CadastroCandidato />
    </div>
  );
}
```

#### Navegar Programaticamente

```tsx
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();
navigate('/vaga/123');
```

#### Exibir Toast

```tsx
import { toast } from "sonner";

toast.success('Operação realizada!');
toast.error('Algo deu errado');
```

---

### 🔗 Links Úteis

- **Vite**: https://vitejs.dev/
- **React**: https://react.dev/
- **shadcn/ui**: https://ui.shadcn.com/
- **Framer Motion**: https://www.framer.com/motion/
- **React Hook Form**: https://react-hook-form.com/

---

**Status:** ✅ Frontend institucional concluído e integrado com backend
**Data:** Outubro 2025
**Desenvolvedor:** Claude AI Assistant
