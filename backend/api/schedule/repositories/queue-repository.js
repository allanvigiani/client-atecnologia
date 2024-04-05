import connectRabbitMq from './queue-connection.js';

class QueueRepository {

    async sendToQueue(queue, message) {
        const channel = await connectRabbitMq();
        try {
            await channel.sendToQueue(queue, Buffer.from(message));
            console.log(" [x] Enviado '%s'", message);
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
        }
    }

}

export default QueueRepository;