import { Router } from 'express'
import { authController } from '../controllers/authControllers.js';


const authRouter = Router();

authRouter.post('/register', authController.registerUser);//Registrar Usuario
authRouter.post('/login', authController.loginUser);//Iniciar sesión


export default authRouter;