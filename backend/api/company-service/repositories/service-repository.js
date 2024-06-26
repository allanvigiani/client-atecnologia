import database from './connection.js';

class ServiceRepository {

    async createService(data) {
        let client;
        try {
            const { name, professional_name, price, company_id, service_type_id, other_service_type, service_hours_id, service_days_id } = data;

            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`
                INSERT INTO public.services
                    (name, professional_name, price, company_id, service_type_id, other_service_type, service_hours_id, service_days_id)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id;
            `, [`${name}`, `${professional_name}`, `${price}`, company_id, service_type_id, other_service_type, service_hours_id, service_days_id]);
            client.release();
            return result.rows[0];
        } catch (error) {
            if (client) {
                client.release();
            }
            throw new Error(error);
        }
    }

    async getServiceByName(name, companyId) {
        let client;
        try {
            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`
            SELECT * FROM services WHERE name ILIKE $1 AND company_id = $2 AND deleted_at IS NULL;
        `, [`%${name}%`, `${companyId}`]);
            client.release();
            return result.rows.length == 0 ? true : false;
        } catch (error) {
            if (client) {
                client.release();
            }
            throw new Error(error);
        }
    }

    async getServiceById(id, companyId) {
        let client;
        try {
            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`
            SELECT * FROM services WHERE id = $1 AND company_id = $2 AND deleted_at IS NULL;
        `, [id, companyId]);
            client.release();
            return result.rows[0];
        } catch (error) {
            if (client) {
                client.release();
            }
            throw new Error(error);
        }
    }

    async getAllServicesByCompany(companyId) {
        let client;
        try {
            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`
            SELECT * FROM services 
            WHERE services.company_id = $1 AND services.deleted_at IS NULL
            ORDER BY services.created_at;
        `, [companyId]);
            client.release();
            return result.rows;
        } catch (error) {
            if (client) {
                client.release();
            }
            throw new Error(error);
        }
    }

    async getAllScheduledServicesByCompany(companyId) {
        let client;
        try {
            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`
            SELECT * FROM company 
            INNER JOIN services s on s.company_id = company.id
            WHERE s.company_id = $1 AND s.deleted_at IS NULL;
        `, [companyId]);
            client.release();
            return result.rows;
        } catch (error) {
            if (client) {
                client.release();
            }
            throw new Error(error);
        }
    }

    async getAllServices(companyId) {
        let client;
        try {
            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`SELECT services.id, services.name, services.price, services.professional_name, company.name as company_name, company.address, company.id as company_id FROM services 
            INNER JOIN company ON services.company_id = company.id
            WHERE company.id = $1 AND services.deleted_at IS NULL ORDER BY services.name ASC;`, [companyId]);
            client.release();
            return result.rows;
        } catch (error) {
            if (client) {
                client.release();
            }
            throw new Error(error);
        }
    }

    async getServiceByIdApp(id) {
        let client;
        try {
            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`
            SELECT services.id,
                   services.name,
                   services.price,
                   services.professional_name,
                   company.name as company_name,
                   company.address, 
                   company.id as company_id
            FROM services 
            INNER JOIN company ON services.company_id = company.id
            WHERE services.id = $1 AND services.deleted_at IS NULL;
        `, [id]);
            client.release();
            return result.rows;
        } catch (error) {
            if (client) {
                client.release();
            }
            throw new Error(error);
        }
    }

    async getAllServicesApp() {
        let client;
        try {
            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`SELECT services.id, services.name, services.price, services.professional_name, company.name as company_name, company.address, company.id as company_id FROM services 
            INNER JOIN company ON services.company_id = company.id
            WHERE services.deleted_at IS NULL ORDER BY services.name ASC;`);
            client.release();
            return result.rows;
        } catch (error) {
            if (client) {
                client.release();
            }
            throw new Error(error);
        }
    }

    async getAllServicesByType(id_type) {
        let client;
        try {

            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`
                SELECT services.id, services.name, services.price, services.professional_name, company.name as company_name, company.address, company.id as company_id
                FROM services 
                INNER JOIN company ON services.company_id = company.id
                INNER JOIN service_type ON services.service_type_id = service_type.id
                WHERE service_type.id = $1 AND services.deleted_at IS NULL;
            `, [id_type]);
            client.release();
            return result.rows;
        } catch (error) {
            if (client) {
                client.release();
            }
            throw new Error(error);
        }
    }

    async deleteService(id, companyId) {
        let client;
        try {
            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`
            UPDATE services SET deleted_at = NOW() WHERE id = $1 AND company_id = $2;
        `, [id, companyId]);
            client.release();
            return result.rows;
        } catch (error) {
            if (client) {
                client.release();
            }
            throw new Error(error);
        }
    }

    async updateService(data) {
        let client;
        try {
            const { id, name, professional_name, price, company_id, service_hours_id, service_days_id } = data;

            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`
                UPDATE services 
                SET name = $3, professional_name = $4, price = $5, service_hours_id = $6, service_days_id = $7 
                WHERE id = $1 AND company_id = $2;
            `, [id, company_id, name, professional_name, price, service_hours_id, service_days_id]);
            client.release();
            return result.rows;
        } catch (error) {
            if (client) {
                client.release();
            }
            throw new Error(error);
        }
    }

    async getResultsBySearch(text) {
        let client;
        try {

            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`
                SELECT 
                    services.id,
                    services.name,
                    services.price,
                    services.professional_name,
                    company.name as company_name,
                    company.address, 
                    company.id as company_id 
                FROM services 
                INNER JOIN company ON services.company_id = company.id
                INNER JOIN service_type ON services.service_type_id = service_type.id
                WHERE services.deleted_at IS NULL 
                AND (services.name ILIKE $1 
                    OR service_type.type ILIKE $1
                    OR services.other_service_type ILIKE $1
                    OR company.name ILIKE $1)
                ORDER BY services.name ASC;`, [`%${text}%`]);
            client.release();
            return result.rows;
        } catch (error) {
            if (client) {
                client.release();
            }
            throw new Error(error);
        }
    }

    async getResultsBySearchWithType(text, typeService) {
        let client;
        try {

            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`
                SELECT 
                    services.id,
                    services.name,
                    services.price,
                    services.professional_name,
                    company.name as company_name,
                    company.address, 
                    company.id as company
                FROM services
                INNER JOIN company ON services.company_id = company.id
                INNER JOIN service_type ON services.service_type_id = service_type.id
                WHERE services.deleted_at IS NULL
                AND (services.name ILIKE $1
                    OR service_type.type ILIKE $1
                    OR services.other_service_type ILIKE $1
                    OR company.name ILIKE $1)
                AND service_type.id = $2
                ORDER BY services.name ASC;`, [`%${text}%`, typeService]);
            client.release();
            return result.rows;
        }
        catch (error) {
            if (client) {
                client.release();
            }
            throw new Error(error);
        }
    }

    async verifyRevogedToken(token) {
        let client;
        try {
            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`
            SELECT us.id, us.start_login, us.end_login, us.token FROM company_sessions us 
                WHERE us.end_login IS NOT NULL AND us.token = $1;
        `, [token]);
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

export default ServiceRepository;