import { Router } from 'express'
import {productController} from '../controllers/productControllers.js';

const productRouter = Router();

productRouter.get('/', productController.getAllProducts);
productRouter.get('/:productId', productController.getProductById);
productRouter.post('/', productController.createProduct);
productRouter.put('/:productId', productController.updateProduct);
productRouter.delete('/:productId', productController.deleteProduct);

export default productRouter;
