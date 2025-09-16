import { Router } from 'express';
import { getMe, updateMe } from '../controllers/usersController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);

export default router;
