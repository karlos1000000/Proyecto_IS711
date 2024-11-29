import { Router } from 'express'
import {productsController} from '../controllers/productsController.js';

const productsRouter = Router();

productsRouter.get('/', productsController.getAllProducts);
productsRouter.get('/:productId', productsController.getProductById);
productsRouter.post('/', productsController.createProduct);
productsRouter.put('/:productId', productsController.updateProduct);
productsRouter.delete('/:productId', productsController.deleteProduct);

export default productsRouter;
