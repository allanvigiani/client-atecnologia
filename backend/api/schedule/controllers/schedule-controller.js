import ScheduleRepository from "../repositories/schedule-repository.js";

const scheduleRepository = new ScheduleRepository();

class ScheduleController {

    constructor() {
        this.scheduleRepository = scheduleRepository;
    }

    async createSchedule(body, companyId) {
        try { 
            const { service_id, service_hour_id, client_name, client_contact, client_email } = body;

            if (!service_id || !service_hour_id || !client_name || !client_email) {
                const errorMessage = `Campos não recebidos.`;
                return {message: errorMessage, status: 400};
            }

            if (!companyId) {
                const errorMessage = `ID da empresa não foi passado.`;
                return {message: errorMessage, status: 400};
            }

            const schedule = {
                service_id: service_id,
                service_hour_id: service_hour_id,
                created_at: new Date(),
                client_name: client_name,
                client_contact: client_contact != undefined ? client_contact : null,
                client_email: client_email,
                company_id: companyId,
                status: 1
            }

            const result = this.scheduleRepository.createSchedule(schedule);
            if (!result){
                const errorMessage = `Erro ao cadastrar serviço. Tente novamente mais tarde`;
                return {message: errorMessage, status: 500};
            }

            return {message: `Serviço cadastrado com sucesso!`, status: 201};
        } catch (error) {
            return {message: error, status: 500};
        }
    }

}

export default ScheduleController;