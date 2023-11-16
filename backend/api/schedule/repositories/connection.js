import pkg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pkg;
dotenv.config();

class Database {
    async configureConnection() {
        if(!global.databaseConnection) {
            global.databaseConnection = new Pool({
                user: process.env.DATABASE_USER,
                host: process.env.DATABASE_HOST,
                database: process.env.DATABASE_NAME,
                password: process.env.DATABASE_PASSWORD,
                port: process.env.DATABASE_PORT
            });
        }
        return global.databaseConnection;
    }

    async generateConnection() {
        return Promise.resolve(this.configureConnection());
    }
}

const database = new Database();

export default database;