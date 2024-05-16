import database from './connection.js';

class AuthRepository {

    async getUserByEmail(userEmail) {
        let client;
        try {
            const conn = await database.generateConnection();
            client = await conn.connect();

            const result = await conn.query(`SELECT u.id, u.name, u.email, u.password FROM users u WHERE u.email = $1; `, [`${userEmail}`]);
            client.release();
            return result.rows[0];
        } catch (error) {
            if (client) {
                client.release();
            }
            throw new Error(error);
        }
    }

    async getUserById(userId) {
        let client;
        try {
            const conn = await database.generateConnection();
            client = await conn.connect();

            const result = await conn.query(`SELECT u.id, u.name, u.email, u.address, u.contact_phone FROM users u WHERE u.id = $1; `, [`${userId}`]);
            client.release();
            return result.rows[0];
        } catch (error) {
            if (client) {
                client.release();
            }
            throw new Error(error);
        }
    }

    async getUserSession(userId) {
        let client;
        try {
            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`
                SELECT us.id, us.start_login, us.end_login, us.token FROM user_sessions us 
                    WHERE us.user_id = $1 AND us.end_login IS NULL
            `, [userId]);
            client.release();
            return result.rows[0];
        } catch (error) {
            if (client) {
                client.release();
            }
            throw new Error(error);
        }
    }

    async deleteUserSession(sessionId) {
        let client;
        try {
            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`
                UPDATE user_sessions us SET end_login = NOW() WHERE us.id = $1; 
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

    async deleteUserSessionByUserId(userId) {
        let client;
        try {
            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`
                UPDATE user_sessions us SET end_login = NOW() WHERE us.user_id = $1 AND us.end_login IS NULL; 
            `, [userId]);
            client.release();
            return result.rows;
        } catch (error) {
            if (client) {
                client.release();
            }
            throw new Error(error);
        }
    }

    async createUserSession(userId, token) {
        let client;
        try {
            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`
                INSERT INTO user_sessions (user_id, start_login, token)
                    VALUES ($1, NOW(), $2);
            `, [userId, token]);
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
            SELECT us.id, us.start_login, us.end_login, us.token FROM user_sessions us 
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

export default AuthRepository;