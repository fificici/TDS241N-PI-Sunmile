import { Router } from "express";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { StudentController } from "../controllers/StudentController";

const router = Router();
const auth = new AuthMiddleware();
const controller = new StudentController();


router.put('/student/:id', auth.authenticateToken, controller.updateStudent);
router.delete('/student/:id', auth.authenticateToken, controller.deleteStudent);

router.post('/student', controller.createStudent)

export default router;