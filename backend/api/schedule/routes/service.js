import express from 'express';
import authenticateToken from '../middleware/auth.js';
import ServiceController from '../controllers/service-controller.js';

import ServiceRepository from '../repositories/service-repository.js';
const serviceRepository = new ServiceRepository();

const serviceController = new ServiceController(serviceRepository);

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
    const result = await serviceController.createService(req.body, req.user.payload.id);
    res.status(result.status).json({ message: result.message, id: result.id });
});

router.delete('/:serviceId', authenticateToken, async (req, res) => {
    const result = await serviceController.deleteService(req.params.serviceId, req.user.payload.id);
    res.status(result.status).json({ message: result.message });
});

router.get('/:serviceId?', authenticateToken, async (req, res) => {
    const result = await serviceController.getServices(req.params.serviceId, req.user.payload.id);
    res.status(result.status).json({ message: result.message });
});

router.get('/scheduled-services/:companyId?',authenticateToken, async (req, res) => {
    const result = await serviceController.getScheduledServicesByCompany(req.params.companyId);
    res.status(result.status).json({ message: result.message });
});

router.get('/company-services/:companyId?', async (req, res) => {
    const result = await serviceController.getServicesByCompany(req.params.companyId);
    res.status(result.status).json({ message: result.message });
});

router.post('/service-hours', authenticateToken, async (req, res) => {
    const result = await serviceController.createServiceHours(req.body);
    res.status(result.status).json({ message: result.message });
});

router.get('/service-hours/:serviceId', authenticateToken, async (req, res) => {
    const result = await serviceController.getServiceHours(req.params.serviceId, req.user.payload.id);
    res.status(result.status).json({ message: result.message });
});

router.delete('/service-hours/:serviceHourId', authenticateToken, async (req, res) => {
    const result = await serviceController.deleteServiceHour(req.params.serviceHourId);
    res.status(result.status).json({ message: result.message });
});

export default router;