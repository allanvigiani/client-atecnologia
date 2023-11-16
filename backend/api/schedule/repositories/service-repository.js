import database from './connection.js';

class ServiceRepository {

    async createService(data) {
        try {
            const { name, professional_name, price, company_id } = data;

            const conn = await database.generateConnection();
            const result = await conn.query(`
                INSERT INTO public.services
                    (name, professional_name, price, company_id)
                    VALUES ($1, $2, $3, $4) RETURNING id;
            `, [`${name}`, `${professional_name}`, `${price}`, company_id]);

            return result.rows[0];
        } catch (error) {
            throw new Error(error);
        }
    }

    async getServiceByName(name) {
        try {
            const conn = await database.generateConnection();
            const result = await conn.query(`
            SELECT * FROM services WHERE name ILIKE $1;
        `, [`%${name}%`]);

            return result.rows.length == 0 ? true : false;
        } catch (error) {
            throw new Error(error);
        }
    }

    async getServiceById(id, companyId) {
        try {
            const conn = await database.generateConnection();
            const result = await conn.query(`
            SELECT * FROM services WHERE id = $1 AND company_id = $2 AND deleted_at IS NULL;
        `, [id, companyId]);

            return result.rows[0];
        } catch (error) {
            throw new Error(error);
        }
    }

    async getAllServices(companyId) {
        try {
            const conn = await database.generateConnection();
            const result = await conn.query(`
            SELECT * FROM services WHERE company_id = $1 AND deleted_at IS NULL;
        `, [companyId]);

            return result.rows;
        } catch (error) {
            throw new Error(error);
        }
    }

    async deleteService(id, companyId) {
        try {
            const conn = await database.generateConnection();
            const result = await conn.query(`
            UPDATE services SET deleted_at = NOW() WHERE id = $1 AND company_id = $2;
        `, [id, companyId]);

            return result.rows;
        } catch (error) {
            throw new Error(error);
        }
    }

    async verifyRevogedToken(token) {
        try {
            const conn = await database.generateConnection();
            const result = await conn.query(`
            SELECT us.id, us.start_login, us.end_login, us.token FROM company_sessions us 
                WHERE us.end_login IS NOT NULL AND us.token = $1;
        `, [token]);

            return result.rows;
        } catch (error) {
            throw new Error(error);
        }
    }

    async getServiceInHour(startTime, endTime, serviceId) {
        try {
            const conn = await database.generateConnection();
            const result = await conn.query(`
            SELECT * FROM service_hours
                WHERE $1 >= start_time AND $2 <= end_time AND service_id = $3;
        `, [`${startTime}`, `${endTime}`, serviceId]);

            return result.rows.length == 0 ? true : false;
        } catch (error) {
            throw new Error(error);
        }
    }

    async createServiceHour(data) {
        try {
            const { start_time, end_time, service_id } = data;

            const conn = await database.generateConnection();
            const result = await conn.query(`
                INSERT INTO service_hours
                    (start_time, end_time, service_id)
                    VALUES ($1, $2, $3) RETURNING id;
            `, [`${start_time}`, `${end_time}`, service_id]);

            return result.rows[0];
        } catch (error) {
            throw new Error(error);
        }
    }

    async getServiceHourById(serviceId, companyId) {
        try {
            const conn = await database.generateConnection();
            const result = await conn.query(`
            SELECT sh.id, start_time, end_time FROM service_hours sh 
            INNER JOIN services s ON s.id = sh.service_id
            WHERE s.company_id = $1 AND sh.service_id = $2 AND s.deleted_at IS NULL;
        `, [companyId, serviceId]);

            return result.rows;
        } catch (error) {
            throw new Error(error);
        }
    }

    async deleteServiceHour(serviceHourId) {
        try {
            const conn = await database.generateConnection();
            const result = await conn.query(`
            DELETE FROM service_hours WHERE id = $1;
        `, [serviceHourId]);

            return result.rows;
        } catch (error) {
            throw new Error(error);
        }
    }

}

export default ServiceRepository;