import Transaction from '@pixelpay/sdk-core'

const paymentRouter = Router();

paymentRouter.post('https://pixel-pay.com/api/v2/transaction/sale', paymentController.postPayment);

export default paymentRouter;