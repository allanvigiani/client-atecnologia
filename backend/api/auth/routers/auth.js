import express from 'express';
import authenticateToken from '../middleware/auth.js';
import AuthController from '../controllers/auth-controller.js';

const authController = new AuthController();

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