import express from 'express';
import adminDashboardController from '../controllers/adminDashboardController.js';
import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js'; // Sesuaikan path

const router = express.Router();

// Bikin endpoint baru khusus statistik admin
router.get('/dashboard', verifyToken, authorizeRoles('admin'), adminDashboardController.getStats);

export default router;