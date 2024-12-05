import { Router } from 'express'
import { reportsController } from '../controllers/reportsControllers.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import isAdmin from '../middlewares/isAdmin.js';


const reportRouter = Router();
reportRouter.use([authMiddleware, isAdmin])
reportRouter.get('/inventory',reportsController.reportInventory)
reportRouter.get('/sales/:start_date/:end_date' , reportsController.reportSales)

export default reportRouter;