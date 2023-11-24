import express from 'express';
// import authenticateToken from '../middleware/auth.js';
import ScheduleConfirmationController from '../controllers/schedule-confirmation-controller.js';

import ScheduleConfirmationRepository from '../repositories/schedule-confirmation-repository.js';
const scheduleConfirmationRepository = new ScheduleConfirmationRepository();

const scheduleConfirmationController = new ScheduleConfirmationController(scheduleConfirmationRepository);

const router = express.Router();

router.post('/send-email', async (req, res) => {
    const result = await scheduleConfirmationController.sendEmail(req.body);
    res.status(result.status).json({ message: result.message });
});

export default router;