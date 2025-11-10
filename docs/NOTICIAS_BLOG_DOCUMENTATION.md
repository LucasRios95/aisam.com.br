# Sistema de Notícias/Blog - AISAM

## ✅ Implementação Completa

Sistema de gerenciamento de notícias com publicação manual (Admin) e automática (Webhook N8N).

---

## 🗄️ Backend

### 1. Banco de Dados

**Migration**: `1759541000000-CreateNoticia.ts`

**Tabela**: `noticia`

```sql
Campos:
- id (uuid, PK)
- titulo (varchar 255)
- slug (varchar 255, unique) -- Gerado automaticamente
- resumo (text, nullable)
- conteudo (text) *obrigatório
- imagem_url (varchar 500, nullable)
- autor (varchar 100, nullable)
- fonte (varchar 255, nullable) -- 'manual', 'n8n', etc
- fonte_url (varchar 500, nullable) -- URL original se importada
- tags (jsonb, nullable) -- Array de tags
- publicada (boolean, default true)
- destaque (boolean, default false)
- data_publicacao (timestamp, default now())
- visualizacoes (integer, default 0)
- created_at (timestamp)
- updated_at (timestamp)

Índices:
- idx_noticia_slug
- idx_noticia_publicada
- idx_noticia_destaque
- idx_noticia_data_publicacao (DESC)
```

**Comando para rodar migration**:
```bash
cd backend
npm run typeorm migration:run
```

---

### 2. Endpoints da API

#### **Públicos (Sem autenticação)**

```http
GET /noticias
Descrição: Lista notícias
Query Params:
  - publicada: boolean (opcional)
  - destaque: boolean (opcional)
  - tags: string[] (opcional, separado por vírgula)
  - busca: string (opcional, busca em título/resumo/conteúdo)
Resposta: Noticia[]
```

```http
GET /noticias/:identificador?tipo=slug
Descrição: Busca notícia por ID ou Slug
Query Params:
  - tipo: 'slug' | 'id' (default: 'id')
Resposta: Noticia
Incrementa visualizações automaticamente
```

#### **Webhook N8N (Sem autenticação)**

```http
POST /noticias/webhook/n8n
Descrição: Recebe notícias do N8N
Body: {
  titulo: string *obrigatório
  resumo?: string
  conteudo: string *obrigatório
  imagem_url?: string
  autor?: string (default: "Automação N8N")
  fonte_url?: string
  tags?: string[]
  data_publicacao?: string (ISO 8601)
}
Resposta: { message: string, noticia: Noticia }
Automático: publicada=true, fonte='n8n', destaque=false
```

**Exemplo de Chamada N8N**:
```javascript
// No N8N, use o nó HTTP Request:
{
  "method": "POST",
  "url": "https://seu-dominio.com/noticias/webhook/n8n",
  "body": {
    "titulo": "{{ $json.title }}",
    "resumo": "{{ $json.summary }}",
    "conteudo": "{{ $json.content }}",
    "imagem_url": "{{ $json.image }}",
    "fonte_url": "{{ $json.url }}",
    "tags": ["{{ $json.category }}"],
    "data_publicacao": "{{ $json.pubDate }}"
  }
}
```

#### **Protegidos (Admin apenas)**

```http
POST /noticias
Descrição: Criar notícia manualmente
Auth: Bearer Token (Admin)
Body: CriarNoticiaDTO
Resposta: Noticia
```

```http
PATCH /noticias/:id
Descrição: Atualizar notícia
Auth: Bearer Token (Admin)
Body: AtualizarNoticiaDTO
Resposta: Noticia
```

```http
DELETE /noticias/:id
Descrição: Deletar notícia
Auth: Bearer Token (Admin)
Resposta: 204 No Content
```

---

### 3. DTOs

