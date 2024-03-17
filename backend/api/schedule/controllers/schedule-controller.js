/**
 * Classe responsável pelo agendamento dos serviços
 * @date 05/03/2024 - 22:49:47
 *
 * @class ScheduleController
 * @typedef {ScheduleController}
 */
class ScheduleController {

    constructor(scheduleRepository, queueRepository) {
        this.scheduleRepository = scheduleRepository;
        this.queueRepository = queueRepository
    }

    /**
     * Método responsável por criar o agendamento
     * @date 05/03/2024 - 22:51:16
     *
     * @async
     * @param {json} body
     * @returns {unknown}
     */
    async createSchedule(body) {
        // TODO esse método será um service (create-schedule)
        try {
            const { service_id, service_hour_id, schedule_date, client_name, client_contact, client_email, company_id } = body;

            if (!service_id || !service_hour_id || !client_name || !client_email || !schedule_date) {
                const errorMessage = `Campos não recebidos.`;
                return { message: errorMessage, status: 400 };
            }

            if (!company_id) {
                const errorMessage = `ID da empresa não foi passado.`;
                return { message: errorMessage, status: 400 };
            }

            const schedule = {
                service_id: service_id,
                service_hour_id: service_hour_id,
                created_at: new Date(),
                client_name: client_name,
                client_contact: client_contact != undefined ? client_contact : null,
                client_email: client_email,
                company_id: company_id,
                status: 1,
                schedule_date: schedule_date,
            }

            // Escuta a fila do rabbitMQ user/schedule_information
            const data = await this.queueRepository.consumeQueue('user/schedule_information');

            const result = await this.scheduleRepository.createSchedule(data);
            if (!result) {
                const errorMessage = `Erro ao agendar o serviço. Tente novamente mais tarde`;
                return { message: errorMessage, status: 500 };
            }

            const email = await this.sendConfirmationEmail(body);
            if (!email) {
                const errorMessage = `Erro ao agendar o serviço. Tente novamente mais tarde`;
                return { message: errorMessage, status: 500 };
            }

            return { message: `Serviço agendado com sucesso!`, status: 201 };
        } catch (error) {
            return { message: error.message, status: 500 };
        }
    }

    /**
     * Método responsável por enviar o email de confirmação do agendamento
     * @date 05/03/2024 - 22:51:36
     *
     * @async
     * @param {json} body
     * @returns {unknown}
     */
    async sendConfirmationEmail(body) {
        try {
            const urlEmail = 'http://localhost:3004/schedule-confirmation/send-email/';

            const config = {
                headers: {
                    'Content-Type': 'application/json'
                },
            }

            // TODO -> Mudar para QrCode com informações do agendamento para ser escaneados

            const company = await this.scheduleRepository.getCompanyById(body.company_id);
            const service = await this.scheduleRepository.getServiceById(body.service_id, body.company_id);
            const service_hour = await this.scheduleRepository.getServiceHourById(body.service_hour_id);

            const fields = {
                company_name: company.name,
                company_email: company.email,
                company_address: company.address,
                client_name: body.client_name,
                client_email: body.client_email,
                service_id: body.service_id,
                service_name: service.name,
                service_hour: service_hour.start_time,
                professional_name: service.professional_name
            }

            // const { data } = await axios.post(urlEmail, fields, config);

            return { message: `${data.message}`, status: 201 };
        } catch (error) {
            return { message: error.message, status: 500 };
        }
    }
}

export default ScheduleController;