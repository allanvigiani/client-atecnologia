import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

import crypto from 'crypto';
import nodemailer from 'nodemailer';
import * as fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';

// Resolve __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import SMTP_CONFIG from '../config/smtp.js';

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

            if (!name || !email || !password || !address || !contact_phone) {
                const errorMessage = `Campos não recebidos.`;
                return { message: errorMessage, status: 400 };
            }

            const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            if (!regexEmail.test(email)) {
                const errorMessage = `Email não é válido.`;
                return { message: errorMessage, status: 400 };
            }

            const verifyExistingUser = await this.userRepository.getUserByEmail(email);

            if (verifyExistingUser) {
                const errorMessage = `Já existe um usuário cadastrado com esse email.`;
                return { message: errorMessage, status: 422 };
            }

            const hash = await bcrypt.hash(password, this.saltRandsPassword);

            const user = {
                name: name,
                email: email,
                password: hash,
                address: address ? address : null,
                contact_phone: contact_phone ? contact_phone : null,
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
    async changeUserInformation(body, companyId) {
        try {

            const { name, contact_phone, address } = body;

            if (!name && !contact_phone && !address) {
                const errorMessage = `Nenhum dado recebido para atualização.`;
                return { message: errorMessage, status: 400 };
            }

            if (!companyId) {
                const errorMessage = `Não foi recebido o ID da empresa.`;
                return { message: errorMessage, status: 400 };
            }

            const updated = this.userRepository.updateUserInformation(body, companyId);

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

    async sendEmailToResetPassword(body) {

        const { email } = body;

        if (!email) {
            const errorMessage = `Preencha o email para enviar o email de recuperação de senha.`;
            return { message: errorMessage, status: 400 };
        }

        const user = await this.userRepository.getUserByEmail(email);
        if (!user) {
            const errorMessage = `Email não encontrado.`;
            return { message: errorMessage, status: 400 };
        }

        const resetToken = Math.floor(1000 + Math.random() * 9000);

        await this.userRepository.createResetPasswordToken(email, resetToken);

        const SMTP_TRANSPORTER = nodemailer.createTransport({
            host: SMTP_CONFIG.host,
            port: SMTP_CONFIG.port,
            auth: {
                user: SMTP_CONFIG.user,
                pass: SMTP_CONFIG.password
            }
        });

        const templatePath = path.join(__dirname, '../reset-password-template.html');
        let templateHtml = fs.readFileSync(templatePath).toString();

        templateHtml = templateHtml.replace(/{{ password_code }}/g, resetToken);

        const mailData = {
            from: {
                name: "AgendAi",
                address: "agendai.support@gmail.com",
            },
            replyTo: email,
            to: email,
            subject: "Recuperação de Senha - APP.",
            html: templateHtml,
        };

        await new Promise((resolve, reject) => {
            SMTP_TRANSPORTER.sendMail(mailData, (err, info) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(info);
                }
            });
        });

        return {
            message: {
                success: `Email enviado com sucesso!`
            },
            status: 200
        };
    }

    async verifyCode(email, code) {
        try {

            if (!email) {
                const errorMessage = `Email não passado como parâmetro.`;
                return { message: errorMessage, status: 400 };
            }

            if (!code) {
                const errorMessage = `Código não passado como parâmetro.`;
                return { message: errorMessage, status: 400 };
            }

            const user = await this.userRepository.getUserByEmail(email);
            if (!user) {
                const errorMessage = `Email não cadastrado.`;
                return { message: errorMessage, status: 400 };
            }

            const resetCode = await this.userRepository.getResetPasswordCode(email, code);
            if (!resetCode) {
                const errorMessage = `Código inválido.`;
                return { message: errorMessage, status: 400 };
            }

            const expiredAt = resetCode.expired_at;

            if (expiredAt < new Date()) {
                const errorMessage = `Código expirado.`;
                return { message: errorMessage, status: 400 };
            }

            return {
                message: {
                    success: `Código válido!`
                },
                status: 200
            };
        } catch (error) {
            console.error('Erro ao verificar o código:', error);
            return { message: 'Erro interno do servidor', status: 500 };
        }
    }

    async resetPassword(body) {
        try {
            const { email, code, password } = body;

            if (!email) {
                const errorMessage = `Email não passado como parâmetro.`;
                return { message: errorMessage, status: 400 };
            }

            if (!code) {
                const errorMessage = `Código não passado como parâmetro.`;
                return { message: errorMessage, status: 400 };
            }

            const user = await this.userRepository.getUserByEmail(email);
            if (!user) {
                const errorMessage = `Email não cadastrado.`;
                return { message: errorMessage, status: 400 };
            }

            const resetCode = await this.userRepository.getResetPasswordCode(email, code);
            if (!resetCode) {
                const errorMessage = `Código inválido.`;
                return { message: errorMessage, status: 400 };
            }

            const expiredAt = resetCode.expired_at;

            if (expiredAt < new Date()) {
                const errorMessage = `Código expirado.`;
                return { message: errorMessage, status: 400 };
            }

            const hash = await bcrypt.hash(password, this.saltRandsPassword);

            await this.userRepository.updateUserPassword(email, hash);

            await this.userRepository.deleteResetPasswordCode(email);

            return {
                message: {
                    success: `Senha alterada com sucesso!`
                },
                status: 200
            };
        } catch (error) {
            console.error('Erro ao resetar a senha:', error);
            return { message: 'Erro interno do servidor', status: 500 };
        }
    }

}

export default UserController;