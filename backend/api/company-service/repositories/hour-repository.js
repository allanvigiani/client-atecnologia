import database from './connection.js';

class HourRepository {

    async getHours() {
        try {

            const conn = await database.generateConnection();
            const result = await conn.query(`SELECT id, start_time FROM service_hours`);

            return result.rows;
        } catch (error) {
            throw new Error(error);
        }
    }

}

export default HourRepository;