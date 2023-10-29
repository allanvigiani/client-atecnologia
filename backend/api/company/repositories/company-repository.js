import conn from './connection.js';

class CompanyRepository {

    constructor() {
        this.conn = conn;
    }

    async createCompany(data) {
        try {
            const { name, email, password, address, url_name, created_at } = data;

            await this.conn.connect();
            const result = await this.conn.query(`
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
            const result = await this.conn.query(`
            SELECT * FROM company WHERE email = $1;
        `, [`${email}`]);

        return result.rows.length == 0 ? true : false;
        } catch (error) {
            throw new Error(error);
        }
    }

    async getCompanyById(userId) {
        try {
            const result = await this.conn.query(`
            SELECT * FROM company WHERE id = $1;
        `, [`${userId}`]);

        return result.rows[0];
        } catch (error) {
            throw new Error(error);
        }
    }

    async verifyRevogedToken(token) {
        try {
            await this.conn.connect();
            const result = await this.conn.query(`
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