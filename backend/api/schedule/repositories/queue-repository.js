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

    async consumeFromQueue(queue) {
        const channel = await connectRabbitMq();
        try {
            await channel.consume(queue, message => {
                if (message !== null) {
                    console.log(" [x] Recebido '%s'", message.content.toString());
                    channel.ack(message);
                    return message.content.toString();
                }
            });
            console.log(` [*] Aguardando mensagens em ${queue}. Para sair pressione CTRL+C`);
        } catch (error) {
            console.error("Erro ao consumir mensagem:", error);
            throw error;
        }
    }
}

export default QueueRepository;