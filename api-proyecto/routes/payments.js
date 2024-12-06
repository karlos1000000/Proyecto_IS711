import Transaction from '@pixelpay/sdk-core'
import { Router } from 'express'
import { paymentController } from '../controllers/paymentController.js';
import isClient from '../middlewares/isClient.js';

const paymentRouter = Router();

inventoryRouter.use([authMiddleware, isClient])
paymentRouter.post('https://pixel-pay.com/api/v2/transaction/sale', paymentController.postPayment);
paymentRouter.post('/checkout', authController.registerUser);//Procesar pago
paymentRouter.get('/history/:id', authController.loginUser);// Obtener historial de pagos

export default paymentRouter;