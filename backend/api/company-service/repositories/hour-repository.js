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

    async getHoursByCompany(serviceId, companyId) {
        try {

            const conn = await database.generateConnection();
            const result = await conn.query
                (`
                    SELECT sh.id, sh.start_time FROM 
                    FROM company c 
                    INNER JOIN services s ON s.company_id = c.id 
                    INNER JOIN service_hours sh ON sh.id = s.service_hours_id 
                    WHERE s.deleted_at IS NULL 
                    AND s.id = $1
                    AND c.id = $2`,
                    [`${serviceId}, ${companyId}`]
                );

            return result.rows;
        } catch (error) {
            throw new Error(error);
        }
    }

}

export default HourRepository;