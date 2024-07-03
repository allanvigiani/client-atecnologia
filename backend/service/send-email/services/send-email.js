import ScheduleConfirmation from '../database/schemas/SendEmail.js';
import nodemailer from 'nodemailer';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import SMTP_CONFIG from '../config/smtp.js';

const SMTP_TRANSPORTER = nodemailer.createTransport({
    host: SMTP_CONFIG.host,
    port: SMTP_CONFIG.port,
    auth: {
        user: SMTP_CONFIG.user,
        pass: SMTP_CONFIG.password
    }
});

async function processEmailMessage(msg) {
    try {
        const data = JSON.parse(msg);

        const {
            company_name,
            company_email,
            company_address,
            client_name,
            client_email,
            service_id,
            service_name,
            professional_name,
            service_hour,
            service_day,
            date
        } = data;

        const service_code = uuidv4();

        let templateHtml = fs.readFileSync('./confirmation-template.html').toString();

        templateHtml = templateHtml.replace(/{{client_name}}/g, client_name)
                                   .replace(/{{service_name}}/g, service_name)
                                   .replace(/{{service_hour}}/g, service_hour)
                                   .replace(/{{professional_name}}/g, professional_name)
                                   .replace(/{{company_address}}/g, company_address)
                                   .replace(/{{company_name}}/g, company_name)
                                   .replace(/{{company_email}}/g, company_email)
                                   .replace(/{{service_code}}/g, service_code)
                                   .replace(/{{service_day}}/g, service_day)
                                   .replace(/{{date}}/g, date);

        await SMTP_TRANSPORTER.sendMail({
            subject: "Informações do agendamento!",
            from: company_email,
            to: client_email,
            html: templateHtml
        });

        await createEmailLog({
            service_code: service_code,
            email_status: "Enviado",
            client_name: client_name,
            client_email: client_email,
            service_id: service_id
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

export default processEmailMessage;