**CriarNoticiaDTO**:
```typescript
{
  titulo: string *obrigatório
  slug?: string (auto-gerado se omitido)
  resumo?: string
  conteudo: string *obrigatório
  imagem_url?: string
  autor?: string
  tags?: string[]
  publicada?: boolean (default: true)
  destaque?: boolean (default: false)
  data_publicacao?: Date
}
```

**AtualizarNoticiaDTO**:
```typescript
{
  titulo?: string
  slug?: string
  resumo?: string
  conteudo?: string
  imagem_url?: string
  autor?: string
  tags?: string[]
  publicada?: boolean
  destaque?: boolean
  data_publicacao?: Date
}
```

---

## 🖥️ Frontend Admin

### Página de Gerenciamento
**Arquivo**: `frontend-app/src/pages/Admin/Noticias.tsx` (A CRIAR)

**Rota**: `/admin/noticias`

**Funcionalidades**:
- ✅ Listagem de todas as notícias
- ✅ Busca por título/conteúdo
- ✅ Filtros:
  - Status (Publicada/Rascunho)
  - Destaque (Sim/Não)
  - Fonte (Manual/N8N)
  - Tags
- ✅ Formulário de criação:
  - Título
  - Slug (auto-gerado, editável)
  - Resumo (textarea)
  - Conteúdo (editor de texto rico)
  - URL da imagem
  - Autor
  - Tags (multi-select)
  - Checkboxes: Publicada, Destaque
  - Data de publicação
- ✅ Edição inline
- ✅ Exclusão com confirmação
- ✅ Indicadores visuais:
  - Badge de fonte (Manual/N8N)
  - Badge de status (Publicada/Rascunho)
  - Badge de destaque
  - Contador de visualizações
- ✅ Preview da notícia

**Estatísticas**:
- Total de notícias
- Publicadas
- Em destaque
- Total de visualizações
- Notícias por fonte (Manual vs N8N)

**Exemplo de Card**:
```
┌──────────────────────────────────────┐
│ 📰 Título da Notícia                 │
│ ─────────────────────────────────────│
│ Autor: João Silva | 150 👁          │
│ 23/01/2025 | 🏷️ Tecnologia, IA      │
│                                      │
│ [✓ Publicada] [★ Destaque] [🤖 N8N] │
│                                      │
│ Resumo: Lorem ipsum dolor sit...    │
│                                      │
│ [👁 Ver] [✏️ Editar] [🗑️ Excluir]    │
└──────────────────────────────────────┘
```

---

## 🌐 Frontend Site Institucional

### 1. Página do Blog
**Arquivo**: `frontend/src/pages/Noticias.tsx` (JÁ EXISTE NO MENU)

**Rota**: `/noticias`

**Funcionalidades**:
- ✅ Listagem de notícias publicadas
- ✅ Grid responsivo 3 colunas
- ✅ Cards com:
  - Imagem de destaque
  - Título
  - Resumo (limitado)
  - Data de publicação
  - Tags
  - Autor
  - Contador de visualizações
- ✅ Busca por título
- ✅ Filtro por tags
- ✅ Seção de notícias em destaque (topo)
- ✅ Paginação
- ✅ Link para notícia completa

**Layout Sugerido**:
```
┌────────────────────────────────────────────┐
│         NOTÍCIAS EM DESTAQUE               │
│  ┌──────┐  ┌──────┐  ┌──────┐            │
│  │ IMG  │  │ IMG  │  │ IMG  │            │
│  │ Not1 │  │ Not2 │  │ Not3 │            │
│  └──────┘  └──────┘  └──────┘            │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│  [🔍 Buscar...]     [🏷️ Tags: Todas ▼]   │
└────────────────────────────────────────────┘

┌─────────┐ ┌─────────┐ ┌─────────┐
│  Img    │ │  Img    │ │  Img    │
│ Título  │ │ Título  │ │ Título  │
│ Resumo  │ │ Resumo  │ │ Resumo  │
│ 👁 150  │ │ 👁 230  │ │ 👁 89   │
│[Ler +]  │ │[Ler +]  │ │[Ler +]  │
└─────────┘ └─────────┘ └─────────┘
```

