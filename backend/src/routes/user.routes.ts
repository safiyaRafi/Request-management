import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getUsers } from '../controllers/user.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getUsers);
router.get('/employees', getUsers);  // Same endpoint - returns all users for assignment

export default router;
