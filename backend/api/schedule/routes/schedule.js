import express from 'express';
// import authenticateToken from '../middleware/auth.js';
import ScheduleController from '../controllers/schedule-controller.js';

import ScheduleRepository from '../repositories/schedule-repository.js';
const scheduleRepository = new ScheduleRepository();

const scheduleController = new ScheduleController(scheduleRepository);

const router = express.Router();

router.post('/', async (req, res) => {
    const result = await scheduleController.createSchedule(req.body);
    res.status(result.status).json({ message: result.message });
});

export default router;