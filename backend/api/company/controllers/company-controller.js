import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

import CompanyRepository from "../repositories/company-repository.js";

const companyRepository = new CompanyRepository();

dotenv.config();

class CompanyController {

    constructor() {
        this.companyRepository = companyRepository;
        this.saltRandsPassword = 10;
    }

    async createCompany(body) {
        try { 
            const { name, email, password, address } = body;

            if (!name || !email || !password) {
                const errorMessage = `Campos não recebidos.`;
                return {message: errorMessage, status: 400};
            }

            const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            if (!regexEmail.test(email)) {
                const errorMessage = `Email não é válido.`;
                return {message: errorMessage, status: 400};
            }

            const verifyExistingCompany = await this.companyRepository.getCompanyByEmail(email);

            if (!verifyExistingCompany){
                const errorMessage = `Já existe uma empresa cadastrada com esse email.`;
                return {message: errorMessage, status: 500};
            }

            const hash = await bcrypt.hash(password, this.saltRandsPassword);

            const company = {
                name: name,
                email: email,
                password: hash,
                address: address,
                created_at: new Date(),
            }

            const result = this.companyRepository.createCompany(company);
            if (!result){
                const errorMessage = `Erro ao cadastrar empresa.`;
                return {message: errorMessage, status: 500};
            }

            return {message: `Empresa cadastrada com sucesso!`, status: 201};
        } catch (error) {
            return {message: error, status: 500};
        }
    }

}

export default CompanyController;