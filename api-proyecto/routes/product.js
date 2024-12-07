import { Router } from 'express'
import {productController} from '../controllers/productControllers.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import isAdmin from '../middlewares/isAdmin.js';

const productRouter = Router();

productRouter.use([authMiddleware, isAdmin])
productRouter.get('/', productController.getAllProducts);
productRouter.get('/:productId', productController.getProductById);
productRouter.post('/', productController.createProduct);
productRouter.put('/:productId', productController.updateProduct);
productRouter.delete('/:productId', productController.deleteProduct);

export default productRouter;
