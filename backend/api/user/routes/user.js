import express from 'express';
import authenticateToken from '../middleware/auth.js';
import UserController from '../controllers/user-controller.js';

import UserRepository from '../repositories/user-repository.js';
const userRepository = new UserRepository();

const userController = new UserController(userRepository);

const router = express.Router();

router.post('/', async (req, res) => {
    const result = await userController.createUser(req.body);
    res.status(result.status).json({ message: result.message });
});

router.put('/', authenticateToken, async (req, res) => {
    const userId = req.user.payload.id;
    const result = await userController.changeUserInformation(req.body, userId);
    res.status(result.status).json({ message: result.message });
});

router.get('/', authenticateToken, async (req, res) => {
    const userId = req.user.payload.id;
    const result = await userController.getUserInformation(userId);
    res.status(result.status).json({ message: result.message });
});

export default router;