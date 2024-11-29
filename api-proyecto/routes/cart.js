import { Router } from 'express'
import { cartController } from '../controllers/cartControllers.js';


const cartRouter = Router();

cartRouter.get('/:userId', cartController.getCartByUser);//Obtener todos los items del carrito por usuario
cartRouter.post('/', cartController.addToCart);//Crear un item en el carrito
cartRouter.delete('/:id', cartController.removeFromCart);//Eliminar un item del carrito


export default cartRouter;