import database from '../connections/connection.js';

class ScheduleRepository {

    async createSchedule(data) {
        let client;
        try {
            const { service_id, service_hour_id, created_at, client_name, client_contact, client_email, company_id, schedule_date, status } = data;

            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`
                INSERT INTO schedule 
                    (service_id, service_hour_id, created_at, client_name, client_contact, client_email, company_id, schedule_date, status_id)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id;
            `, [service_id, service_hour_id, created_at, `${client_name}`, `${client_contact}`, client_email, company_id, schedule_date, status]);
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
                SELECT name, email FROM user WHERE id = $1;
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
                SELECT service.name, service.professional_name FROM services WHERE serivce.id = $1;
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