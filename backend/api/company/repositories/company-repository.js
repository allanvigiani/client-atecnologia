import database from './connection.js';

class CompanyRepository {

    async createCompany(data) {
        try {
            const { name, email, password, address, created_at, cnpj } = data;

            const conn = await database.generateConnection();
            const result = await conn.query(`
                INSERT INTO public.company
                    (name, email, password, address, created_at, cnpj)
                    VALUES ($1, $2, $3, $4, $5, $6 ) RETURNING id;
            `, [`${name}`, `${email}`, `${password}`, `${address}`, created_at, `${cnpj}`]);

            return result.rows[0];
        } catch (error) {
            throw new Error(error);
        }
    }

    async getCompanyByEmail(email) {
        try {
            const conn = await database.generateConnection();
            const result = await conn.query(`
            SELECT * FROM company WHERE email = $1;
        `, [`${email}`]);

            return result.rows.length == 0 ? true : false;
        } catch (error) {
            throw new Error(error);
        }
    }

    async getCompanyById(userId) {
        try {
            const conn = await database.generateConnection();
            const result = await conn.query(`
            SELECT id, name, email, address, cnpj FROM company WHERE id = $1;
        `, [`${userId}`]);

            return result.rows[0];
        } catch (error) {
            throw new Error(error);
        }
    }

    async getAllCompanies() {
        let client;
        try {
            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`SELECT id, name, email, address, cnpj FROM company;`);
            client.release();
            return result.rows;
        } catch (error) {
            if (client) {
                client.release();
            }
            throw new Error(error);
        }
    }


    async updateCompanyInformation(body, companyId) {
        let client;
        try {

            const { name, address } = body

            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`
            UPDATE company SET name = $1, address = $2, updated_at = NOW() WHERE id = $3 RETURNING id;
        `, [`${name}`, `${address}`, companyId]);

            client.release();

            return result.rows.length > 0 ? true : false;
        } catch (error) {
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

export default CompanyRepository;