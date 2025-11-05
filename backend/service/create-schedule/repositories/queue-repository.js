import connectRabbitMq from '../connections/queue-connection.js';

class QueueRepository {

    async sendToQueue(queue, message) {
        const { connection, channel } = await connectRabbitMq();
        try {
            const bufferMessage = Buffer.from(JSON.stringify(message));
            await channel.sendToQueue(queue, bufferMessage);
            console.log(" [x] Enviado '%s'", message);
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
        } finally {
            await channel.close();
            await connection.close();
        }
    }

    async consumeFromQueue(queue, callback) {
        const { connection, channel } = await connectRabbitMq();
        try {
            await channel.consume(queue, async message => {
                if (message !== null) {
                    console.log(" [x] Recebido '%s'", message.content.toString());
                    channel.ack(message);
                    await callback(message.content.toString());
                }
            }, { noAck: false });
        } catch (error) {
            console.error("Erro ao consumir mensagem:", error);
            throw error;
        } finally {
            await channel.close();
            await connection.close();
        }
    }
}

export default QueueRepository;
