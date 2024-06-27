import QueueRepository from '../repositories/queue-repository.js';
import processEmailMessage from './send-email.js';

const queueRepository = new QueueRepository();

async function setupRabbitMQ() {
    setInterval(async () => {
        console.log(`[*] Lendo mensagens na fila client/send_email.`);
        await queueRepository.consumeFromQueue('client/send_email', processEmailMessage);
    }, 12000);
}

export default setupRabbitMQ;
