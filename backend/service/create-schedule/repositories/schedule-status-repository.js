import database from '../connections/connection.js';

class ScheduleStatusRepository {

    async createScheduleStatus(data) {
        try {
            const { id } = data;

            const conn = await database.generateConnection();
            const result = await conn.query(`
                INSERT INTO schedule_status (schedule_id, status_id)
                VALUES ($1, $2) RETURNING id;
            `, [id, '1']);

            return result.rows[0];
        } catch (error) {
            throw new Error(error);
        }
    }

}

export default ScheduleStatusRepository;