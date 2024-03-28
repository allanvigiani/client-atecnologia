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

}

export default QueueRepository;