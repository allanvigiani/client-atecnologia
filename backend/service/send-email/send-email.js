import dotenv from 'dotenv';
dotenv.config(); // Carrega as variáveis de ambiente

import connectRabbitMq from './connections/queue-connection.js';
import ScheduleConfirmation from './database/schemas/SendEmail.js';
import nodemailer from 'nodemailer';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import SMTP_CONFIG from './config/smtp.js';
import express from 'express';

const app = express();

app.listen(process.env.PORT, () => {
    console.log(`Servidor está rodando na porta ${process.env.PORT}`);
});

const SMTP_TRANSPORTER = nodemailer.createTransport({
    host: SMTP_CONFIG.host,
    port: SMTP_CONFIG.port,
    secure: false,
    auth: {
        user: SMTP_CONFIG.user,
        pass: SMTP_CONFIG.password
    },
    tls: {
        rejectUnauthorized: false
    }
});

let channel; // Canal do RabbitMQ

// Estabelece a conexão com o RabbitMQ e configura o consumidor
async function setupRabbitMQAndConsume() {
    channel = await connectRabbitMq();
    consumeQueue('client/send_email', processEmailMessage);
}

async function processEmailMessage(msg) {
    try {
        const data = JSON.parse(msg.content.toString());

        // Destructure sua mensagem aqui
        const {
            company_name,
            company_email,
            company_address,
            client_name,
            client_email,
            service_id,
            service_name,
            service_hour,
            professional_name
        } = data;

        const service_code = uuidv4();

        let templateHtml = fs.readFileSync('./confirmation-template.html').toString();
        // Substituições no template
        templateHtml = templateHtml.replace(/{{client_name}}/g, client_name)
                                   .replace(/{{service_name}}/g, service_name)
                                   .replace(/{{service_hour}}/g, service_hour)
                                   .replace(/{{professional_name}}/g, professional_name)
                                   .replace(/{{company_address}}/g, company_address)
                                   .replace(/{{company_name}}/g, company_name)
                                   .replace(/{{company_email}}/g, company_email)
                                   .replace(/{{service_code}}/g, service_code);

        await SMTP_TRANSPORTER.sendMail({
            subject: "Confirmação de agendamento!",
            from: `${company_email}`,
            to: client_email,
            html: templateHtml
        });

        // Registrar no banco de dados após o envio do email
        await createEmailLog({
            service_code,
            email_status: "Enviado",
            client_name,
            client_email,
            service_id
        });

        console.log("Email enviado com sucesso!");
    } catch (error) {
        console.error('Erro ao enviar email:', error.message);
    }
}

async function createEmailLog(logs) {
    try {
        await ScheduleConfirmation.create(logs);
    } catch (error) {
        console.error('Erro ao criar log de email:', error.message);
    }
}

async function consumeQueue(queue, processMessageFunc) {
    console.log(`Aguardando por mensagens em ${queue}.`);
    channel.consume(queue, message => {
        if (message !== null) {
            console.log("Recebido:", message.content.toString());
            processMessageFunc(message);
            channel.ack(message);
        }
    });
}

setupRabbitMQAndConsume();
