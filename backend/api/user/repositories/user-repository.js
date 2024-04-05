import database from './connection.js';

class UserRepository {

    async createUser(data) {
        try {
            const { name, email, password, address, contact_phone, created_at } = data;

            const conn = await database.generateConnection();
            const result = await conn.query(`
                INSERT INTO public.user
                    (name, email, password, address, contact_phone, created_at)
                    VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;
            `, [`${name}`, `${email}`, `${password}`, `${address}`, `${contact_phone}`,  created_at]);
    
            return result.rows[0];
        } catch (error) {
            throw new Error(error);
        }
    }

    async getUserByEmail(email) {
        try {
            const conn = await database.generateConnection();
            const result = await conn.query(`
            SELECT * FROM user WHERE email = $1;
        `, [`${email}`]);

        return result.rows.length == 0 ? true : false;
        } catch (error) {
            throw new Error(error);
        }
    }

    async getUserById(userId) {
        try {
            const conn = await database.generateConnection();
            const result = await conn.query(`
            SELECT id, name, email, contact_phone, address FROM user WHERE id = $1;
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

}

export default UserRepository;