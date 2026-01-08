# ==================================
# STAGE 1: Build
# ==================================
FROM node:20-alpine AS build

# Instalar dependências necessárias para compilação
RUN apk add --no-cache python3 make g++ postgresql-client

WORKDIR /usr/app

# Copiar package files
COPY package*.json ./

# Instalar todas as dependências
RUN npm install --legacy-peer-deps

# Copiar código fonte
COPY . .

# Compilar TypeScript
RUN npm run build

# ==================================
# STAGE 2: Production Dependencies
# ==================================
FROM node:20-alpine AS prod-deps

# Instalar dependências necessárias
RUN apk add --no-cache python3 make g++

WORKDIR /usr/app

# Copiar package files
COPY package*.json ./

# Instalar apenas dependências de produção
RUN npm install --only=production --legacy-peer-deps && \
    npm cache clean --force

# ==================================
# STAGE 3: Production
# ==================================
FROM node:20-alpine AS production

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Definir timezone e instalar postgresql-client para migrations
RUN apk add --no-cache tzdata postgresql-client
ENV TZ=America/Sao_Paulo

WORKDIR /usr/app

# Copiar dependências de produção
COPY --from=prod-deps --chown=nodejs:nodejs /usr/app/node_modules ./node_modules

# Copiar código compilado do stage build
COPY --from=build --chown=nodejs:nodejs /usr/app/dist ./dist

# Copiar scripts necessários (railway-migrate.js)
COPY --chown=nodejs:nodejs scripts ./scripts

# Copiar package.json para ter acesso ao version
COPY --chown=nodejs:nodejs package.json ./

# Criar diretórios necessários
RUN mkdir -p tmp/uploads logs && \
    chown -R nodejs:nodejs tmp logs

# Mudar para usuário não-root
USER nodejs

# Expor porta
EXPOSE 3333

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3333/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando para iniciar aplicação (com setup de schemas)
CMD ["sh", "-c", "node scripts/railway-migrate.js && node dist/shared/infra/http/server.js"]
