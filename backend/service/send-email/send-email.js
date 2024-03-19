import connectRabbitMq from './connections/queue-connection.js';
import ScheduleConfirmation from './database/schemas/SendEmail.js';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import SMTP_CONFIG from './config/smtp.js';

dotenv.config();

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

async function sendEMail() {
    try {
        const data = consumeQueue('client/send_email');

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

        templateHtml = templateHtml.replace('{{client_name}}', client_name);
        templateHtml = templateHtml.replace('{{service_name}}', service_name);
        templateHtml = templateHtml.replace('{{service_hour}}', service_hour);
        templateHtml = templateHtml.replace('{{professional_name}}', professional_name);
        templateHtml = templateHtml.replace('{{company_address}}', company_address);
        templateHtml = templateHtml.replace('{{company_name}}', company_name);
        templateHtml = templateHtml.replace('{{company_email}}', company_email);
        templateHtml = templateHtml.replace('{{service_code}}', service_code);

        const sendEmail = await SMTP_TRANSPORTER.sendMail({
            subject: "Confirmação de agendamento!",
            from: `${company_email}`,
            to: client_email,
            html: templateHtml
        });

        if (sendEmail) {

            const logs = {
                service_code: service_code,
                email_status: "Enviado",
                client_name: client_name,
                client_email: client_email,
                service_id: service_id
            }

             createEmailLog(logs);
        }

    } catch (error) {
        console.log('Erro ao enviar email -> ', error.message);
        throw new Error(error);
    } finally {
        setTimeout(sendEMail, 60000);
    }
}

async function createEmailLog(logs) {
    try {
        const log = ScheduleConfirmation.create(logs);
        return log;
    } catch (error) {
        throw new Error(error);
    }
}

async function consumeQueue(queue) {
    const channel = await connectRabbitMq();
    console.log(" [*] Aguardando por mensagens em %s.", queue);
    channel.consume(queue, message => {
        if (message !== null) {
            console.log(" [x] Recebido '%s'", message.content.toString());
            const msg = message.content;
            channel.ack(message);
            return msg;
            // TODO mudar isso depois, aqui antes de validar e enviar o email eu apago do rabbitMQ, está ERRADO
            // .ack e .nack
        }
    });
}

sendEMail();