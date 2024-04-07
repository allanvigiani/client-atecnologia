import database from './connection.js';

class AuthRepository {

    async getUserByEmail(userEmail) {
        try {
            const conn = await database.generateConnection();
            const result = await conn.query(`
                SELECT u.id, u.name, u.email, u.password FROM user u 
                    WHERE u.email = $1 
            `, [userEmail]);

            return result.rows[0];
        } catch (error) {
            throw new Error(error);
        }
    }

    async getUserSession(userId) {
        try {
            const conn = await database.generateConnection();
            const result = await conn.query(`
                SELECT us.id, us.start_login, us.end_login, us.token FROM user_sessions us 
                    WHERE us.company_id = $1 AND us.end_login IS NULL
            `, [userId]);

            return result.rows[0];
        } catch (error) {
            throw new Error(error);
        }
    }

    async deleteUserSession(sessionId) {
        try {
            const conn = await database.generateConnection();
            const result = await conn.query(`
                UPDATE user_sessions us SET end_login = NOW() WHERE us.id = $1; 
            `, [sessionId]);

            return result.rows;
        } catch (error) {
            throw new Error(error);
        }
    }

    async deleteUserSessionByUserId(userId) {
        try {
            const conn = await database.generateConnection();
            const result = await conn.query(`
                UPDATE user_sessions us SET end_login = NOW() WHERE us.user_id = $1 AND us.end_login IS NULL; 
            `, [userId]);

            return result.rows;
        } catch (error) {
            throw new Error(error);
        }
    }

    async createUserSession(userId, token) {
        try {
            const conn = await database.generateConnection();
            const result = await conn.query(`
                INSERT INTO user_sessions (user_id, start_login, token)
                    VALUES ($1, NOW(), $2);
            `, [userId, token]);

            return result.rows;
        } catch (error) {
            throw new Error(error);
        }
    }

    async verifyRevogedToken(token) {
        try {
            const conn = await database.generateConnection();
            const result = await conn.query(`
            SELECT us.id, us.start_login, us.end_login, us.token FROM user_sessions us 
                WHERE us.end_login IS NOT NULL AND us.token = $1;
        `, [token]);

            return result.rows;
        } catch (error) {
            throw new Error(error);
        }
    }

}

export default AuthRepository;