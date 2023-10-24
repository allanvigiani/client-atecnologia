// import connectToMongoDB from './mongo-connection.js';
import ScheduleConfirmation from '../database/schemas/ScheduleConfirmation.js';

class ScheduleConfirmationRepository {

    async createEmailLog(logs) {
        try {
            const log = ScheduleConfirmation.create(logs);
            return log;
        } catch (error) {
            throw new Error(error);
        }
    }

}

export default ScheduleConfirmationRepository;