import database from './connection.js';

class UserRepository {

    async createUser(data) {

        try {
            const { name, email, password, address, contact_phone, created_at } = data;

            const conn = await database.generateConnection();

            const result = await conn.query(`
                INSERT INTO users
                    (name, email, password, address, contact_phone, created_at)
                    VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;
            `, [`${name}`, `${email}`, `${password}`, address, contact_phone, created_at]);

            return result.rows[0];
        } catch (error) {

            throw new Error(error);
        }
    }

    async updateUserInformation(data, userId) {
        try {
            const { name, contact_phone, address } = data;

            const conn = await database.generateConnection();

            if (name && address && !contact_phone) {
                const result = await conn.query(`
                    UPDATE users SET name = $1, address = $2 WHERE id = $3;
                `, [`${name}`, `${address}`, userId]);

                return result.rowCount > 0 ? true : false;
            }

            if (contact_phone) {
                const result = await conn.query(`
                    UPDATE users SET contact_phone = $1 WHERE id = $2;
                `, [`${contact_phone}`, userId]);

                return result.rowCount > 0 ? true : false;
            }

        } catch (error) {
            throw new Error(error);
        }
    }

    async getUserByEmail(email) {

        let client;

        try {
            const conn = await database.generateConnection();

            const result = await conn.query(`SELECT * FROM users WHERE email = $1;`, [`${email}`]);

            return result.rows.length == 0 ? true : false;
        } catch (error) {
            throw new Error(error);
        }
    }

    async getUserById(userId) {

        try {
            const conn = await database.generateConnection();

            const result = await conn.query(`
            SELECT id, name, email, contact_phone, address FROM users WHERE id = $1;
            `, [`${userId}`]);

            return result.rows[0];
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

    async getResetPasswordCode(email, resetCode) {

        try {
            const conn = await database.generateConnection();
            const result = await conn.query(`
                SELECT email, reset_code, expired_at FROM reset_password_code 
                    WHERE email = $1 AND reset_code = $2;
            `, [email, resetCode]);

            return result.rows[0];
        } catch (error) {
            throw new Error(error);
        }
    }

    async updateUserPassword(email, hash) {
        try {
            const conn = await database.generateConnection();
            const result = await conn.query(`
                UPDATE users SET password = $1 WHERE email = $2;
            `, [hash, email]);
            return result.rows;
        } catch (error) {
            throw new Error(error);
        }
    }

    async deleteResetPasswordCode(email) {

        try {
            const conn = await database.generateConnection();
            const result = await conn.query(`
                DELETE FROM reset_password_code WHERE email = $1;
            `, [email]);

            return result.rows;
        } catch (error) {
            throw new Error(error);
        }
    }

}

export default UserRepository;