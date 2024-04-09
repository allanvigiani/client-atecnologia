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
                    SELECT sd.id, sd.description FROM 
                    FROM company c 
                    INNER JOIN services s ON s.company_id = c.id 
                    INNER join service_days sd on sd.id = s.service_days_id
                    WHERE s.deleted_at IS NULL 
                    AND s.id = $1
                    AND c.id = $2`,
                    [`${serviceId}, ${companyId}`]
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