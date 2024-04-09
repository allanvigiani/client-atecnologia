import database from './connection.js';

class UserRepository {

    async createUser(data) {

        let client;

        try {
            const { name, email, password, address, contact_phone, created_at } = data;

            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`
                INSERT INTO public.user
                    (name, email, password, address, contact_phone, created_at)
                    VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;
            `, [`${name}`, `${email}`, `${password}`, address, contact_phone,  created_at]);
    
            client.release();

            return result.rows[0];
        } catch (error) {
            if (client) {
                client.release();
            }
            throw new Error(error);
        }
    }

    async getUserByEmail(email) {

        let client;

        try {
            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`SELECT * FROM public.user WHERE email = $1;`, [`${email}`]);

            client.release();
            return result.rows.length == 0 ? true : false;
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
            client = await conn.connect()

            const result = await conn.query(`
            SELECT id, name, email, contact_phone, address FROM user WHERE id = $1;
            `, [`${userId}`]);

            client.release();

            return result.rows[0];
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

export default UserRepository;