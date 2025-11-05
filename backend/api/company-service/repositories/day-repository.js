import database from './connection.js';

class DayRepository {

    async getDays() {
        let client;
        try {

            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`SELECT id, description FROM service_days`);
            client.release();
            return result.rows;
        } catch (error) {
            if (client) {
                client.release();
            }
            throw new Error(error);
        }
    }

    async getDaysByService(serviceId, companyId) {
        try {
            const conn = await database.generateConnection();
            const result = await conn.query(`SELECT service_days_id FROM services WHERE id = $1 AND company_id = $2`, [serviceId, companyId]);
            return result.rows[0];

        } catch (error) {
            throw new Error(error);
        }
    }

    async getDay(day) {
        try {

            const conn = await database.generateConnection();
            const result = await conn.query(`SELECT id, description FROM service_days WHERE id = $1`, [`${day}`]);
            return result.rows[0];

        } catch (error) {
            throw new Error(error);
        }
    }
    
}

export default DayRepository;