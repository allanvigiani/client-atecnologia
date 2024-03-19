import connectRabbitMq from './queue-connection.js';

class QueueRepository {

    async consumeQueue(queue) {
        const channel = await connectRabbitMq();
        console.log(" [*] Aguardando por mensagens em %s.", queue);
        channel.consume(queue, message => {
            if (message !== null) {
                console.log(" [x] Recebido '%s'", message.content.toString());
                channel.ack(message);
            }
        });
    }

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