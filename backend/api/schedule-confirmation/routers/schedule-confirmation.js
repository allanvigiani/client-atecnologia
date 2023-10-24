import express from 'express';
import authenticateToken from '../middleware/auth.js';
import ScheduleConfirmationController from '../controllers/schedule-confirmation-controller.js';

const scheduleConfirmationController = new ScheduleConfirmationController();

const router = express.Router();

router.post('/send-email', async (req, res) => {
    const result = await scheduleConfirmationController.sendEmail(req.body);
    res.status(result.status).json({ message: result.message });
});

export default router;