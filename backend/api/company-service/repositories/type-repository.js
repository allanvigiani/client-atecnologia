import database from './connection.js';

class TypeRepository {

    async getTypes() {
        let client;
        try {

            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`SELECT id, type FROM service_type`);
            client.release();
            return result.rows;
        } catch (error) {
            if (client) {
                client.release();
            }
            throw new Error(error);
        }
    }

    async getTypesById(id) {
        try {

            const conn = await database.generateConnection();
            const result = await conn.query(`SELECT service_type.id, service_type.type FROM service_type INNER JOIN services s ON s.service_type_id = service_type.id WHERE s.id = $1`, [`${id}`]);
            return result.rows;

        } catch (error) {
            throw new Error(error);
        }
    }

}

export default TypeRepository;