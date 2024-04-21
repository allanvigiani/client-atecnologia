import dotenv from 'dotenv';
dotenv.config();

import connectRabbitMq from './connections/queue-connection.js';
import StatusRepository from './repositories/status-repository.js';
import express from 'express';

const app = express();
const scheduleStatusRepository = new StatusRepository();

// Estabelece a conexão com o RabbitMQ
let channel;
async function setupRabbitMQ() {
    channel = await connectRabbitMq();
    consumeQueue('user/schedule_information', updateSchedule); /** ver isso com o allan */
}
setupRabbitMQ();

app.listen(process.env.PORT, () => {
    console.log(`Servidor está rodando na porta ${process.env.PORT}`);
});

async function updateSchedule(msg) {
    try {

        const data = JSON.parse(msg.content.toString());

        const { id } = data;
        if (!id) {
            throw new Error('Faltando parâmetros do agendamento do serviço');
        }

        const result = await scheduleStatusRepository.updateScheduleStatus(data);
        if (!result) {
            throw new Error('Erro ao agendar o serviço. Tente novamente mais tarde');
        }

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
