# Stage 1: Build
FROM node:22-alpine AS build

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de configuração e instalar dependências
COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.js ./prisma.config.js

# Instalar dependências do projeto
RUN npm ci

# Gerar Prisma Client
ENV DATABASE_URL="postgresql://fake:fake@fake:5432/fake"
RUN npx prisma generate

# Copiar código-fonte
COPY . .

# Construir a aplicação
RUN npm run build

# Stage 2: Production
FROM node:22-alpine AS production

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de configuração e dependências do build
COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.js ./prisma.config.js

# Instalar apenas dependências de produção
RUN npm ci --only=production

# Copiar arquivos construídos e dependências do estágio de build
COPY --from=build /app/dist ./dist

# Expor a porta
EXPOSE $PORT

# Definir variável de ambiente para produção
ENV NODE_ENV=production

# Comando para iniciar a aplicação
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma generate && node dist/main.js"]