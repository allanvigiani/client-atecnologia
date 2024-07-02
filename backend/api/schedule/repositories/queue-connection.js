import amqp from 'amqplib';

async function connectRabbitMq() {
    if (channel && connection) {
        return channel;
    }
    try {
        connection = await amqp.connect('amqp://localhost');
        channel = await connection.createChannel();
        await channel.confirmSelect();
        return channel;
    } catch (error) {
        console.error('Erro ao conectar com RabbitMQ:', error);
        throw error;  // Propague o erro para garantir que falhas de conexão sejam tratadas.
    }
}

export default connectRabbitMq;