import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';

import AuthRepository from "../repositories/auth-repository.js";
const authRepository = new AuthRepository();

dotenv.config();

class AuthController {

    constructor() {
        this.authRepository = authRepository;
    }

    async login(body) {
        try { 
            const { email, password } = body;

            if (!email || !password) {
                const errorMessage = `Preencha o email e a senha para realizar o Login.`;
                return {message: errorMessage, status: 400};
            }

            const user = await this.authRepository.getUserByEmail(email);
            if (!user){
                const errorMessage = `Email ou senha incorretos.`;
                return {message: errorMessage, status: 400};
            }

            const passwordIsValid = await bcrypt.compare(password, user.hash_password);
            if (!passwordIsValid){
                const errorMessage = `Email ou senha incorretos.`;
                return {message: errorMessage, status: 400};
            }

            const verifyLoginSession = await this.authRepository.getUserSession(user.id);
            if (verifyLoginSession) {
                
                const now = new Date();
                const timestampDate = new Date(verifyLoginSession.start_login);

                const differenceInDays = (now - timestampDate) / (24 * 60 * 60 * 1000);

                if (differenceInDays > 1) {
                    await this.authRepository.deleteUserSession(verifyLoginSession.id);
                } else {

                    const token = verifyLoginSession.token;

                    return {
                        message: {
                          success: `Usuário já está logado!`,
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
            
            await this.authRepository.createUserSession(id, token);

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
            return {message: error, status: 500};
        }
    }

    async logout(userData) {
        try { 

            await this.authRepository.deleteUserSessionByUserId(userData.payload.id);

            return {
                message: {
                  success: `Logout realizado!`
                },
                status: 200
            };
        
        } catch (error) {
            return {message: error, status: 500};
        }
    }

}

export default AuthController;