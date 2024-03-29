import database from './connection.js';

class DayRepository {

    async getDays() {
        try {

            const conn = await database.generateConnection();
            const result = await conn.query(`SELECT id, description FROM service_days`);

            return result.rows;
        } catch (error) {
            throw new Error(error);
        }
    }

}

export default DayRepository;