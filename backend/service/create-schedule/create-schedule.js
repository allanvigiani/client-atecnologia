import dotenv from 'dotenv';
dotenv.config();

import connectRabbitMq from './connections/queue-connection.js';
import QueueRepository from './repositories/queue-repository.js';
import ScheduleRepository from './repositories/schedule-repository.js';
import ScheduleStatusRepository from './repositories/schedule-status-repository.js';
import express from 'express';

const app = express();
const scheduleRepository = new ScheduleRepository();
const scheduleStatusRepository = new ScheduleStatusRepository();
const queueRepository = new QueueRepository();

async function setupRabbitMQ() {
    setInterval(async () => {
        console.log(` [*] Lendo mensagens na fila user/schedule_information.`);
        await consumeQueue('user/schedule_information', createSchedule);
    }, 10000);
}
setupRabbitMQ();

app.listen(process.env.PORT, () => {
    console.log(`Servidor está rodando na porta ${process.env.PORT}`);
});

async function createSchedule(message) {
    try {
        const msg = JSON.parse(message);

        const { company_id, user_id, service_id, service_hour_id, service_day_id, date } = msg;
        if (!company_id || !user_id || !service_id || !service_hour_id || !service_day_id || !date) {
            throw new Error('Faltando parâmetros do agendamento do serviço');
        }

        const result = await scheduleRepository.createSchedule(msg);
        if (!result) {
            throw new Error('Erro ao agendar o serviço. Tente novamente mais tarde');
        }

        const company = await scheduleRepository.getCompany(company_id);
        const user = await scheduleRepository.getUser(user_id);
        const service = await scheduleRepository.getService(service_id);
        const hour = await scheduleRepository.getHourName(service_hour_id);
        const day = await scheduleRepository.getDayName(service_day_id);

        const messageToSend = {
            company_name: company.name,
            company_email: company.email,
            company_address: company.address,
            client_name: user.name,
            client_email: user.email,
            service_id,
            service_name: service.name,
            professional_name: service.professional_name,
            service_hour: hour.start_time,
            service_day: day.description,
            date
        };

        const statusData = {
            id: result.id,
        };

        // const resultStatus = await scheduleStatusRepository.createScheduleStatus(statusData);
        // if (!resultStatus) {
        //     throw new Error('Erro ao criar o status do agendamento. Tente novamente mais tarde');
        // }

        const bufferMessage = JSON.stringify(messageToSend);
        await queueRepository.sendToQueue('client/send_email', bufferMessage);
        console.log(" [x] Enviado para a fila client/send_email -> '%s'", JSON.stringify(messageToSend));

    } catch (error) {
        console.error("Erro:", error.message);
        throw error; // Lança o erro para ser capturado na função consumeQueue
    }
}

async function consumeQueue(queue) {

    const channel = await connectRabbitMq();
    try {
        await channel.consume(queue, message => {
            if (message !== null) {
                console.log(" [x] Recebido '%s'", message.content.toString());
                channel.ack(message);
                createSchedule(message.content.toString());
            }
        }, { noAck: false });
    } catch (error) {
        console.error("Erro ao consumir mensagem:", error);
        if (message) {
            channel.nack(message, false, false);
        }
        throw error;
    } finally {
        // await channel.close();
    }
}
