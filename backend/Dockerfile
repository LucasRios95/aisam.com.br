# ==================================
# STAGE 1: Dependencies
# ==================================
FROM node:20-alpine AS dependencies

# Instalar dependências necessárias para compilação
RUN apk add --no-cache python3 make g++ postgresql-client

WORKDIR /usr/app

# Copiar apenas package.json e package-lock.json
COPY package*.json ./

# Instalar todas as dependências primeiro (necessário para o build)
RUN npm install && npm cache clean --force

# Criar pasta para dependências de produção
RUN npm install --only=production --prefix ./prod_modules && \
    cp -R ./prod_modules/node_modules ./node_modules_prod && \
    rm -rf ./prod_modules

# ==================================
# STAGE 2: Development
# ==================================
FROM node:20-alpine AS development

WORKDIR /usr/app

# Copiar package.json
COPY package*.json ./

# Instalar todas as dependências (incluindo dev)
RUN npm install

# Expor porta para aplicação e debug
EXPOSE 3333 9229

# Comando será sobrescrito pelo docker-compose
CMD ["npm", "run", "dev"]

# ==================================
# STAGE 3: Build
# ==================================
FROM node:20-alpine AS build

# Instalar dependências necessárias para compilação
RUN apk add --no-cache python3 make g++

WORKDIR /usr/app

# Copiar package.json
COPY package*.json ./

# Instalar todas as dependências (incluindo dev)
RUN npm install

# Copiar código fonte
COPY . .

# Compilar TypeScript
RUN npm run build

# ==================================
# STAGE 4: Production
# ==================================
FROM node:20-alpine AS production

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Definir timezone e instalar postgresql-client para migrations
RUN apk add --no-cache tzdata postgresql-client
ENV TZ=America/Sao_Paulo

WORKDIR /usr/app

# Copiar dependências de produção do stage 1
COPY --from=dependencies --chown=nodejs:nodejs /usr/app/node_modules_prod ./node_modules

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
