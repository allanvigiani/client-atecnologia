import connectRabbitMq from './connections/queue-connection.js';
import dotenv from 'dotenv';
import ScheduleRepository from './repositories/schedule-repository.js';

dotenv.config();

async function createSchedule() {

    try {

        const scheduleRepository = new ScheduleRepository();
        const channel = await connectRabbitMq();

        const data = consumeQueue('user/schedule_information');
        
        const { company_id, user_id, service_id, service_hour_id, service_day_id, created_at } = data;

        const result = await scheduleRepository.createSchedule(data);
        if (!result) {
            const errorMessage = `Erro ao agendar o serviço. Tente novamente mais tarde!`;
            return { message: errorMessage, status: 500 };
        }

        // Puxar essas informações
        
        // company_id -> buscar company_name, company_email, company_address
        // user_id -> buscar user_name, user_email
        // service_id -> buscar service_name, service_hour_id, service_day_id, professional_name

        const message = {
            company_name,
            company_email,
            company_address,
            client_name,
            client_email,
            service_id,
            service_name,
            service_hour,
            professional_name
        };

        await channel.sendToQueue('client/send_email', Buffer.from(message));
        console.log(" [x] Enviado '%s'", message);

        return { message: `Serviço agendado com sucesso!`, status: 201 };
    } catch (error) {
        return { message: error.message, status: 500 };
    } finally {

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