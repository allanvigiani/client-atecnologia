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

router.get('/all-hours', authenticateToken, async (req, res) => {
    const result = await serviceController.getHours();
    res.status(result.status).json({ message: result.message });
});

export default router;