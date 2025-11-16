# Ambiente de Produção Local com PM2

Este guia descreve como executar o sistema AISAM em um ambiente de produção local usando PM2 para simular o comportamento de produção antes do deploy.

---

## Índice

1. [Visão Geral](#visão-geral)
2. [Pré-requisitos](#pré-requisitos)
3. [Configuração Inicial](#configuração-inicial)
4. [Build e Deploy](#build-e-deploy)
5. [Gerenciamento com PM2](#gerenciamento-com-pm2)
6. [Testes e Validação](#testes-e-validação)
7. [Monitoramento](#monitoramento)
8. [Troubleshooting](#troubleshooting)

---

## Visão Geral

### Arquitetura do Ambiente Local

```
┌─────────────────────────────────────────────────────────┐
│                    PM2 Process Manager                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────┐     ┌──────────────────────────┐ │
│  │  Backend API     │     │  Frontend Server         │ │
│  │  (Node/Express)  │     │  (Express Static)        │ │
│  │  Port: 3333      │     │  Port: 8080              │ │
│  │                  │     │                          │ │
│  │  - REST API      │     │  - Frontend (/)          │ │
│  │  - TypeORM       │     │  - Frontend-app (/vagas) │ │
│  │  - PostgreSQL    │     │  - Proxy /api → Backend  │ │
│  └──────────────────┘     └──────────────────────────┘ │
│                                                          │
└─────────────────────────────────────────────────────────┘
                       │
                       ▼
            ┌───────────────────┐
            │   PostgreSQL DB   │
            │   Port: 5432      │
            │                   │
            │  - database_aisam │
            └───────────────────┘
```

### URLs em Produção Local

- **Frontend Institucional**: http://localhost:8080
- **Frontend Admin/Recrutador**: http://localhost:8080/vagas
- **API Backend**: http://localhost:3333
- **API Proxy** (opcional): http://localhost:8080/api

---

## Pré-requisitos

### Software Necessário

```bash
# Node.js 18+ e npm
node --version  # v18 ou superior
npm --version

# PostgreSQL
psql --version  # 12+ recomendado

# PM2 (será instalado automaticamente)
```

### Banco de Dados

Certifique-se de que o PostgreSQL está rodando:

```bash
# Windows
# Abra o "Services" e verifique se "PostgreSQL" está ativo

# Linux/Mac
sudo systemctl status postgresql

# Criar banco de dados
psql -U postgres
CREATE DATABASE database_aisam;
\q
```

---

## Configuração Inicial

### 1. Instalar Dependências

```bash
# Na raiz do projeto
npm run install:all
```

Este comando instalará as dependências de:
- Raiz (PM2 e frontend-server)
- Backend
- Frontend
- Frontend-app

### 2. Configurar Variáveis de Ambiente

#### Backend (`.env.production`)

Edite o arquivo `backend/.env.production`:

```bash
# Banco de dados
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=sua_senha
DB_NAME_COMMON=database_aisam
DB_NAME_VAGAS=database_aisam
DB_NAME_NOTICIAS=database_aisam

# JWT (IMPORTANTE: Gerar chave forte)
JWT_SECRET=sua_chave_secreta_forte_minimo_32_caracteres

# SMTP (configure com suas credenciais reais)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=noreply@aisam.com.br
SMTP_PASS=sua_senha_email
SMTP_FROM_NAME=AISAM
SMTP_FROM_EMAIL=noreply@aisam.com.br

# CORS
FRONTEND_URL=http://localhost:8080
FRONTEND_APP_URL=http://localhost:8080

# API
API_URL=http://localhost:3333
```

**Gerar JWT_SECRET forte:**

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### Frontends

Os arquivos `.env.production` já foram criados para:
- `frontend/.env.production`
- `frontend-app/.env.production`

**Não é necessário alterá-los** para testes locais.

### 3. Configurar Banco de Dados

```bash
cd backend

# Rodar migrations
npm run migration:run:all

# Criar admin padrão
npm run seed:admin

# Criar áreas de atuação
npm run seed:areas

# (Opcional) Criar associados de teste
npm run seed:associados
```

---

## Build e Deploy

### Build Completo

```bash
# Na raiz do projeto
npm run build:all
```

Este comando executa:
1. `build:backend` - Compila TypeScript → JavaScript (pasta `backend/dist/`)
2. `build:frontend` - Build otimizado do Vite (pasta `frontend/dist/`)
3. `build:frontend-app` - Build otimizado do Vite (pasta `frontend-app/dist/`)

### Instalar PM2 Globalmente (Opcional mas Recomendado)

```bash
npm install -g pm2
```

### Iniciar em Produção

```bash
# Na raiz do projeto
npm run start:prod
```

Ou diretamente com PM2:

```bash
pm2 start ecosystem.config.js --env production
```

---

## Gerenciamento com PM2

### Comandos Principais

```bash
# Status dos processos
npm run status
# ou
pm2 status

# Ver logs em tempo real
npm run logs
# ou
pm2 logs

# Ver logs apenas do backend
npm run logs:backend
# ou
pm2 logs aisam-backend

# Ver logs apenas do frontend-server
npm run logs:frontend
# ou
pm2 logs aisam-frontend-server

# Monitoramento em tempo real (CPU, memória)
npm run monit
# ou
pm2 monit

# Reiniciar aplicação
npm run restart:prod
# ou
pm2 restart ecosystem.config.js

# Parar aplicação
npm run stop:prod
# ou
pm2 stop ecosystem.config.js

# Remover processos do PM2
npm run delete:prod
# ou
pm2 delete ecosystem.config.js

# Salvar configuração do PM2 (auto-start no boot)
pm2 save
pm2 startup
```

### Informações dos Processos

**Backend (aisam-backend)**
- Script: `backend/dist/shared/infra/http/server.js`
- Porta: 3333
- Modo: Cluster (1 instância)
- Auto-restart: Sim
- Max memory: 500MB
- Logs: `logs/backend-*.log`

**Frontend Server (aisam-frontend-server)**
- Script: `frontend-server/server.js`
- Porta: 8080
- Modo: Cluster (1 instância)
- Auto-restart: Sim
- Max memory: 200MB
- Logs: `logs/frontend-server-*.log`

---

## Testes e Validação

### 1. Verificar Processos

```bash
pm2 status
```

Você deve ver:

```
┌─────┬─────────────────────────┬─────────┬─────────┬──────────┐
│ id  │ name                    │ status  │ cpu     │ memory   │
├─────┼─────────────────────────┼─────────┼─────────┼──────────┤
│ 0   │ aisam-backend           │ online  │ 0%      │ 150 MB   │
│ 1   │ aisam-frontend-server   │ online  │ 0%      │ 50 MB    │
└─────┴─────────────────────────┴─────────┴─────────┴──────────┘
```

### 2. Testar Backend API

```bash
# Health check
curl http://localhost:3333/

# Listar áreas de atuação
curl http://localhost:3333/areas-atuacao

# Testar login admin
curl -X POST http://localhost:3333/auth/admin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@aisam.com.br","senha":"Admin@123"}'
```

### 3. Testar Frontends

**Frontend Institucional:**
1. Abra http://localhost:8080
2. Navegue pelas páginas (Home, Sobre, Vagas, Notícias)
3. Verifique se as vagas são carregadas
4. Verifique se as notícias são carregadas

**Frontend Admin:**
1. Abra http://localhost:8080/vagas
2. Faça login:
   - Email: `admin@aisam.com.br`
   - Senha: `Admin@123`
3. Teste as funcionalidades:
   - Dashboard
   - Criar/Editar vagas
   - Criar/Editar notícias
   - Gerenciar candidaturas

### 4. Verificar Console do Navegador

Abra as DevTools (F12) e verifique:
- ✅ Sem erros de CORS
- ✅ Requisições à API retornam 200 OK
- ✅ Assets (JS, CSS, imagens) carregam corretamente

---

## Monitoramento

### Logs em Tempo Real

```bash
# Todos os logs
pm2 logs

# Apenas backend
pm2 logs aisam-backend

# Apenas frontend-server
pm2 logs aisam-frontend-server

# Últimas 100 linhas
pm2 logs --lines 100

# Seguir logs (tail -f)
pm2 logs --follow
```

### Métricas e Monitoramento

```bash
# Modo monitoramento interativo
pm2 monit

# Informações detalhadas
pm2 show aisam-backend
pm2 show aisam-frontend-server

# Estatísticas
pm2 info aisam-backend
```

### Logs Persistidos

Os logs são salvos em:
- `logs/backend-error.log` - Erros do backend
- `logs/backend-out.log` - Output do backend
- `logs/frontend-server-error.log` - Erros do frontend-server
- `logs/frontend-server-out.log` - Output do frontend-server

```bash
# Ver logs salvos
tail -f logs/backend-out.log
tail -f logs/frontend-server-out.log

# Limpar logs antigos (cuidado!)
pm2 flush
```

---

## Troubleshooting

### Problema: Processos não iniciam

**Sintoma**: `pm2 status` mostra processos como "errored" ou "stopped"

**Solução**:

```bash
# Ver logs de erro
pm2 logs --err

# Verificar se o build foi feito
ls -la backend/dist/
ls -la frontend/dist/
ls -la frontend-app/dist/

# Refazer build
npm run build:all

# Reiniciar
pm2 restart all
```

### Problema: Backend não conecta ao banco

**Sintoma**: Erro "Connection refused" ou "Authentication failed"

**Solução**:

1. Verifique se PostgreSQL está rodando
2. Verifique credenciais em `backend/.env.production`
3. Teste conexão manual:

```bash
psql -U postgres -d database_aisam -h localhost -p 5432
```

### Problema: Frontend não carrega

**Sintoma**: Página em branco ou erro 404

**Solução**:

1. Verifique se o build foi feito:
   ```bash
   ls frontend/dist/index.html
   ls frontend-app/dist/index.html
   ```

2. Verifique logs do frontend-server:
   ```bash
   pm2 logs aisam-frontend-server
   ```

3. Refaça o build:
   ```bash
   npm run build:frontend
   npm run build:frontend-app
   pm2 restart aisam-frontend-server
   ```

### Problema: CORS Error

**Sintoma**: Erro no console do navegador: "CORS policy blocked"

**Solução**:

1. Verifique variáveis de ambiente do backend:
   ```bash
   FRONTEND_URL=http://localhost:8080
   FRONTEND_APP_URL=http://localhost:8080
   ```

2. Reinicie o backend:
   ```bash
   pm2 restart aisam-backend
   ```

### Problema: Porta já em uso

**Sintoma**: "EADDRINUSE: address already in use :::3333" ou ":::8080"

**Solução**:

```bash
# Windows - Encontrar processo usando a porta
netstat -ano | findstr :3333
netstat -ano | findstr :8080

# Matar processo (substituir PID)
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3333 | xargs kill -9
lsof -ti:8080 | xargs kill -9

# Ou pare o PM2 primeiro
pm2 stop all
pm2 delete all
```

### Problema: Memória alta

**Sintoma**: PM2 reinicia processos por excesso de memória

**Solução**:

1. Verifique uso de memória:
   ```bash
   pm2 monit
   ```

2. Ajuste limites no `ecosystem.config.js`:
   ```javascript
   max_memory_restart: '500M',  // Backend
   max_memory_restart: '200M',  // Frontend-server
   ```

3. Reinicie:
   ```bash
   pm2 restart all
   ```

---

## Diferenças entre Desenvolvimento e Produção Local

| Aspecto | Desenvolvimento | Produção Local |
|---------|----------------|----------------|
| **Hot Reload** | ✅ Sim (Vite HMR) | ❌ Não |
| **Source Maps** | ✅ Detalhados | ⚠️ Limitados |
| **Minificação** | ❌ Não | ✅ Sim |
| **Process Manager** | ts-node-dev | PM2 |
| **Número de Processos** | 3 (backend + 2 frontends) | 2 (backend + frontend-server) |
| **Auto-restart** | ⚠️ Apenas em alterações | ✅ Sempre (em crashes) |
| **Logs** | Console | Arquivos + Console |
| **Build** | On-demand (Vite) | Pre-build (otimizado) |
| **Performance** | Normal | Otimizada |

---

## Próximos Passos

Após validar o ambiente de produção local:

1. ✅ Certifique-se de que todas as funcionalidades funcionam
2. ✅ Teste performance sob carga (use ferramentas como Apache Bench)
3. ✅ Valide todos os fluxos de usuário
4. ✅ Configure variáveis de ambiente para produção real
5. ✅ Siga o guia `GUIA_DEPLOY_KINGHOST_RAILWAY.md` para deploy em produção

---

## Comandos Rápidos

```bash
# Setup inicial
npm run install:all
cd backend && npm run migration:run:all && npm run seed:admin && npm run seed:areas && cd ..

# Build e deploy
npm run build:all
npm run start:prod

# Status e monitoramento
pm2 status
pm2 logs
pm2 monit

# Restart após alterações
npm run build:all
pm2 restart all

# Parar tudo
pm2 stop all
pm2 delete all
```

---

## Recursos Adicionais

- **PM2 Docs**: https://pm2.keymetrics.io/docs/usage/quick-start/
- **Express.js**: https://expressjs.com/
- **PostgreSQL**: https://www.postgresql.org/docs/

---

**Última atualização**: Novembro 2024
**Versão**: 1.0
