import database from './connection.js';

class CompanyRepository {

    async createCompany(data) {
        try {
            const { name, email, password, address, url_name, created_at } = data;

            const conn = await database.generateConnection();
            const result = await conn.query(`
                INSERT INTO public.company
                    (name, email, password, address, url_name, created_at)
                    VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;
            `, [`${name}`, `${email}`, `${password}`, `${address}`, `${url_name}`,  created_at]);
    
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
            SELECT id, name, email, url_name, address FROM company WHERE id = $1;
        `, [`${userId}`]);

        return result.rows[0];
        } catch (error) {
            throw new Error(error);
        }
    }

    async getCompanyByUrl(companyUrl) {
        try {
            const conn = await database.generateConnection();
            const result = await conn.query(`
            SELECT id, name, email, url_name, address FROM company WHERE url_name = $1;
        `, [`${companyUrl}`]);

        return result.rows[0];
        } catch (error) {
            throw new Error(error);
        }
    }

    async getAllCompanies() {
        try {
            const conn = await database.generateConnection();
            const result = await conn.query(`SELECT id, name, email, url_name, address FROM company;`);

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

export default CompanyRepository;