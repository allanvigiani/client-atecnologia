import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Classe responsável por todas as funcionalidades relaciodadas ao usuário
 * @date 05/03/2024 - 22:30:04
 *
 * @class UserController
 * @typedef {UserController}
 */
class UserController {

    constructor(userRepository) {
        this.userRepository = userRepository;
        this.saltRandsPassword = 10;
    }

    /**
     * Método responsável por criar o usuário
     * @date 05/03/2024 - 22:30:38
     *
     * @async
     * @param {json} body
     * @returns {unknown}
     */
    async createUser(body) {
        try {
            const { name, email, password, address, contact_phone } = body;

            if (!name || !email || !password) {
                const errorMessage = `Campos não recebidos.`;
                return { message: errorMessage, status: 400 };
            }

            const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            if (!regexEmail.test(email)) {
                const errorMessage = `Email não é válido.`;
                return { message: errorMessage, status: 400 };
            }

            const verifyExistingUser = await this.userRepository.getUserByEmail(email);

            if (!verifyExistingUser) {
                const errorMessage = `Já existe um usuário cadastrado com esse email.`;
                return { message: errorMessage, status: 422 };
            }

            const hash = await bcrypt.hash(password, this.saltRandsPassword);

            const user = {
                name: name,
                email: email,
                password: hash,
                address: address,
                contact_phone: contact_phone,
                created_at: new Date(),
            }

            const result = this.userRepository.createUser(user);
            if (!result) {
                const errorMessage = `Erro ao cadastrar usuário.`;
                return { message: errorMessage, status: 404 };
            }

            return { message: `Usuário cadastrado com sucesso!`, status: 201 };
        } catch (error) {
            return { message: error.message, status: 500 };
        }
    }

    /**
     * Método responsável por mudar informações do usuário
     * @date 05/03/2024 - 22:38:10
     *
     * @async
     * @param {json} body
     * @returns {unknown}
     */
    async changeUserInformation(body) {
        try {
            return { message: `Dados alterados com sucesso!`, status: 201 };
        } catch (error) {
            return { message: error.message, status: 500 };
        }
    }

    /**
     * Método que busca um usuário
     * @date 05/03/2024 - 22:41:15
     *
     * @async
     * @param {integer} userId
     * @returns {unknown}
     */
    async getUserInformation(userId) {
        try {

            const user = await this.userRepository.getUserById(userId);

            if (!user) {
                const errorMessage = `Usuário não encontrada na nossa base de dados.`;
                return { message: errorMessage, status: 404 };
            }

            return { message: user, status: 200 };
        } catch (error) {
            return { message: error.message, status: 500 };
        }
    }

}

export default UserController;