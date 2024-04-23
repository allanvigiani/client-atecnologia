import database from '../connections/connection.js';

class ScheduleStatusRepository {

    async createScheduleStatus(data) {
        let client;
        try {
            const { schedule_id } = data;

            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`
                INSERT INTO schedule_status (schedule_id, status_id)
                VALUES ($1, $2) RETURNING id;
            `, [schedule_id, 1]);
            client.release();
            return result.rows[0];
        } catch (error) {
            if (client) {
                client.release();
            }
            throw new Error(error);
        }
    }

}

export default ScheduleStatusRepository;