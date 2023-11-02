import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'

dotenv.config();

function readToken(token) {
    try {
        return jwt.verify(token, process.env.AUTH_SECRET);
    } catch (error) {
        throw new Error(`Erro: ${error}`);
    }
}

export function validadeToken(token) {
    return readToken(token);
}
