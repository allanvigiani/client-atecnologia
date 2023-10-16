import conn from './connection.js';

class AuthRepository {

    constructor() {
        this.conn = conn;
    }

    async getCompanyByEmail(userEmail) {
        try {
            await this.conn.connect();
            const result = await this.conn.query(`
                SELECT u.id, u.name, u.email, u.password FROM company u 
                    WHERE u.email = $1 
            `, [userEmail]);

            return result.rows[0];
        } catch (error) {
            throw new Error(error);
        }
    }

    async getCompanySession(comapnyId) {
        try {
            await this.conn.connect();
            const result = await this.conn.query(`
                SELECT us.id, us.start_login, us.end_login, us.token FROM company_sessions us 
                    WHERE us.company_id = $1 AND us.end_login IS NULL
            `, [comapnyId]);

            return result.rows[0];
        } catch (error) {
            throw new Error(error);
        }
    }

    async deleteCompanySession(sessionId) {
        try {
            await this.conn.connect();
            const result = await this.conn.query(`
                UPDATE company_sessions us SET end_login = NOW() WHERE us.id = $1; 
            `, [sessionId]);

            return result.rows;
        } catch (error) {
            throw new Error(error);
        }
    }

    async deleteCompanySessionByUserId(companyId) {
        try {
            await this.conn.connect();
            const result = await this.conn.query(`
                UPDATE company_sessions us SET end_login = NOW() WHERE us.company_id = $1 AND us.end_login IS NULL; 
            `, [companyId]);

            return result.rows;
        } catch (error) {
            throw new Error(error);
        }
    }

    async createCompanySession(companyId, token) {
        try {
            await this.conn.connect();
            const result = await this.conn.query(`
                INSERT INTO company_sessions (company_id, start_login, token)
                    VALUES ($1, NOW(), $2);
            `, [companyId, token]);

            return result.rows;
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

export default AuthRepository;