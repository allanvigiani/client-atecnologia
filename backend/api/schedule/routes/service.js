import express from 'express';
import authenticateToken from '../middleware/auth.js';
import ServiceController from '../controllers/service-controller.js';

const serviceController = new ServiceController();

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
    const result = await serviceController.createService(req.body, req.user.payload.id);
    res.status(result.status).json({ message: result.message });
});

router.delete('/:serviceId', authenticateToken, async (req, res) => {
    const result = await serviceController.deleteService(req.params.serviceId, req.user.payload.id);
    res.status(result.status).json({ message: result.message });
});

router.get('/:serviceId?', authenticateToken, async (req, res) => {
    const result = await serviceController.getServices(req.params.serviceId, req.user.payload.id);
    res.status(result.status).json({ message: result.message });
});

router.post('/service-hours/:serviceId', authenticateToken, async (req, res) => {
    const result = await serviceController.createServiceHours(req.body, req.params.serviceId);
    res.status(result.status).json({ message: result.message });
});

router.get('/:serviceId', authenticateToken, async (req, res) => {
    const result = await serviceController.getServiceHours(req.params.serviceId, req.user.payload.id);
    res.status(result.status).json({ message: result.message });
});

router.delete('/:serviceHourId', authenticateToken, async (req, res) => {
    const result = await serviceController.deleteServiceHour(req.params.serviceHourId);
    res.status(result.status).json({ message: result.message });
});

export default router;