# ESTÁGIO 1: Construção (Build) do projeto usando o Node 20
FROM node:20-alpine AS build

# Define a pasta de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos de dependências primeiro (otimiza o cache do Docker)
COPY package*.json ./

# Instala todas as dependências
RUN npm install

# Copia todo o resto do código fonte para dentro do contêiner
COPY . .

# Roda o comando do Vite que gera a pasta "dist" com o código final otimizado
RUN npm run build

# ESTÁGIO 2: Servidor Web (Nginx) para rodar o site
FROM nginx:alpine

# Copia os arquivos gerados no Estágio 1 para a pasta pública do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# A porta padrão que o Nginx usa para servir sites
EXPOSE 80

# Comando para manter o Nginx rodando em primeiro plano
CMD ["nginx", "-g", "daemon off;"]