import {Router} from "express"
import { UserController } from "../controller/UserController"

const routes = Router();
const userController = new UserController();

// Rotas de Usuários
routes.get('/users', userController.list);          // Listar todos
routes.get('/users/:id', userController.show);      // Mostrar um
routes.post('/users', userController.createUser);       // Criar
routes.patch('/users/:id', userController.updateUser);  // Atualizar
routes.delete('/users/:id', userController.deleteUser); // Deletar  

export default routes;