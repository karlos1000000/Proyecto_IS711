import { Router } from 'express'
import { authController } from '../controllers/authControllers.js';


const cartRouter = Router();

cartRouter.post('/register', authController.registerUser);//Registrar Usuario
cartRouter.post('/login', authController.loginUser);//Iniciar sesión


export default authRouter;