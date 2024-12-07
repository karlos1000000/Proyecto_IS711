import Transaction from '@pixelpay/sdk-core'
import { Router } from 'express'
import { paymentController } from '../controllers/paymentsControllers.js';
import isClient from '../middlewares/isClient.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const paymentRouter = Router();

paymentRouter.use([authMiddleware, isClient])
paymentRouter.post('/checkout', paymentController.postPayment);//Procesar pago
paymentRouter.get('/history/:id', paymentController.getPaymentHistory);// Obtener historial de pagos

export default paymentRouter;