import database from '../connections/connection.js';

class ScheduleRepository {

    async createSchedule(data) {
        try {
            const { service_id, service_hour_id, created_at, client_name, client_contact, client_email, company_id, schedule_date, status } = data;

            const conn = await database.generateConnection();
            const result = await conn.query(`
                INSERT INTO schedule 
                    (service_id, service_hour_id, created_at, client_name, client_contact, client_email, company_id, schedule_date, status_id)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id;
            `, [service_id, service_hour_id, created_at, `${client_name}`, `${client_contact}`, client_email, company_id, schedule_date, status]);

            return result.rows[0];
        } catch (error) {
            throw new Error(error);
        }
    }

    async getCompany(companyId) {
        try {

            const conn = await database.generateConnection();
            const result = await conn.query(`
                SELECT name, email, address FROM company WHERE id = $1;
            `, [companyId]);

            return result.rows[0];
        } catch (error) {
            throw new Error(error);
        }
    }

    async getUser(userId) {
        try {

            const conn = await database.generateConnection();
            const result = await conn.query(`
                SELECT name, email FROM user WHERE id = $1;
            `, [userId]);

            return result.rows[0];
        } catch (error) {
            throw new Error(error);
        }
    }

    async getService(serviceId) {
        try {

            const conn = await database.generateConnection();
            const result = await conn.query(`
                SELECT service.name, service.professional_name FROM services WHERE serivce.id = $1;
            `, [serviceId]);

            return result.rows[0];
        } catch (error) {
            throw new Error(error);
        }
    }

    async getHourName(hourId) {
        try {

            const conn = await database.generateConnection();
            const result = await conn.query(`
                SELECT start_time FROM service_hours WHERE id = $1;
            `, [hourId]);

            return result.rows[0];
        } catch (error) {
            throw new Error(error);
        }
    }

    async getDayName(dayId) {
        try {

            const conn = await database.generateConnection();
            const result = await conn.query(`
                SELECT description FROM service_days WHERE id = $1;
            `, [dayId]);

            return result.rows[0];
        } catch (error) {
            throw new Error(error);
        }
    }

}

export default ScheduleRepository;