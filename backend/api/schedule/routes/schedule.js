import express from 'express';
import authenticateToken from '../middleware/auth.js';
import ScheduleController from '../controllers/schedule-controller.js';

const scheduleController = new ScheduleController();

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
    const result = await scheduleController.createSchedule(req.body);
    res.status(result.status).json({ message: result.message });
});

router.put('/', authenticateToken, async (req, res) => {
    const userId = req.user.payload.id;
    const result = await scheduleController.changeCompanyInformation(req.body, userId);
    res.status(result.status).json({ message: result.message });
});

export default router;