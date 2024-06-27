import connectRabbitMq from '../connections/queue-connection.js';

class QueueRepository {

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
