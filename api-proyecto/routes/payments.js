import Transaction from '@pixelpay/sdk-core'
import { Router } from 'express'
import { paymentController } from '../controllers/paymentController.js';
import isClient from '../middlewares/isClient.js';

const paymentRouter = Router();

inventoryRouter.use([authMiddleware, isClient])
paymentRouter.post('/payment', paymentController.postPayment);
paymentRouter.post('/checkout', paymentController.checkOut);//Procesar pago
paymentRouter.get('/history/:id', paymentController.getPaymentHistory);// Obtener historial de pagos

export default paymentRouter;