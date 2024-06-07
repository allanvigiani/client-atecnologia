import database from './connection.js';

class AuthRepository {

    async getCompanyByEmail(userEmail) {

        let client;

        try {
            const conn = await database.generateConnection();
            client = await conn.connect();

            const result = await conn.query(`
                SELECT u.id, u.name, u.email, u.password FROM company u 
                    WHERE u.email = $1 
            `, [userEmail]);

            client.release();

            return result.rows[0];
        } catch (error) {
            if (client) {
                client.release();
            }
            throw new Error(error);
        }
    }

    async getCompanySession(comapnyId) {

        let client;

        try {
            const conn = await database.generateConnection();
            client = await conn.connect();

            const result = await conn.query(`
                SELECT us.id, us.start_login, us.end_login, us.token FROM company_sessions us 
                    WHERE us.company_id = $1 AND us.end_login IS NULL
            `, [comapnyId]);

            client.release();

            return result.rows[0];
        } catch (error) {
            if (client) {
                client.release();
            }
            throw new Error(error);
        }
    }

    async deleteCompanySession(sessionId) {

        let client;

        try {
            const conn = await database.generateConnection();
            client = await conn.connect();

            const result = await conn.query(`
                UPDATE company_sessions us SET end_login = NOW() WHERE us.id = $1; 
            `, [sessionId]);

            client.release();

            return result.rows;
        } catch (error) {
            if (client) {
                client.release();
            }
            throw new Error(error);
        }
    }

    async deleteCompanySessionByUserId(companyId) {

        let client;

        try {
            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`
                UPDATE company_sessions us SET end_login = NOW() WHERE us.company_id = $1 AND us.end_login IS NULL; 
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

    async createCompanySession(companyId, token) {
        let client;
        try {
            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`
                INSERT INTO company_sessions (company_id, start_login, token)
                    VALUES ($1, NOW(), $2);
            `, [companyId, token]);
            client.release();
            return result.rows;
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
    
    async createResetPasswordToken(email, resetToken) {
        let client;
        try {
            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`
                INSERT INTO reset_password (email, reset_token)
                    VALUES ($1, $2);
            `, [email, resetToken]);
            client.release();
            return result.rows;
        } catch (error) {
            if (client) {
                client.release();
            }
            throw new Error(error);
        }
    }

    async getResetPasswordToken(email, resetToken) {

        try {
            const conn = await database.generateConnection();
            const result = await conn.query(`
                SELECT email, reset_token, expired_at FROM reset_password 
                    WHERE email = $1 AND reset_token = $2;
            `, [email, resetToken]);

            return result.rows[0];
        } catch (error) {
            throw new Error(error);
        }
    }

    async updateCompanyPassword(email, hash) {
        try {
            const conn = await database.generateConnection();
            const result = await conn.query(`
                UPDATE company SET password = $1 WHERE email = $2;
            `, [hash, email]);
            return result.rows;
        } catch (error) {
            throw new Error(error);
        }
    }

    async deleteResetPasswordToken(email) {
        let client;
        try {
            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`
                DELETE FROM reset_password WHERE email = $1;
            `, [email]);
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

export default AuthRepository;