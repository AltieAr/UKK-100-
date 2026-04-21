import express from 'express';
const router = express.Router();
import authController from '../controllers/authController.js';
// import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware';

router.post('/login', authController.login);

export default router;