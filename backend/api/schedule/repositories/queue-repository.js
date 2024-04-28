import connectRabbitMq from './queue-connection.js';

class QueueRepository {

    async sendToQueue(queue, message) {

        const channel = await connectRabbitMq();
        try {
            const bufferMessage = Buffer.from(typeof message === 'object' ? JSON.stringify(message) : message);
            await channel.sendToQueue(queue, bufferMessage);
            console.log(" [x] Enviado '%s'", message);
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
        }
    }

}

export default QueueRepository;