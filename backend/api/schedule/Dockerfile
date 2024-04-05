# Use uma imagem do Node.js como base
FROM node:16

# Crie e defina o diretório de trabalho
WORKDIR /app/backend/api/user-schedule

# Copie os arquivos de dependência e o código fonte
COPY package*.json ./
RUN npm install
COPY . .

# Exponha a porta do servidor
EXPOSE 3007

# Comando para iniciar o servidor
CMD ["npm", "start"]