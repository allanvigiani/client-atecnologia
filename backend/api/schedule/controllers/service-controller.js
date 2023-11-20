class ServiceController {

    constructor(serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    async createService(body, companyId) {
        try { 
            const { name, professional_name, price } = body;

            if (!name || !price) {
                const errorMessage = `Campos não recebidos.`;
                return {message: errorMessage, status: 400};
            }

            const verifyExistingService = await this.serviceRepository.getServiceByName(name);

            if (!verifyExistingService){
                const errorMessage = `Já existe um serviço cadastrada com esse nome.`;
                return {message: errorMessage, status: 404};
            }

            const service = {
                name: name,
                professional_name: professional_name,
                price: parseFloat(price),
                company_id: companyId,
            }

            const result = await this.serviceRepository.createService(service);
            if (!result){
                const errorMessage = `Erro ao cadastrar serviço. Tente novamente mais tarde`;
                return {message: errorMessage, status: 500};
            }

            // TODO tratar o recebimento dos horários do serviço.
            // Chamar o método createServiceHours.

            return {message: `Serviço cadastrado com sucesso!`, status: 201};
        } catch (error) {
            return {message: error.message, status: 500};
        }
    }

    async deleteService(serviceId, companyId) {
        try {

            if (!serviceId || !companyId) {
                const errorMessage = `ID do serviço ou da empresa não passado.`;
                return {message: errorMessage, status: 400};
            }

            const result = await this.serviceRepository.deleteService(serviceId, companyId);
            if (!result){
                const errorMessage = `Erro ao deletar serviço. Tente novamente mais tarde`;
                return {message: errorMessage, status: 500};
            }

            return {message: `Serviço deletado com sucesso!`, status: 201};
        } catch (error) {
            return {message: error.message, status: 500};
        }
    }

    async getServices(serviceId, companyId) {
        try {
            let result;
            if (serviceId) {
                result = await this.serviceRepository.getServiceById(serviceId, companyId);
            }else {
                result = await this.serviceRepository.getAllServices(companyId);
            }

            return {message: {result}, status: 200};
        } catch (error) {
            return {message: error.message, status: 500};
        }
    }

    async createServiceHours(body) {
        try { 
            const { start_time, end_time, service_id } = body;

            if (!start_time || !end_time) {
                const errorMessage = `Campos não recebidos.`;
                return {message: errorMessage, status: 400};
            }

            if (!service_id) {
                const errorMessage = `ID do serviço não encontrado ou não foi passado.`;
                return {message: errorMessage, status: 400};
            }

            const verifyExistingService = await this.serviceRepository.getServiceInHour(start_time, end_time, service_id);

            if (!verifyExistingService){
                const errorMessage = `Já existe hora para esse serviço.`;
                return {message: errorMessage, status: 500};
            }

            const serviceHour = {
                start_time: start_time,
                end_time: end_time,
                service_id: service_id
            }

            const result = await this.serviceRepository.createServiceHour(serviceHour);
            if (!result){
                const errorMessage = `Erro ao cadastrar horário serviço. Tente novamente mais tarde.`;
                return {message: errorMessage, status: 500};
            }

            return {message: `Horário do serviço cadastrado com sucesso!`, status: 201};
        } catch (error) {
            return {message: error.message, status: 500};
        }
    }

    async getServiceHours(serviceId, companyId) {
        try {

            const result = await this.serviceRepository.getServiceHourById(serviceId, companyId);
            if (!result){
                const errorMessage = `Erro ao buscar os horários do serviço. Tente novamente mais tarde`;
                return {message: errorMessage, status: 500};
            }

            return {message: {result}, status: 201};
        } catch (error) {
            return {message: error.message, status: 500};
        }
    }

    async deleteServiceHour(serviceHourId) {
        try {

            if (!serviceHourId) {
                const errorMessage = `ID do serviço.`;
                return {message: errorMessage, status: 400};
            }

            const result = await this.serviceRepository.deleteServiceHour(serviceHourId);
            if (!result){
                const errorMessage = `Erro ao deletar serviço. Tente novamente mais tarde`;
                return {message: errorMessage, status: 500};
            }

            return {message: `Serviço deletado com sucesso!`, status: 201};
        } catch (error) {
            return {message: error.message, status: 500};
        }
    }

    async getServicesByCompany(companyId) {
        try {

            if (!companyId) {
                const errorMessage = `ID da empresa não informada.`;
                return {message: errorMessage, status: 400};
            }

            const services = await this.serviceRepository.getAllServicesByCompany(companyId);
            if (!services){
                const errorMessage = `Erro ao buscar os serviços da empresa.`;
                return {message: errorMessage, status: 500};
            }

            return {message: services, status: 201};
        } catch (error) {
            return {message: error.message, status: 500};
        }
    }

}

export default ServiceController;