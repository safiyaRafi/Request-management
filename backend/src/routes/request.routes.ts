import { Router } from 'express';
import { createRequest, getRequests, approveRequest, rejectRequest, closeRequest } from '../controllers/request.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', createRequest);
router.get('/', getRequests);
router.put('/:id/approve', approveRequest);
router.put('/:id/reject', rejectRequest);
router.put('/:id/close', closeRequest);

export default router;
