import express from 'express';
import reportContoller from '../controllers/reportContoller.js';

const router = express.Router();

import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js';

router.use(verifyToken);
router.use(authorizeRoles(['owner']));

router.get('/dashboard', reportContoller.getDashboard)

export default router;