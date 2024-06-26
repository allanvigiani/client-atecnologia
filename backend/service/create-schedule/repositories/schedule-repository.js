import database from '../connections/connection.js';

class ScheduleRepository {

    async createSchedule(data) {
        let client;
        try {
            const { company_id, user_id,  service_id, service_hour_id, service_day_id, created_at, date } = data;

            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`
                INSERT INTO schedule 
                    (company_id, user_id, service_id, service_hour_id, service_day_id, created_at, date)
                    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;
            `, [company_id, user_id, service_id, service_hour_id, service_day_id, created_at, date]);
            client.release();
            return result.rows[0];
        } catch (error) {
            if (client) {
                client.release();
            }
            throw new Error(error);
        }
    }

    async getCompany(companyId) {
        let client;
        try {

            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`
                SELECT name, email, address FROM company WHERE id = $1;
            `, [companyId]);
            client.release();
            return result.rows[0];
        } catch (error) {
            if (client) {
                client.release();
            }
            throw new Error(error);
        }
    }

    async getUser(userId) {
        let client;
        try {

            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`
                SELECT name, email FROM users WHERE id = $1;
            `, [userId]);
            client.release();
            return result.rows[0];
        } catch (error) {
            if (client) {
                client.release();
            }
            throw new Error(error);
        }
    }

    async getService(serviceId) {
        let client;
        try {

            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`
                SELECT services.name, services.professional_name FROM services WHERE services.id = $1;
            `, [serviceId]);
            client.release();
            return result.rows[0];
        } catch (error) {
            if (client) {
                client.release();
            }
            throw new Error(error);
        }
    }

    async getHourName(hourId) {
        let client;
        try {

            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`
                SELECT start_time FROM service_hours WHERE id = $1;
            `, [hourId]);
            client.release();
            return result.rows[0];
        } catch (error) {
            if (client) {
                client.release();
            }
            throw new Error(error);
        }
    }

    async getDayName(dayId) {
        let client;
        try {

            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`
                SELECT description FROM service_days WHERE id = $1;
            `, [dayId]);
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

export default ScheduleRepository;