import vehicleController from "../controllers/vehicleController.js";
import express from "express";

const router = express.Router();

import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js';

router.use(verifyToken);
router.use(authorizeRoles(['admin']));

router.get("/index", vehicleController.index);
router.post("/create", vehicleController.create);
router.get("/find/:id", vehicleController.findById);
router.put("/update/:id", vehicleController.update);
router.delete("/delete/:id", vehicleController.delete);

export default router;
