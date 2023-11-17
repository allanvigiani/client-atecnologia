import database from './connection.js';
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

    async verifyRevogedToken(token) {
        try {
            const conn = await database.generateConnection();
            const result = await conn.query(`
            SELECT us.id, us.start_login, us.end_login, us.token FROM company_sessions us 
                WHERE us.end_login IS NOT NULL AND us.token = $1;
        `, [token]);

            return result.rows;
        } catch (error) {
            throw new Error(error);
        }
    }

}

export default ScheduleConfirmationRepository;