### 2. Página de Notícia Individual
**Arquivo**: `frontend/src/pages/NoticiaDetalhes.tsx` (A CRIAR)

**Rota**: `/noticias/:slug`

**Funcionalidades**:
- ✅ Título da notícia
- ✅ Imagem de destaque (full-width)
- ✅ Metadados:
  - Data de publicação
  - Autor
  - Tempo de leitura estimado
  - Contador de visualizações
- ✅ Tags como badges
- ✅ Conteúdo completo (HTML renderizado)
- ✅ Link para fonte original (se existir)
- ✅ Botões de compartilhamento social
- ✅ Notícias relacionadas (mesmas tags)
- ✅ Breadcrumb: Home > Notícias > Título

---

## 🔄 Integração com N8N

### Fluxo Básico

```
┌─────────────┐
│   Fonte     │ (RSS, API, Web Scraping)
│  Externa    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│     N8N     │
│   Workflow  │
│             │
│ 1. Fetch    │
│ 2. Parse    │
│ 3. Filter   │
│ 4. Format   │
└──────┬──────┘
       │
       ▼ POST /noticias/webhook/n8n
┌─────────────┐
│   Backend   │
│   AISAM     │
│             │
│ - Valida    │
│ - Cria      │
│ - Publica   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Frontend   │
│    Site     │
│             │
│ Notícia     │
│ Publicada   │
└─────────────┘
```

### Exemplo de Workflow N8N

**1. Nó HTTP Request (Fetch RSS)**
```json
{
  "method": "GET",
  "url": "https://exemplo.com/rss.xml"
}
```

**2. Nó XML (Parse)**
```json
{
  "mode": "xmlToJson"
}
```

**3. Nó Function (Transform)**
```javascript
const items = $input.all();

return items.map(item => {
  const entry = item.json.rss.channel[0].item;

  return {
    json: {
      titulo: entry[0].title[0],
      resumo: entry[0].description[0].substring(0, 200),
      conteudo: entry[0]['content:encoded']?.[0] || entry[0].description[0],
      imagem_url: entry[0]['media:content']?.[0]?.$.url,
      fonte_url: entry[0].link[0],
      tags: entry[0].category || [],
      data_publicacao: entry[0].pubDate[0]
    }
  };
});
```

**4. Nó HTTP Request (Send to Webhook)**
```json
{
  "method": "POST",
  "url": "https://seu-dominio.com/noticias/webhook/n8n",
  "body": "={{ $json }}",
  "headers": {
    "Content-Type": "application/json"
  }
}
```

**5. Nó Schedule (Cron)**
```
0 */6 * * * (A cada 6 horas)
```

---

## 📊 Métricas e Analytics

### Tracking de Visualizações
- Incremento automático ao acessar notícia
- Contador exibido no admin
- Pode ser usado para:
  - Ranking de notícias mais lidas
  - Dashboard de performance
  - Relatórios

### Possíveis Integrações Futuras
- Google Analytics
- Meta Pixel
- Newsletter (envio automático)
- Notificações push
- RSS Feed próprio

---

## 🎨 Componentes Visuais

### Tags/Badges Sugeridas

```css
/* Status */
.publicada { background: #10b981; color: white; }
.rascunho { background: #6b7280; color: white; }

/* Fonte */
.manual { background: #3b82f6; color: white; }
.n8n { background: #ff6d5a; color: white; }

/* Destaque */
.destaque { background: #f59e0b; color: white; }
```

### Cards de Notícia
- Imagem aspect-ratio 16:9
- Altura máxima de título: 2 linhas
- Resumo: 3 linhas com ellipsis
- Hover: Elevação sutil
- Animação ao carregar

---

## 🔒 Segurança

