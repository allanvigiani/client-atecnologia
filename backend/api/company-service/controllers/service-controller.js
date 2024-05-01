
/**
 * Classe reponsável pelos serviços
 * @date 05/03/2024 - 22:53:11
 *
 * @class ServiceController
 * @typedef {ServiceController}
 */
class ServiceController {

    constructor(serviceRepository, hourRepository, dayRepository, typeRepository) {
        this.serviceRepository = serviceRepository;
        this.hourRepository = hourRepository;
        this.dayRepository = dayRepository;
        this.typeRepository = typeRepository;
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
            const { name, professional_name, price, service_type_id, other_service_type, service_hours_id, service_days_id } = body;

            if (!name || !price || !service_type_id || !service_hours_id || !service_days_id) {
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
                service_type_id: service_type_id,
                other_service_type: other_service_type == '' ? null : other_service_type,
                service_hours_id: JSON.stringify(service_hours_id),
                service_days_id: JSON.stringify(service_days_id)
            }

            const result = await this.serviceRepository.createService(service);
            if (!result) {
                const errorMessage = `Erro ao cadastrar serviço. Tente novamente mais tarde`;
                return { message: errorMessage, status: 500 };
            }

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

            await this.serviceRepository.deleteService(serviceId, companyId);

            return { message: `Serviço deletado com sucesso!`, status: 201 };
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
     * @returns {json}
     */
    async updateService(body) {
        try {

            const { id, name, professional_name, price, service_type_id, service_hours_id, service_days_id, company_id } = body;

            if (!name || !professional_name || !price || !service_type_id || !service_hours_id || !service_days_id) {
                const errorMessage = `Campos não recebidos.`;
                return { message: errorMessage, status: 400 };
            }

            const service = {
                id: id,
                name: name,
                professional_name: professional_name,
                price: parseFloat(price),
                company_id: company_id,
                service_type_id: service_type_id,
                service_hours_id: JSON.stringify(service_hours_id),
                service_days_id: JSON.stringify(service_days_id)
            }

            await this.serviceRepository.updateService(service, company_id);

            return { message: `Serviço Atualizado com sucesso!`, status: 201 };
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
                result = await this.serviceRepository.getAllServices();
            }

            return { message: { result }, status: 200 };
        } catch (error) {
            return { message: error.message, status: 500 };
        }
    }

    /**
     * Lista todas as horas disponíveis
     * @date 05/03/2024 - 23:02:09
     *
     * @async
     * @param {integer} companyId
     * @returns {json}
     */
    async getHours() {
        try {

            const result = await this.hourRepository.getHours();
            if (!result) {
                const errorMessage = `Erro ao buscar os horários. Tente novamente mais tarde`;
                return { message: errorMessage, status: 500 };
            }

            return { message: { result }, status: 201 };
        } catch (error) {
            return { message: error.message, status: 500 };
        }
    }

    /**
     * Lista todas as horas disponíveis por ID
     * @date 05/03/2024 - 23:02:09
     * 
     * @async
     * 
     * @param {integer} dayId
     * @returns {json}   
      */
    async getHoursByService(serviceId, companyId) {
        try {

            const hours = await this.hourRepository.getHoursByService(serviceId, companyId);

            if (!hours) {
                const errorMessage = `Erro ao buscar os as horas do serviço. Tente novamente mais tarde!`;
                return { message: errorMessage, status: 500 };
            }

            const hoursToArray = JSON.parse(hours.service_hours_id);

            hoursToArray.sort((a, b) => a - b);

            const hoursToResponse = {};

            for (const element of hoursToArray) {
                const hour = await this.hourRepository.getHour(element);
                hoursToResponse[hour.id] = hour.start_time;
            }

            return { message: hoursToResponse, status: 201 };
        } catch (error) {
            return { message: error.message, status: 500 };
        }
    }

    /**
     * Lista todos os dias
     * @date 05/03/2024 - 23:02:09
     *
     * @async
     * @param {integer} companyId
     * @returns {json}
     */
    async getDays() {
        try {

            const result = await this.dayRepository.getDays();
            if (!result) {
                const errorMessage = `Erro ao buscar os dias. Tente novamente mais tarde`;
                return { message: errorMessage, status: 500 };
            }

            return { message: { result }, status: 201 };
        } catch (error) {
            return { message: error.message, status: 500 };
        }
    }

    /**
     * Lista todos os dias por ID
     * @date 05/03/2024 - 23:02:09
     * 
     * @async
     * 
     * @param {integer} dayId
     * @returns {json}
     * 
    */
    async getDaysByService(serviceId, companyId) {
        try {

            const days = await this.dayRepository.getDaysByService(serviceId, companyId);

            if (!days) {
                const errorMessage = `Erro ao buscar os dias do serviço. Tente novamente mais tarde!`;
                return { message: errorMessage, status: 500 };
            }

            const daysToArray = JSON.parse(days.service_days_id);

            daysToArray.sort((a, b) => a - b);

            const daysToResponse = {};

            for (const element of daysToArray) {
                const day = await this.dayRepository.getDay(element);
                daysToResponse[day.id] = day.description;
            }

            return { message: daysToResponse, status: 201 };
        } catch (error) {
            return { message: error.message, status: 500 };
        }
    }

    /**
     * Lista todos os tipos
     * @date 05/03/2024 - 23:02:09
     *
     * @async
     * @returns {json}
     */
    async getTypes() {
        try {

            const result = await this.typeRepository.getTypes();
            if (!result) {
                const errorMessage = `Erro ao buscar os tipos de serviço. Tente novamente mais tarde`;
                return { message: errorMessage, status: 500 };
            }

            return { message: { result }, status: 201 };
        } catch (error) {
            return { message: error.message, status: 500 };
        }
    }

    /**
    * Lista tipos de serviço por ID
    * @date 05/03/2024 - 23:02:09
    *
    * @async
    * @returns {json}
    */
    async getTypesById(typesId) {
        try {

            const result = await this.typeRepository.getTypesById(typesId);
            if (!result) {
                const errorMessage = `Erro ao buscar o tipos de serviço. Tente novamente mais tarde`;
                return { message: errorMessage, status: 500 };
            }

            return { message: { result }, status: 201 };
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