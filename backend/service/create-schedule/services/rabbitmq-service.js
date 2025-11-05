import QueueRepository from '../repositories/queue-repository.js';
import createSchedule from './create-schedule.js';

const queueRepository = new QueueRepository();

async function setupRabbitMQ() {
    setInterval(async () => {
        console.log(`[*] Lendo mensagens na fila user/schedule_information.`);
        await queueRepository.consumeFromQueue('user/schedule_information', createSchedule);
    }, 10000);
}

export default setupRabbitMQ;
