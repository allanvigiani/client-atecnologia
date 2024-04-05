import amqp from 'amqplib';

async function connectRabbitMQ() {
    try {
        const connection = await amqp.connect('amqp://user:password@localhost');
        const channel = await connection.createChannel();
        return channel;
    } catch (error) {
        console.error("Erro ao conectar ao RabbitMQ:", error);
        process.exit(1);
    }
}

export default connectRabbitMQ();