import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

import SMTP_CONFIG from '../config/smtp.js';

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

/**
 * Classe responsável pelo envio de email
 * @date 05/03/2024 - 23:16:45
 *
 * @class ScheduleConfirmationController
 * @typedef {ScheduleConfirmationController}
 */
class ScheduleConfirmationController {

    constructor(scheduleConfirmationRepository) {
        this.scheduleConfirmationRepository = scheduleConfirmationRepository;
    }

    /**
     * Método responsável por enviar o email
     * @date 05/03/2024 - 23:17:01
     *
     * @async
     * @param {*} body
     * @returns {unknown}
     */
    async sendEmail(body) {
        try {
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
            } = body;

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

                this.scheduleConfirmationRepository.createEmailLog(logs);
            }

            return { message: `Email enviado com sucesso!`, status: 200 };

        } catch (error) {
            return { message: error.message, status: 500 };
        }
    }

}

export default ScheduleConfirmationController;