import express from 'express';
import feeController from '../controllers/feeController.js';
import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();


router.use(verifyToken);
router.use(authorizeRoles(['admin']));

router.get('/index', feeController.index);
router.post('/create', feeController.create);
router.get('/find/:id', feeController.findById);
router.put('/update/:id', feeController.update);
router.delete('/delete/:id', feeController.delete);

export default router;
