import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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
 * Classe que cuida de toda a autenticação backend do sistema.
 * @date 05/03/2024 - 22:22:53
 *
 * @class AuthController
 * @typedef {AuthController}
 */
class AuthController {

    constructor(authRepository) {
        this.authRepository = authRepository;
        this.saltRandsPassword = 10;
    }

    /**
     * Método responsável por validar o login do usuário
     * @date 05/03/2024 - 22:23:03
     *
     * @async
     * @param {json} body
     * @returns {json}
     */
    async login(body) {
        try {
            const { email, password } = body;

            if (!email || !password) {
                const errorMessage = `Preencha o email e a senha para realizar o Login.`;
                return { message: errorMessage, status: 400 };
            }

            const user = await this.authRepository.getCompanyByEmail(email);
            if (!user) {
                const errorMessage = `Email ou senha incorretos.`;
                return { message: errorMessage, status: 400 };
            }

            const passwordIsValid = await bcrypt.compare(password, user.password);
            if (!passwordIsValid) {
                const errorMessage = `Email ou senha incorretos.`;
                return { message: errorMessage, status: 400 };
            }

            const verifyLoginSession = await this.authRepository.getCompanySession(user.id);
            if (verifyLoginSession) {

                const now = new Date();
                const timestampDate = new Date(verifyLoginSession.start_login);

                const differenceInDays = (now - timestampDate) / (24 * 60 * 60 * 1000);

                if (differenceInDays > 1) {
                    await this.authRepository.deleteCompanySession(verifyLoginSession.id);
                } else {

                    const token = verifyLoginSession.token;

                    return {
                        message: {
                            success: `Usuário já está logado!`,
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            token
                        },
                        status: 200
                    };
                }

            }
            const id = user.id;
            const name = user.name;
            const payload = { id, name, email };

            const token = jwt.sign({ payload }, process.env.AUTH_SECRET, {
                expiresIn: process.env.AUTH_EXPIRES_IN,
            });

            await this.authRepository.createCompanySession(id, token);

            return {
                message: {
                    success: `Login realizado com sucesso!`,
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    token
                },
                status: 200
            };
        } catch (error) {
            return { message: error.message, status: 500 };
        }
    }

    /**
     * Método repsonsável por validar o logout do usuário
     * @date 05/03/2024 - 22:25:04
     *
     * @async
     * @param {json} userData
     * @returns {json}
     */
    async logout(userData) {
        try {
            await this.authRepository.deleteCompanySessionByUserId(userData.payload.id);

            return {
                message: {
                    success: `Logout realizado!`
                },
                status: 200
            };

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

        const user = await this.authRepository.getCompanyByEmail(email);
        if (!user) {
            const errorMessage = `Email não encontrado.`;
            return { message: errorMessage, status: 400 };
        }

        const resetToken = crypto.randomBytes(12).toString('hex').slice(0, 12);

        await this.authRepository.createResetPasswordToken(email, resetToken);

        if (!SMTP_CONFIG) {
            const errorMessage = `Configuração de SMTP não encontrada.`;
            return { message: errorMessage, status: 500 };
        }

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

        const resetPasswordUrl = `${process.env.RESET_EMAIL_URL}/${email}/${resetToken}`;

        templateHtml = templateHtml.replace(/{{ reset_password_url }}/g, resetPasswordUrl);

        const mailData = {
            from: {
                name: "Suporte - AgendAi",
                address: "agendai.support@gmail.com",
            },
            replyTo: email,
            to: email,
            subject: "Recuperação de Senha.",
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

    async resetPassword(body) {

        const { email, token, password } = body;

        if (!email) {
            const errorMessage = `Email não passado como parâmetro.`;
            return { message: errorMessage, status: 400 };
        }

        if (!token) {
            const errorMessage = `Token não passado como parâmetro.`;
            return { message: errorMessage, status: 400 };
        }

        const user = await this.authRepository.getCompanyByEmail(email);
        if (!user) {
            const errorMessage = `Email não cadastrado.`;
            return { message: errorMessage, status: 400 };
        }

        const resetToken = await this.authRepository.getResetPasswordToken(email, token);
        if (!resetToken) {
            const errorMessage = `Token inválido.`;
            return { message: errorMessage, status: 400 };
        }

        const expiredAt = resetToken.expired_at;

        if (expiredAt < new Date()) {
            const errorMessage = `Token expirado.`;
            return { message: errorMessage, status: 400 };
        }


        const hash = await bcrypt.hash(password, this.saltRandsPassword);

        await this.authRepository.updateCompanyPassword(email, hash);

        await this.authRepository.deleteResetPasswordToken(email);

        return {
            message: {
                success: `Senha alterada com sucesso!`
            },
            status: 200
        };
    }

}

export default AuthController;