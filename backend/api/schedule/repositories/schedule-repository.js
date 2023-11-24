import database from './connection.js';

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

    async getCompanyById(userId) {
        try {
            const conn = await database.generateConnection();
            const result = await conn.query(`
            SELECT name, email, url_name, address FROM company WHERE id = $1;
        `, [`${userId}`]);

            return result.rows[0];
        } catch (error) {
            throw new Error(error);
        }
    }

    async getServiceById(id, companyId) {
        try {
            const conn = await database.generateConnection();
            const result = await conn.query(`
            SELECT name, professional_name FROM services WHERE id = $1 AND company_id = $2 AND deleted_at IS NULL;
        `, [id, companyId]);

            return result.rows[0];
        } catch (error) {
            throw new Error(error);
        }
    }

    async getServiceHourById(serviceHourId) {
        try {
            const conn = await database.generateConnection();
            const result = await conn.query(`
            SELECT start_time FROM service_hours WHERE id = $1;
        `, [serviceHourId]);
            return result.rows[0];
        } catch (error) {
            throw new Error(error);
        }
    }

}

export default ScheduleRepository;