import { Router } from 'express';
import { getManagers, getEmployees } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/managers', getManagers);
router.get('/employees', getEmployees);

export default router;
