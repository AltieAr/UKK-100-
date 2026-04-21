import express from 'express';
import parkAreaController from '../controllers/parkAreaController.js';
import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js';


const router = express.Router();

router.use(verifyToken);
// router.use(authorizeRoles(['admin']));

router.get('/index', authorizeRoles(['operator', 'admin']), parkAreaController.index);
router.get('/find/:id', authorizeRoles(['operator', 'admin']), parkAreaController.findById);
router.post('/create', authorizeRoles(['admin']), parkAreaController.create);
router.put('/update/:id', authorizeRoles(['admin']), parkAreaController.update);
router.delete('/delete/:id', authorizeRoles(['admin']), parkAreaController.delete);

export default router;