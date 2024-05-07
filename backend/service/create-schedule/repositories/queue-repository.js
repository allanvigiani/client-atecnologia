import connectRabbitMq from '../connections/queue-connection.js';

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

    async consumeFromQueue(queue) {
        const channel = await connectRabbitMq();
        try {
            await channel.consume(queue, message => {
                if (message !== null) {
                    console.log(" [x] Recebido '%s'", message.content.toString());
                    channel.ack(message);
                }
                console.log(message.content.toString());
                return message.content.toString();

            }, { noAck: false });
        } catch (error) {
            console.error("Erro ao consumir mensagem:", error);
            if (message) {
                channel.nack(message, false, false);
            }
            throw error;
        } finally {
            await channel.close();
        }
    }

}

export default QueueRepository;