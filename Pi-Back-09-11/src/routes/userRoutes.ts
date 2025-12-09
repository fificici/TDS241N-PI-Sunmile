import { Router } from "express";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { UserController } from "../controllers/UserController";

const router = Router();
const auth = new AuthMiddleware();
const controller = new UserController();


router.put('/users/:id', auth.authenticateToken, controller.updateUser);
router.delete('/users/:id', auth.authenticateToken, controller.deleteUser);

router.post('/users', controller.createUser)

export default router;