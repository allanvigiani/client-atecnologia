FROM node:16

WORKDIR /app/frontend

COPY package*.json ./

RUN npm install
COPY . .

EXPOSE 4000

CMD ["npm", "run", "dev"]
