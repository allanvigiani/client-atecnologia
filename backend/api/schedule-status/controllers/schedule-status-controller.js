
/**
 * Classe reponsável pelos serviços
 * @date 05/03/2024 - 22:53:11
 *
 * @class ScheduleStatusController
 * @typedef {ScheduleStatusController}
 */

class ScheduleStatusController{

    constructor(scheduleStatusRepository) {
        this.scheduleStatusRepository = scheduleStatusRepository;
    }

    /**
     * Método responsável por criar o serviço
     * @date 05/03/2024 - 22:57:44
     *
     * @async
     * @param id
     * @returns {json}
     */
    async createScheduleStatus(id) {
        try {

            if (!id) {
                const errorMessage = `ID do servico não informado.`;
                return { message: errorMessage, status: 400 };
            }

            const result = await this.scheduleStatusRepository.createScheduleStatus(id);
            if (!result) {
                return { message: `Erro ao criar status do agendamento.`, status: 500 };
            }
            return { id: { result }, message: `Serviço cadastrado com sucesso!`, status: 201 };
        } catch (error) {
            return { message: error.message, status: 500 };
        }
    }

    /**
     * Método responsável por deletar status do agendamento
     * @date 05/03/2024 - 22:59:23
     *
     * @async
     * @param {integer} serviceId
     * @returns {json}
     */
    async deleteScheduleStatus(serviceId) {
        try {

            if (!serviceId) {
                const errorMessage = `ID do serviço ou da empresa não passado.`;
                return { message: errorMessage, status: 400 };
            }

            const result = await this.scheduleStatusRepository.deleteScheduleStatus(serviceId);
            if (!result) {
                return { message: `Erro ao deletar o serviço.`, status: 500 };
            }

            return { message: `Serviço deletado com sucesso!`, status: 201 };
        } catch (error) {
            return { message: error.message, status: 500 };
        }
    }

    /**
     * Método responsável por mudar o status do serviço
     * @date 05/03/2024 - 22:59:23
     *
     * @async
     * @param {integer} serviceId
     * @returns {json}
     */
    async updateScheduleStatus(body) {
        try {

            const { schedule_id, status } = body;

            if (!body) {
                const errorMessage = `Dados do serviço não passado.`;
                return { message: errorMessage, status: 400 };
            }

            const verifyExistingSchedule = await this.scheduleStatusRepository.getScheduleByScheduleId(schedule_id);
            if (!verifyExistingSchedule) {
                return { message: `Serviço não encontrado.`, status: 404 };
            }

            const scheduleStatus = {
                schedule_id: schedule_id,
                status_id: status
            }

            const result = await this.scheduleStatusRepository.updateScheduleStatus(scheduleStatus);
            if (!result) {
                return { message: `Erro ao atualizar o serviço.`, status: 500 };
            }

            return { message: `Serviço Atualizado com sucesso!`, status: 201 };
        } catch (error) {
            return { message: error.message, status: 500 };
        }
    }

    /**
     * Busca todos os status do agendamento
     * @date 05/03/2024 - 23:09:42
     *
     * @async
     * @param {integer} companyId
     * @returns {json}
     */
    async getScheduleStatusByServiceId(scheduleId) {
        try {

            if (!scheduleId) {
                const errorMessage = `ID do agendamento não informado.`;
                return { message: errorMessage, status: 400 };
            }

            const schedules = await this.scheduleStatusRepository.getSchedulesByIdSchedule(scheduleId);
            if (!schedules) {
                const errorMessage = `Erro ao buscar os status dos agendamentos.`;
                return { message: errorMessage, status: 500 };
            }

            return { message: schedules, status: 201 };
        } catch (error) {
            return { message: error.message, status: 500 };
        }
    }

    /*
    * Busca todos os agendamentos do usuário
    * @date 05/03/2024 - 23:09:42
    * 
    * @async
    * @param {integer} companyId
    * @returns {json}
    */
    async getAppointmentsByUser(userId) {
        try {
            if (!userId) {
                const errorMessage = `ID do usuário não informado.`;
                return { message: errorMessage, status: 400 };
            }
            const schedules = await this.scheduleStatusRepository.getSchedulesByUserId(userId);

            if (!schedules) {
                const errorMessage = `Erro ao buscar os agendamentos.`;
                return { message: errorMessage, status: 500 };
            }

            return { message: schedules, status: 201 };
        } catch (error) {
            return { message: error.message, status: 500 };
        }
    }
}

export default ScheduleStatusController;