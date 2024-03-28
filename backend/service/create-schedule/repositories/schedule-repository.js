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

}

export default ScheduleRepository;