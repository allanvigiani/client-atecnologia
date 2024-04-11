import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';

import UserAuthRepository from "../repositories/user-auth-repository.js";
const userAuthRepository = new UserAuthRepository();

dotenv.config();

/**
 * Método responsável por autenticação
 * @date 05/03/2024 - 22:26:37
 *
 * @async
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {unknown}
 */
const authenticateToken = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  const [, token] = authorizationHeader?.split(' ');

  const verifyIfTokenIsRevoged = await userAuthRepository.verifyRevogedToken(token);
  if (verifyIfTokenIsRevoged.length !== 0) {
    return res.status(401).json({ error: 'Token fornecido é inválido' });
  }

  try {

    const decodedToken = jwt.verify(token, process.env.AUTH_SECRET);

    if (!decodedToken) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    req.user = decodedToken;

  } catch (error) {
    return { message: error.message, status: 500 };
  }

  return next();
};

export default authenticateToken;