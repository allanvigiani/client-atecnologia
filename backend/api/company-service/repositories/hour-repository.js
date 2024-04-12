import database from './connection.js';

class HourRepository {

    async getHours() {
        let client;
        try {

            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`SELECT id, start_time FROM service_hours`);
            client.release();
            return result.rows;
        } catch (error) {
            if (client) {
                client.release();
            }
            throw new Error(error);
        }
    }

    async getHoursByCompany(serviceId, companyId) {
        let client;
        try {

            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query
                (`
                SELECT sh.id, sh.start_time 
                FROM service_hours sh`
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

export default HourRepository;