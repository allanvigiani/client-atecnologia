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
                    s.*,
                    sd.description,
                    sh.start_time,
                    s2."name"
            FROM schedule s
            INNER JOIN schedule_status ss ON s.id = ss.schedule_id
            INNER JOIN status st ON CAST(ss.status_id AS INTEGER) = st.id
            INNER JOIN services s2 ON s.service_id = s2.id
            INNER JOIN service_days sd ON s.service_day_id = sd.id 
            INNER JOIN service_hours sh ON s.service_hour_id = sh.id 
            WHERE s.company_id = $1 AND status_id = '1' AND s.deleted_at IS NULL;
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

    async getSchedulesByUserIdConfirmed(id) {
        let client;
        try {
            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`
            SELECT st.id AS id_status,
                    st.description AS descr_status,
                    s.*,
                    sd.description,
                    sh.start_time,
                    s2."name"
            FROM schedule s
            INNER JOIN schedule_status ss ON s.id = ss.schedule_id
            INNER JOIN status st ON CAST(ss.status_id AS INTEGER) = st.id
            INNER JOIN services s2 ON s.service_id = s2.id
            INNER JOIN service_days sd ON s.service_day_id = sd.id 
            INNER JOIN service_hours sh ON s.service_hour_id = sh.id 
            WHERE s.company_id = $1 AND status_id = '2' AND s.deleted_at IS NULL;
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

    async getSchedulesByUserIdToApp(id) {
        let client;
        try {
            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`
            SELECT st.id AS id_status,
                    st.description AS descr_status,
                    s.*,
                    sd.description,
                    sh.start_time,
                    s2."name"
            FROM schedule s
            INNER JOIN schedule_status ss ON s.id = ss.schedule_id
            INNER JOIN status st ON CAST(ss.status_id AS INTEGER) = st.id
            INNER JOIN services s2 ON s.service_id = s2.id
            INNER JOIN service_days sd ON s.service_day_id = sd.id 
            INNER JOIN service_hours sh ON s.service_hour_id = sh.id 
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

    async getScheduleByScheduleId(id) {
        let client;
        try {
            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`SELECT * FROM schedule s
                                             INNER JOIN schedule_status ss ON s.id = ss.schedule_id
                                             INNER JOIN status st ON CAST(ss.status_id AS INTEGER) = st.id
                                             INNER JOIN services s2 ON s.service_id = s2.id
                                             INNER JOIN service_days sd ON s.service_day_id = sd.id 
                                             INNER JOIN service_hours sh ON s.service_hour_id = sh.id 
                                             WHERE ss.schedule_id = $1;`, [id]);
            client.release();
            return result.rows;
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