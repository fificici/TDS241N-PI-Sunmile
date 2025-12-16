import { Router } from "express";
import { ProPostController } from '../controllers/ProPostController';
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

const router = Router();
const auth = new AuthMiddleware();
const proPostController = new ProPostController();

router.get('/pro-posts', proPostController.list);
router.get('/pro-posts/:id', proPostController.show);

router.post('/pro-posts', auth.authenticateToken, proPostController.create);

router.put('/pro-posts/:id', auth.authenticateToken, proPostController.update);

router.delete('/pro-posts/:id', auth.authenticateToken, proPostController.delete);

export default router;