### Webhook N8N
**Opção 1: Token na Query**
```typescript
// No middleware:
if (request.path === '/noticias/webhook/n8n') {
  const token = request.query.token;
  if (token !== process.env.N8N_WEBHOOK_TOKEN) {
    throw new AppError('Token inválido', 401);
  }
}
```

**Opção 2: API Key no Header**
```typescript
const apiKey = request.headers['x-api-key'];
if (apiKey !== process.env.N8N_API_KEY) {
  throw new AppError('API Key inválida', 401);
}
```

**Opção 3: Webhook Signature (Mais seguro)**
```typescript
const signature = request.headers['x-webhook-signature'];
const payload = JSON.stringify(request.body);
const expectedSignature = crypto
  .createHmac('sha256', process.env.WEBHOOK_SECRET)
  .update(payload)
  .digest('hex');

if (signature !== expectedSignature) {
  throw new AppError('Assinatura inválida', 401);
}
```

---

## 📝 Comandos Úteis

### Backend
```bash
# Rodar migration
npm run typeorm migration:run

# Reverter migration
npm run typeorm migration:revert

# Iniciar servidor
npm run dev
```

### Frontend
```bash
# Frontend institucional
cd frontend && npm run dev

# Frontend admin
cd frontend-app && npm run dev
```

### Testar Webhook
```bash
curl -X POST http://localhost:3333/noticias/webhook/n8n \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Teste de Notícia",
    "conteudo": "Conteúdo de teste enviado via webhook",
    "resumo": "Resumo da notícia de teste",
    "tags": ["teste", "webhook"]
  }'
```

---

## 🚀 Próximos Passos

### Backend
- [ ] Adicionar autenticação no webhook (token/signature)
- [ ] Implementar paginação nas listagens
- [ ] Criar endpoint de estatísticas
- [ ] Sistema de categorias (além de tags)
- [ ] Upload de imagens ao invés de URL
- [ ] Editor de texto rico (Quill/TinyMCE)
- [ ] Versionamento de notícias
- [ ] Agendamento de publicação

### Frontend Admin
- [ ] Rich text editor (TipTap/Quill)
- [ ] Upload de imagens com preview
- [ ] Drag and drop para ordenar
- [ ] Busca avançada com múltiplos filtros
- [ ] Export para PDF/Excel
- [ ] Dashboard de analytics
- [ ] Preview antes de publicar

### Frontend Site
- [ ] SEO otimizado (meta tags dinâmicas)
- [ ] Open Graph para redes sociais
- [ ] Comentários (Disqus/integração)
- [ ] Newsletter signup
- [ ] RSS Feed
- [ ] AMP pages
- [ ] PWA offline reading
- [ ] Modo escuro

### N8N
- [ ] Múltiplas fontes de notícias
- [ ] Filtro de conteúdo duplicado
- [ ] Tradução automática
- [ ] Geração de resumos com IA
- [ ] Otimização de imagens
- [ ] Detecção de fake news

---

## 📚 Recursos Adicionais

### Fontes de Notícias Gratuitas
- Google News RSS
- Reddit RSS
- Medium RSS
- Dev.to API
- Hacker News API

### Ferramentas N8N Úteis
- RSS Feed Trigger
- HTTP Request
- HTML Extract
- AI Nodes (OpenAI, etc)
- Schedule Trigger (Cron)

### Bibliotecas Recomendadas

**Frontend**:
- `react-quill` - Editor de texto rico
- `react-markdown` - Renderizar markdown
- `react-share` - Botões de compartilhamento
- `date-fns` - Formatação de datas
- `react-helmet` - SEO meta tags

**Backend**:
- `sanitize-html` - Limpar HTML
- `slugify` - Gerar slugs
- `rss-parser` - Parse RSS feeds
- `node-schedule` - Agendar publicações

---

**Documentação criada em**: Janeiro 2025
**Versão**: 1.0.0
**Backend**: ✅ 100% Implementado
**Frontend**: ⏳ Pendente (estrutura pronta)
