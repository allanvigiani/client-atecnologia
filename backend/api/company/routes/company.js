import express from 'express';
import authenticateToken from '../middleware/auth.js';
import CompanyController from '../controllers/company-controller.js';

import CompanyRepository from '../repositories/company-repository.js';
const companyRepository = new CompanyRepository();

const companyController = new CompanyController(companyRepository);

const router = express.Router();

router.post('/', async (req, res) => {
    const result = await companyController.createCompany(req.body);
    // await companyController.createCompany(req.body); // Resolve problema de lentidão de cadastro na Vercel
    res.status(result.status).json({ message: result.message });
});

router.put('/', authenticateToken, async (req, res) => {
    const userId = req.user.payload.id;
    const result = await companyController.changeCompanyInformation(req.body, userId);
    res.status(result.status).json({ message: result.message });
});

router.get('/', authenticateToken, async (req, res) => {
    const userId = req.user.payload.id;
    const result = await companyController.getCompanyInformation(userId);
    res.status(result.status).json({ message: result.message });
});

router.get('/all-companies/:companyId?', async (req, res) => {
    const result = await companyController.getAllCompanies(req.params.companyId);
    res.status(result.status).json({ message: result.message });
});

router.delete('/companyId', async (req, res) => {
    const result = await companyController.deleteCompany(req.params.companyId);
    res.status(result.status).json({ message: result.message });
});

export default router;