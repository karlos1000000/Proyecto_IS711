import { Router } from 'express'
import { cartController } from '../controllers/cartControllers.js';
import isClient from '../middlewares/isClient.js';
import authMiddleware from '../middlewares/authMiddleware.js';


const cartRouter = Router();

cartRouter.use([authMiddleware, isClient]);//Middleware de autenticación y autorización
cartRouter.get('/:user_id', cartController.getCartByUser);//Obtener todos los items del carrito por usuario
cartRouter.post('/', cartController.addToCart);//Crear un item en el carrito
cartRouter.delete('/:id', cartController.removeFromCart);//Eliminar un item del carrito


export default cartRouter;