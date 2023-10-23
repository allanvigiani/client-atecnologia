import conn from './connection.js';

class ScheduleRepository {

    constructor() {
        this.conn = conn;
    }

    async createService(data) {
        try {
            const { service_id, service_hour_id, created_at, client_name, client_contact, client_email, company_id, status } = data;

            await this.conn.connect();
            const result = await this.conn.query(`
                INSERT INTO schedule 
                    (service_id, service_hour_id, created_at, client_name, client_contact, client_email, company_id, status)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id;
            `, [service_id, service_hour_id, created_at, `${client_name}`, `${client_contact}`, client_email, company_id, status]);

            return result.rows[0];
        } catch (error) {
            throw new Error(error);
        }
    }

}

export default ScheduleRepository;