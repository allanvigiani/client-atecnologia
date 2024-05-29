import database from './connection.js';

class ScheduleRepository {

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

    async updateScheduleStatus(data) {
        let client;
        try {
            const { schedule_id, status_id } = data;

            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`
                UPDATE schedule_status SET status_id = $1 WHERE schedule_id = $2 RETURNING id;
            `, [status_id, schedule_id]);
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
                SELECT id, schedule_id, status_id FROM schedule_status WHERE schedule_id = $1;
            `, [id]);
            client.release();
            return result.rows[0];
        } catch (error) {
            if (client) {
                client.release();
            }
            throw new Error(error);
        }
    }

    async getSchedulesByUserId(id) {
        let client;
        try {
            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`
            SELECT st.id AS id_status,
                   st.description AS descr_status,
                   s.*
            FROM schedule s
            INNER JOIN schedule_status ss ON s.id = ss.schedule_id
            INNER JOIN status st ON CAST(ss.status_id AS INTEGER) = st.id
            WHERE s.user_id = $1;
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

    async getScheduleById(id) {
        let client;
        try {
            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`SELECT * FROM schedule WHERE service_id = $1;`, [id]);
            client.release();
            return result.rows[0];
        } catch (error) {
            if (client) {
                client.release();
            }
            throw new Error(error);
        }
    }

    async deleteScheduleStatus(schedule_id) {
        let client;
        try {
            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`
                DELETE FROM schedule_status WHERE schedule_id = $1;
            `, [schedule_id]);
            client.release();
            return result.rows[0];
        } catch (error) {
            if (client) {
                client.release();
            }
            throw new Error(error);
        }
    }

    async verifyRevogedToken(token) {

        try {
            const conn = await database.generateConnection();


            const result = await conn.query(`
            SELECT us.id, us.start_login, us.end_login, us.token FROM user_sessions us 
                WHERE us.end_login IS NOT NULL AND us.token = $1;
        `, [token]);

            return result.rows;
        } catch (error) {
            throw new Error(error);
        }
    }
}

export default ScheduleRepository;