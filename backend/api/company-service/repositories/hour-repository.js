import database from './connection.js';

class HourRepository {

    async getHours() {
        let client;
        try {

            const conn = await database.generateConnection();
            client = await conn.connect();
            const result = await conn.query(`SELECT id, start_time FROM service_hours`);
            client.release();
            return result.rows;
        } catch (error) {
            if (client) {
                client.release();
            }
            throw new Error(error);
        }
    }

    async getHoursByService(serviceId, companyId) {
        try {
            const conn = await database.generateConnection();
            const result = await conn.query(`SELECT service_hours_id FROM services WHERE id = $1 AND company_id = $2`, [serviceId, companyId]);
            return result.rows[0];

        } catch (error) {
            throw new Error(error);
        }
    }

    async getHour(hour) {
        try {

            const conn = await database.generateConnection();
            const result = await conn.query(`SELECT id, start_time FROM service_hours WHERE id = $1`, [`${hour}`]);
            return result.rows[0];

        } catch (error) {
            throw new Error(error);
        }
    }

    async scheduledHours(serviceId, serviceDayId, date) {
        try {

            const conn = await database.generateConnection();
            const result = await conn.query(`SELECT service_hour_id FROM services
                INNER JOIN schedule ON services.id = schedule.service_id
                WHERE schedule.service_id = $1
                AND schedule.service_day_id = $2 
                AND date = $3`, [serviceId, serviceDayId, date]);
            return result.rows;

        } catch (error) {
            throw new Error(error);
        }
    }

}

export default HourRepository;