import database from '../connections/connection.js';

class ScheduleRepository {

    async createScheduleStatus(data) {
        let client;
        try {
            const { id } = data;

            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`
                INSERT INTO schedule_status (schedule_id, status_id)
                VALUES ($1, $2) RETURNING id;
            `, [id, 1]);
            client.release();
            return result.rows[0];
        } catch (error) {
            if (client) {
                client.release();
            }
            throw new Error(error);
        }
    }

    async updateScheduleStatus(data) {
        let client;
        try {
            const { id, status_id } = data;

            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`
                UPDATE schedule_status SET status_id = $1 WHERE id = $2 RETURNING id;
            `, [status_id, id]);
            client.release();
            return result.rows[0];
        } catch (error) {
            if (client) {
                client.release();
            }
            throw new Error(error);
        }
    }

    async getSchedulesByIdSchedule(id) {
        let client;
        try {

            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`
                SELECT id, schedule_id, status_id type FROM schedule_status WHERE schedule_id = $1;
            `, [id]);
            client.release();
            return result.rows;
        } catch (error) {
            if (client) {
                client.release();
            }
            throw new Error(error);
        }
    }

}

export default ScheduleRepository;