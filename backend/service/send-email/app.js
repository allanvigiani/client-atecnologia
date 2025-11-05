import dotenv from 'dotenv';
dotenv.config(); // Carrega as variáveis de ambiente
import express from 'express';
import setupRabbitMQ from './services/rabbitmq-service.js';

const app = express();

app.listen(process.env.PORT, () => {
    console.log(`Servidor está rodando na porta ${process.env.PORT}`);
});

setupRabbitMQ();
