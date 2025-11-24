import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
    getRequests,
    createRequest,
    approveRequest,
    rejectRequest,
    closeRequest,
} from '../controllers/request.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getRequests);
router.post('/', createRequest);
router.put('/:id/approve', approveRequest);
router.put('/:id/reject', rejectRequest);
router.put('/:id/close', closeRequest);

export default router;
