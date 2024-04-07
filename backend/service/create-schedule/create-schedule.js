import connectRabbitMq from './connections/queue-connection.js';
import dotenv from 'dotenv';
import ScheduleRepository from './repositories/schedule-repository.js';

const scheduleRepository = new ScheduleRepository();

import express from 'express';

const app = express();

app.listen(process.env.PORT, () => {
    console.log(`Servidor está rodando na porta ${process.env.PORT}`);
});

dotenv.config();

async function createSchedule() {

    try {

        const channel = await connectRabbitMq();

        const data = consumeQueue('user/schedule_information');

        const { company_id, user_id, service_id, service_hour_id, service_day_id } = data;

        if (!company_id || !user_id || !service_id || !service_hour_id || !service_day_id) {
            return { message: `Faltando parâmetros do agendamento do serviço!`};
        }

        const result = await scheduleRepository.createSchedule(data);
        if (!result) {
            const errorMessage = `Erro ao agendar o serviço. Tente novamente mais tarde!`;
            return { message: errorMessage};
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
        };

        await channel.sendToQueue('client/send_email', Buffer.from(message));
        console.log(" [x] Enviado '%s'", message);

        return { message: `Serviço agendado com sucesso!`};
    } catch (error) {
        return { message: error.message, status: 500 };
    } finally {
        setTimeout(createSchedule, 2000);
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

createSchedule();