import express from 'express';
import authenticateToken from '../middleware/auth.js';
import AuthController from '../controllers/auth-controller.js';

import AuthRepository from '../repositories/auth-repository.js';
const authRepository = new AuthRepository();

const authController = new AuthController(authRepository);

const router = express.Router();

router.post('/login', async (req, res) => {
    const result = await authController.login(req.body);
    res.status(result.status).json({ message: result.message });
});

router.post('/logout', authenticateToken, async (req, res) => {
    const result = await authController.logout(req.user);
    res.status(result.status).json({ message: result.message });
});

export default router;