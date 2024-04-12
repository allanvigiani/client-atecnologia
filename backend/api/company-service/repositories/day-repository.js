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

    async getDaysByCompany(serviceId, companyId) {
        let client;
        try {

            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query
                (`
                    SELECT sd.id, sd.description
                    FROM service_days sd`
                );
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

export default DayRepository;