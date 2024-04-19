import express from 'express';
import authenticateToken from '../middleware/user-auth.js';
import UserAuthController from '../controllers/user-auth-controller.js';

import UserAuthRepository from '../repositories/user-auth-repository.js';
const userAuthRepository = new UserAuthRepository();

const userAuthController = new UserAuthController(userAuthRepository);

const router = express.Router();

router.post('/login', async (req, res) => {
    const result = await userAuthController.login(req.body);
    res.status(result.status).json({ message: result.message });
});

router.get('/user', authenticateToken, async (req, res) => {
    const result = await userAuthController.user(req.user);
    res.status(result.status).json({ message: result.message });
});

router.post('/logout', authenticateToken, async (req, res) => {
    const result = await userAuthController.logout(req.user);
    res.status(result.status).json({ message: result.message });
});

export default router;