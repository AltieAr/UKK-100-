import express from 'express';
import logController from '../controllers/logController.js';
import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();


router.use(verifyToken);
router.use(authorizeRoles(['owner']));
router.get('/index', logController.index);

export default router;