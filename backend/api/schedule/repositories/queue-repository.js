import connectRabbitMQ from './queue-connection.js';

class QueueRepository {

    async sendToQueue(queue, message) {

        const channel = await connectRabbitMQ();
        try {
            const bufferMessage = Buffer.from(typeof message === 'object' ? JSON.stringify(message) : message);
            await channel.sendToQueue(queue, bufferMessage);
            console.log(" [x] Informações enviados: '%s'", message);
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
        }
    }
}

export default QueueRepository;