import vehicletypeController from "../controllers/vehicleTypeController.js";
import express from "express";
const router = express.Router();

import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js';

router.use(verifyToken);
// router.use(authorizeRoles(['admin']));

router.get('/index', authorizeRoles(['operator', 'admin']), vehicletypeController.index);
router.post('/create', authorizeRoles(['admin']), vehicletypeController.create);
router.get('/find/:id', authorizeRoles(['operator', 'admin']), vehicletypeController.findById);
router.put('/update/:id', authorizeRoles(['admin']), vehicletypeController.update);
router.delete('/delete/:id', authorizeRoles(['admin']), vehicletypeController.delete);

export default router;