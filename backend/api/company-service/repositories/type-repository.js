import database from './connection.js';

class TypeRepository {

    async getTypes() {
        try {

            const conn = await database.generateConnection();
            const result = await conn.query(`SELECT id, type FROM service_type`);

            return result.rows;
        } catch (error) {
            throw new Error(error);
        }
    }

}

export default TypeRepository;