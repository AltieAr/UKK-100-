import express from 'express';
import transactionController from '../controllers/transactionController.js';

const router = express.Router();
import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js';

router.use(verifyToken);
router.use(authorizeRoles(['admin', 'operator']));

router.post('/checkin', transactionController.checkIn);
router.post('/checkout', transactionController.checkOut);
router.get('/active', transactionController.getActiveTransactions);
router.get('/history', transactionController.getTransactionHistory);
router.get('/all', transactionController.getAllTransactions);
export default router;