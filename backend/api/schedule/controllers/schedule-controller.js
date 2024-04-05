/**
 * Classe responsável pelas informações do agendamento dos serviços
 * @date 05/03/2024 - 22:49:47
 *
 * @class ScheduleController
 * @typedef {ScheduleController}
 */
class ScheduleController {

    constructor(scheduleRepository, queueRepository) {
        this.scheduleRepository = scheduleRepository;
        this.queueRepository = queueRepository;
    }

    /**
     * Envia os dados do agendamento para a fila user/schedule_information
     * @date 05/03/2024 - 22:51:16
     *
     * @async
     * @param {json} body
     * @param {integer} userId
     * @returns {unknown}
     */
    async sendScheduleToQueue(body, userId) {
        try {
            const { company_id, service_id, service_hour_id, service_day_id } = body;

            if (!service_id || !service_hour_id || !service_day_id) {
                const errorMessage = `Campos não recebidos.`;
                return { message: errorMessage, status: 400 };
            }

            if (!company_id) {
                const errorMessage = `ID da empresa não foi passado.`;
                return { message: errorMessage, status: 400 };
            }

            if (!userId) {
                const errorMessage = `ID do usuário não foi passado.`;
                return { message: errorMessage, status: 400 };
            }

            const message = {
                company_id: company_id,
                user_id: userId,
                service_id: service_id,
                service_hour_id: service_hour_id,
                service_day_id: service_day_id,
                created_at: new Date()
            }

            const queue = "user/schedule_information";
            await this.queueRepository.sendToQueue(queue, message);

            return { message: `Informações do serviço enviados para a fila!`, status: 200 };
        } catch (error) {
            return { message: error.message, status: 500 };
        }
    }

}

export default ScheduleController;