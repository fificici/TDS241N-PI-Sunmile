import { Router } from "express";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { ProfessionalController } from "../controllers/ProfessionalController";

const router = Router();
const auth = new AuthMiddleware();
const controller = new ProfessionalController();


router.put('/pro/:id', auth.authenticateToken, controller.updateProfessional);
router.delete('/pro/:id', auth.authenticateToken, controller.deleteProfessional);

router.post('/pro', controller.createProfessional)

export default router;