# ==================================
# STAGE 1: Dependencies
# ==================================
FROM node:20-alpine AS dependencies

# Instalar dependências necessárias para compilação
RUN apk add --no-cache python3 make g++

WORKDIR /usr/app

# Copiar apenas package.json e package-lock.json
COPY package*.json ./

# Instalar apenas dependências de produção
RUN npm ci --only=production && npm cache clean --force

# ==================================
# STAGE 2: Build
# ==================================
FROM node:20-alpine AS build

WORKDIR /usr/app

# Copiar package.json
COPY package*.json ./

# Instalar todas as dependências (incluindo dev)
RUN npm ci

# Copiar código fonte
COPY . .

# Compilar TypeScript
RUN npm run build

# ==================================
# STAGE 3: Production
# ==================================
FROM node:20-alpine AS production

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Definir timezone
RUN apk add --no-cache tzdata
ENV TZ=America/Sao_Paulo

WORKDIR /usr/app

# Copiar dependências de produção do stage 1
COPY --from=dependencies --chown=nodejs:nodejs /usr/app/node_modules ./node_modules

# Copiar código compilado do stage 2
COPY --from=build --chown=nodejs:nodejs /usr/app/dist ./dist

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

# Comando para iniciar aplicação
CMD ["node", "dist/shared/infra/http/server.js"]
