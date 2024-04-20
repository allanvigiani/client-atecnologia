import express from 'express';
import authenticateToken from '../middleware/auth.js';
import ServiceController from '../controllers/service-controller.js';

import ServiceRepository from '../repositories/service-repository.js';
const serviceRepository = new ServiceRepository();

import HourRepository from '../repositories/hour-repository.js';
const hourRepository = new HourRepository();

import DayRepository from '../repositories/day-repository.js';
const dayRepository = new DayRepository();

import TypeRepository from '../repositories/type-repository.js';
const typeRepository = new TypeRepository();

const serviceController = new ServiceController(serviceRepository, hourRepository, dayRepository, typeRepository);

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
    const result = await serviceController.createService(req.body, req.user.payload.id);
    res.status(result.status).json({ message: result.message, id: result.id });
});

router.delete('/:serviceId', authenticateToken, async (req, res) => {
    const result = await serviceController.deleteService(req.params.serviceId, req.user.payload.id);
    res.status(result.status).json({ message: result.message });
});

router.put('/', authenticateToken, async (req, res) => {
    const result = await serviceController.updateService(req.body, req.user.payload.id);
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

router.get('/hours', authenticateToken, async (req, res) => {
    const result = await serviceController.getHours(req.user.payload.id);
    res.status(result.status).json({ message: result.message });
});

router.get('/days', authenticateToken, async (req, res) => {
    const result = await serviceController.getDays(req.user.payload.id);
    res.status(result.status).json({ message: result.message });
});

router.get('/types', authenticateToken, async (req, res) => {
    const result = await serviceController.getTypes(req.user.payload.id);
    res.status(result.status).json({ message: result.message });
});

router.get('/service/hours/:serviceId', authenticateToken, async (req, res) => {
    const result = await serviceController.getHoursByCompany(req.params.serviceId, req.user.payload.id);
    res.status(result.status).json({ message: result.message });
});

router.get('/service/days', authenticateToken, async (req, res) => {
    const result = await serviceController.getDaysByService(req.body.service_id, req.body.company_id);
    res.status(result.status).json({ message: result.message });
});

router.get('/service/types/:typesId?', authenticateToken, async (req, res) => {
    const result = await serviceController.getTypesById(req.params.typesId, req.user.payload.id);
    res.status(result.status).json({ message: result.message });
});


export default router;