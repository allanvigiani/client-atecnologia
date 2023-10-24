import express from 'express';
import authenticateToken from '../middleware/auth.js';
import CompanyController from '../controllers/company-controller.js';

const companyController = new CompanyController();

const router = express.Router();

router.post('/', async (req, res) => {
    const result = await companyController.createCompany(req.body);
    res.status(result.status).json({ message: result.message });
});

router.put('/', authenticateToken, async (req, res) => {
    const userId = req.user.payload.id;
    const result = await companyController.changeCompanyInformation(req.body, userId);
    res.status(result.status).json({ message: result.message });
});

export default router;