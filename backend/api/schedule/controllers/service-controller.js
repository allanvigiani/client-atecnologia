
/**
 * Classe reponsável pelos serviços
 * @date 05/03/2024 - 22:53:11
 *
 * @class ServiceController
 * @typedef {ServiceController}
 */
class ServiceController {

    constructor(serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    /**
     * Método responsável por criar o serviço
     * @date 05/03/2024 - 22:57:44
     *
     * @async
     * @param {json} body
     * @param {integer} companyId
     * @returns {json}
     */
    async createService(body, companyId) {
        try {
            const { name, professional_name, price, times } = body;

            if (!name || !price) {
                const errorMessage = `Campos não recebidos.`;
                return { message: errorMessage, status: 400 };
            }

            const verifyExistingService = await this.serviceRepository.getServiceByName(name, companyId);

            if (!verifyExistingService) {
                const errorMessage = `Já existe um serviço cadastrada com esse nome.`;
                return { message: errorMessage, status: 404 };
            }

            const service = {
                name: name,
                professional_name: professional_name,
                price: parseFloat(price),
                company_id: companyId,
            }

            const result = await this.serviceRepository.createService(service);
            if (!result) {
                const errorMessage = `Erro ao cadastrar serviço. Tente novamente mais tarde`;
                return { message: errorMessage, status: 500 };
            }

            const promises = times.map(async (e) => {
                const hours = {
                    start_time: e.start_time,
                    end_time: e.end_time,
                    service_id: result.id
                };

                return this.createServiceHours(hours);
            });

            await Promise.all(promises);

            return { id: { result }, message: `Serviço cadastrado com sucesso!`, status: 201 };
        } catch (error) {
            return { message: error.message, status: 500 };
        }
    }

    /**
     * Método responsável por deletar um serviço
     * @date 05/03/2024 - 22:59:23
     *
     * @async
     * @param {integer} serviceId
     * @param {integer} companyId
     * @returns {json}
     */
    async deleteService(serviceId, companyId) {
        try {

            if (!serviceId || !companyId) {
                const errorMessage = `ID do serviço ou da empresa não passado.`;
                return { message: errorMessage, status: 400 };
            }

            const result = await this.serviceRepository.deleteServiceHour(serviceId);
            if (!result) {
                const errorMessage = `Erro ao deletar serviço. Tente novamente mais tarde`;
                return { message: errorMessage, status: 500 };
            }

            await this.serviceRepository.deleteService(serviceId, companyId);

            return { message: `Serviço deletado com sucesso!`, status: 201 };
        } catch (error) {
            return { message: error.message, status: 500 };
        }
    }

    /**
     * Método responsável por buscar um serviço
     * @date 05/03/2024 - 22:59:57
     *
     * @async
     * @param {integer} serviceId
     * @param {integer} companyId
     * @returns {json}
     */
    async getServices(serviceId, companyId) {
        try {
            let result;
            if (serviceId) {
                result = await this.serviceRepository.getServiceById(serviceId, companyId);
            } else {
                result = await this.serviceRepository.getAllServices(companyId);
            }

            return { message: { result }, status: 200 };
        } catch (error) {
            return { message: error.message, status: 500 };
        }
    }

    /**
     * Método responsável por criar o vínculo do serviço com a hora
     * @date 05/03/2024 - 23:01:34
     *
     * @async
     * @param {json} body
     * @returns {json}
     */
    async createServiceHours(body) {
        try {
            const { start_time, end_time, service_id } = body;

            if (!start_time || !end_time) {
                const errorMessage = `Campos não recebidos.`;
                return { message: errorMessage, status: 400 };
            }

            if (!service_id) {
                const errorMessage = `ID do serviço não encontrado ou não foi passado.`;
                return { message: errorMessage, status: 400 };
            }

            const verifyExistingService = await this.serviceRepository.getServiceInHour(start_time, end_time, service_id);

            if (!verifyExistingService) {
                const errorMessage = `Já existe hora para esse serviço.`;
                return { message: errorMessage, status: 500 };
            }

            const serviceHour = {
                start_time: start_time,
                end_time: end_time,
                service_id: service_id
            }

            const result = await this.serviceRepository.createServiceHour(serviceHour);
            if (!result) {
                const errorMessage = `Erro ao cadastrar horário serviço. Tente novamente mais tarde.`;
                return { message: errorMessage, status: 500 };
            }

            return { message: `Horário do serviço cadastrado com sucesso!`, status: 201 };
        } catch (error) {
            return { message: error.message, status: 500 };
        }
    }

    /**
     * Método que busca as horas
     * @date 05/03/2024 - 23:02:09
     *
     * @async
     * @param {integer} serviceId
     * @param {integer} companyId
     * @returns {json}
     */
    async getServiceHours(serviceId, companyId) {
        try {

            const result = await this.serviceRepository.getServiceHourById(serviceId, companyId);
            if (!result) {
                const errorMessage = `Erro ao buscar os horários do serviço. Tente novamente mais tarde`;
                return { message: errorMessage, status: 500 };
            }

            return { message: { result }, status: 201 };
        } catch (error) {
            return { message: error.message, status: 500 };
        }
    }

    /**
     * Deleta o vínculo de um serviço com hora
     * @date 05/03/2024 - 23:09:07
     *
     * @async
     * @param {integer} serviceHourId
     * @returns {json}
     */
    async deleteServiceHour(serviceHourId) {
        try {

            if (!serviceHourId) {
                const errorMessage = `ID do serviço.`;
                return { message: errorMessage, status: 400 };
            }

            const result = await this.serviceRepository.deleteServiceHour(serviceHourId);
            if (!result) {
                const errorMessage = `Erro ao deletar serviço. Tente novamente mais tarde`;
                return { message: errorMessage, status: 500 };
            }

            return { message: `Serviço deletado com sucesso!`, status: 201 };
        } catch (error) {
            return { message: error.message, status: 500 };
        }
    }

    /**
     * Busca todos os serviços de uma empresa
     * @date 05/03/2024 - 23:09:42
     *
     * @async
     * @param {integer} companyId
     * @returns {json}
     */
    async getServicesByCompany(companyId) {
        try {

            if (!companyId) {
                const errorMessage = `ID da empresa não informada.`;
                return { message: errorMessage, status: 400 };
            }

            const services = await this.serviceRepository.getAllServicesByCompany(companyId);
            if (!services) {
                const errorMessage = `Erro ao buscar os serviços da empresa.`;
                return { message: errorMessage, status: 500 };
            }

            return { message: services, status: 201 };
        } catch (error) {
            return { message: error.message, status: 500 };
        }
    }

    /**
     * Busca todos os agendamentos da empresa
     * @date 05/03/2024 - 23:11:05
     *
     * @async
     * @param {integer} companyId
     * @returns {json}
     */
    async getScheduledServicesByCompany(companyId) {
        try {

            if (!companyId) {
                const errorMessage = `ID da empresa não informada.`;
                return { message: errorMessage, status: 400 };
            }

            const services = await this.serviceRepository.getAllScheduledServicesByCompany(companyId);
            if (!services) {
                const errorMessage = `Erro ao buscar os serviços da empresa.`;
                return { message: errorMessage, status: 500 };
            }

            return { message: services, status: 201 };
        } catch (error) {
            return { message: error.message, status: 500 };
        }
    }

}

export default ServiceController;