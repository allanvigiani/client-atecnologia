import amqp from 'amqplib';

async function connectRabbitMQ() {
    try {
        const connection = await amqp.connect('amqp://guest:guest@localhost:15672/');
        const channel = await connection.createChannel();
        return channel;
    } catch (error) {
        console.error("Erro ao conectar ao RabbitMQ:", error);
        process.exit(1);
    }
}

export default connectRabbitMQ;