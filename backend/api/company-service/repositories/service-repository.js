import database from './connection.js';

class ServiceRepository {

    async createService(data) {
        try {
            const { name, professional_name, price, company_id, service_type_id, other_service_type, service_hours_id, service_days_id } = data;

            const conn = await database.generateConnection();
            const result = await conn.query(`
                INSERT INTO public.services
                    (name, professional_name, price, company_id, service_type_id, other_service_type, service_hours_id, service_days_id)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id;
            `, [`${name}`, `${professional_name}`, `${price}`, company_id, service_type_id, other_service_type, service_hours_id, service_days_id]);

            return result.rows[0];
        } catch (error) {
            throw new Error(error);
        }
    }

    async getServiceByName(name, companyId) {
        try {
            const conn = await database.generateConnection();
            const result = await conn.query(`
            SELECT * FROM services WHERE name ILIKE $1 AND company_id = $2 AND deleted_at IS NULL;
        `, [`%${name}%`, `${companyId}`]);

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

    async getAllServicesByCompany(companyId) {
        try {
            const conn = await database.generateConnection();
            const result = await conn.query(`
            SELECT * FROM services 
            INNER JOIN service_hours ON services.id = service_hours.service_id 
            LEFT JOIN schedule ON schedule.service_hour_id = service_hours.id
            WHERE services.company_id = $1 AND services.deleted_at IS NULL AND schedule.id IS NULL;
        `, [companyId]);

            return result.rows;
        } catch (error) {
            throw new Error(error);
        }
    }

    async getAllScheduledServicesByCompany(companyId) {
        try {
            const conn = await database.generateConnection();
            const result = await conn.query(`
            SELECT * FROM services 
            INNER JOIN service_hours ON services.id = service_hours.service_id 
            INNER JOIN schedule ON schedule.service_hour_id = service_hours.id
            WHERE services.company_id = $1 AND services.deleted_at IS NULL;
        `, [companyId]);

            return result.rows;
        } catch (error) {
            throw new Error(error);
        }
    }
    
    async getAllServices(companyId) {
        try {
            const conn = await database.generateConnection();
            const result = await conn.query(`
            SELECT * FROM services INNER JOIN service_hours ON services.id = service_hours.service_id WHERE company_id = $1 AND deleted_at IS NULL ORDER BY services.name, service_hours.start_time, service_hours.end_time ;
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

}

export default ServiceRepository;