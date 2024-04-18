import dotenv from 'dotenv';
dotenv.config();

import connectRabbitMq from './connections/queue-connection.js';
import ScheduleRepository from './repositories/schedule-repository.js';
import express from 'express';

const app = express();
const scheduleRepository = new ScheduleRepository();

// Estabelece a conexão com o RabbitMQ
let channel;
async function setupRabbitMQ() {
    channel = await connectRabbitMq();
    consumeQueue('user/schedule_information', createSchedule);
}
setupRabbitMQ();

app.listen(process.env.PORT, () => {
    console.log(`Servidor está rodando na porta ${process.env.PORT}`);
});

async function createSchedule(msg) {
    try {
                
        const data = JSON.parse(msg.content.toString());

        const { company_id, user_id, service_id, service_hour_id, service_day_id, date } = data;
        if (!company_id || !user_id || !service_id || !service_hour_id || !service_day_id || !date) {
            throw new Error('Faltando parâmetros do agendamento do serviço');
        }

        const result = await scheduleRepository.createSchedule(data);
        if (!result) {
            throw new Error('Erro ao agendar o serviço. Tente novamente mais tarde');
        }

        const company = await scheduleRepository.getCompany(company_id);
        const user = await scheduleRepository.getUser(user_id);
        const service = await scheduleRepository.getService(service_id);
        const hour = await scheduleRepository.getHourName(service_hour_id);
        const day = await scheduleRepository.getDayName(service_day_id);

        const message = {
            company_name: company.name,
            company_email: company.email,
            company_address: company.address,
            client_name: user.name,
            client_email: user.email,
            service_id: service_id,
            service_name: service.name,
            professional_name: service.professional_name,
            service_hour: hour.start_time,
            service_day: day.description,
            date: date
        };

        await channel.sendToQueue('client/send_email', Buffer.from(message));
        console.log(" [x] Enviado '%s'", message);

    } catch (error) {
        console.error("Erro:", error.message);
        throw error; // Lança o erro para ser capturado na função consumeQueue
    }
}

async function consumeQueue(queue, processMessage) {
    console.log(`Aguardando por mensagens em ${queue}.`);
    channel.consume(queue, async (message) => {
        try {
            if (message === null) {
                console.log("Mensagem recebida nula, pulando...");
                return;
            }
            await processMessage(message);
            channel.ack(message);
        } catch (error) {
            console.error("Erro ao processar mensagem:", error.message);
            channel.nack(message, false, false); // Rejeita a mensagem sem reenfileirar
        }
    });
}
