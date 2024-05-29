import express from 'express';
import authenticateToken from '../middleware/auth.js';
import ScheduleStatusController from '../controllers/schedule-status-controller.js';

import ScheduleStatusRepository from '../repositories/schedule-status-repository.js';
const scheduleStatusRepository = new ScheduleStatusRepository();

const scheduleStatusController = new ScheduleStatusController(scheduleStatusRepository);

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
    const result = await scheduleStatusController.createScheduleStatus(req.body, req.user.payload.id);
    res.status(result.status).json({ message: result.message, id: result.id });
});

router.delete('/:serviceId', authenticateToken, async (req, res) => {
    const result = await scheduleStatusController.deleteScheduleStatus(req.params.serviceId, req.user.payload.id);
    res.status(result.status).json({ message: result.message });
});

router.put('/', authenticateToken, async (req, res) => {
    const result = await scheduleStatusController.updateScheduleStatus(req.body, req.user.payload.id);
    res.status(result.status).json({ message: result.message });
});

router.get('/appointments', async (req, res) => {
    const result = await scheduleStatusController.getAppointmentsByUser(2);
    res.status(result.status).json({ message: result.message });
});

router.get('/:serviceId?', authenticateToken, async (req, res) => {
    const result = await scheduleStatusController.getScheduleStatusByServiceId(req.params.serviceId, req.user.payload.id);
    res.status(result.status).json({ message: result.message });
});

export default router;