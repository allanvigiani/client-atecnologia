import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Classe responsável por todas as funcionalidades relaciodadas as empresas
 * @date 05/03/2024 - 22:30:04
 *
 * @class CompanyController
 * @typedef {CompanyController}
 */
class CompanyController {

    constructor(companyRepository) {
        this.companyRepository = companyRepository;
        this.saltRandsPassword = 10;
    }

    /**
     * Método responsável por criar a empresa
     * @date 05/03/2024 - 22:30:38
     *
     * @async
     * @param {json} body
     * @returns {unknown}
     */
    async createCompany(body) {
        try {
            const { name, email, password, address } = body;

            if (!name || !email || !password) {
                const errorMessage = `Campos não recebidos.`;
                return { message: errorMessage, status: 400 };
            }

            const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            if (!regexEmail.test(email)) {
                const errorMessage = `Email não é válido.`;
                return { message: errorMessage, status: 400 };
            }

            const verifyExistingCompany = await this.companyRepository.getCompanyByEmail(email);

            if (!verifyExistingCompany) {
                const errorMessage = `Já existe uma empresa cadastrada com esse email.`;
                return { message: errorMessage, status: 422 };
            }

            const hash = await bcrypt.hash(password, this.saltRandsPassword);

            const url_name = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

            const company = {
                name: name,
                email: email,
                password: hash,
                address: address,
                url_name: url_name,
                created_at: new Date(),
            }

            const result = this.companyRepository.createCompany(company);
            if (!result) {
                const errorMessage = `Erro ao cadastrar empresa.`;
                return { message: errorMessage, status: 404 };
            }

            return { message: `Empresa cadastrada com sucesso!`, status: 201 };
        } catch (error) {
            return { message: error.message, status: 500 };
        }
    }

    /**
     * Método responsável por mudar informações da empresa
     * @date 05/03/2024 - 22:38:10
     *
     * @async
     * @param {json} body
     * @returns {unknown}
     */
    async changeCompanyInformation(body, companyId) {
        try {

            // Tratar possibilidade de mudar EMAIL

            if (!companyId) {
                const errorMessage = `Não foi recebido o ID da empresa.`;
                return { message: errorMessage, status: 400 };
            }

            const updated = this.companyRepository.updateCompanyInformation(body, companyId);

            if (!updated) {
                const errorMessage = `Não foi possível atualizar os dados da empresa!`;
                return { message: errorMessage, status: 400 };
            }

            return { message: `Dados atualizados com sucesso!`, status: 201 };
        } catch (error) {
            return { message: error.message, status: 500 };
        }
    }

    /**
     * Método que busca uma empresa específica
     * @date 05/03/2024 - 22:41:15
     *
     * @async
     * @param {integer} userId
     * @returns {unknown}
     */
    async getCompanyInformation(userId) {
        try {

            const company = await this.companyRepository.getCompanyById(userId);

            if (!company) {
                const errorMessage = `Empresa não encontrada na nossa base de dados.`;
                return { message: errorMessage, status: 404 };
            }

            return { message: company, status: 200 };
        } catch (error) {
            return { message: error.message, status: 500 };
        }
    }

    /**
     * Método que busca todas as empresas
     * @date 05/03/2024 - 22:45:11
     *
     * @async
     * @param {string} companyUrl
     * @returns {unknown}
     */
    async getAllCompanies(companyUrl) {
        try {

            let result;

            if (!companyUrl) {
                result = await this.companyRepository.getAllCompanies();
            }

            if (!result) {
                const errorMessage = `Nenhuma empresa encontrada.`;
                return { message: errorMessage, status: 404 };
            }

            return { message: result, status: 200 };
        } catch (error) {
            return { message: error.message, status: 500 };
        }
    }

}

export default CompanyController;