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

    async consumeQueue(queue, callback) {
        const channel = await connectRabbitMq();
        try {
            await channel.assertQueue(queue, { durable: true });
            console.log(" [*] Aguardando mensagens em '%s'. Para sair pressione CTRL+C", queue);
            channel.consume(queue, message => {
                if (message !== null) {
                    console.log(" [x] Recebido '%s'", message.content.toString());
                    callback(message.content.toString());
                    channel.ack(message);
                }
            }, { noAck: false });
        } catch (error) {
            console.error("Erro ao consumir mensagens:", error);
        }
    }

}

export default QueueRepository;