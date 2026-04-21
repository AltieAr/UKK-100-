import express from 'express';
const router = express.Router();
import userControllers from '../controllers/userControllers.js';
import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js';

router.use(verifyToken);
router.use(authorizeRoles(['admin']));

router.get('/index', userControllers.index);
router.get('/indexAll', userControllers.indexAll);
router.post('/create', userControllers.create);
router.delete('/delete/:id', userControllers.delete);
router.get('/find/:id', userControllers.findById);
router.put('/update/:id', userControllers.update);

export default router;