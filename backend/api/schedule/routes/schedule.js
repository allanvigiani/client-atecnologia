import express from 'express';
import authenticateToken from '../middleware/auth.js';
import ScheduleController from '../controllers/schedule-controller.js';

import ScheduleRepository from '../repositories/schedule-repository.js';
const scheduleRepository = new ScheduleRepository();

import QueueRepository from '../repositories/queue-repository.js';
const queueRepository = new QueueRepository();

const scheduleController = new ScheduleController(scheduleRepository, queueRepository);

const router = express.Router();

router.get('/teste', authenticateToken, async (req, res) => {
    res.status(200).json({ message: "Server está ok na rota GET." });
});

router.post('/', authenticateToken, async (req, res) => {
    const userId = req.user.payload.id;
    const result = await scheduleController.sendScheduleToQueue(req.body, userId);
    res.status(result.status).json({ message: result.message });
});

export default router;