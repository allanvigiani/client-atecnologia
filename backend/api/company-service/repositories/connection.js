import pkg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pkg;
dotenv.config();

class Database {
    async configureConnection() {
        if(!global.databaseConnection) {
            const connectionString = process.env.POSTGRES_URL;
            global.databaseConnection = new Pool({
                connectionString,
                ssl: {
                    rejectUnauthorized: false // Atenção: Para produção, considere maneiras mais seguras de lidar com SSL.
                }
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
