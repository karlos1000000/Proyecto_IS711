import { Router } from 'express'
import { reportsController } from '../controllers/reportsControllers.js';


const reportRouter = Router();

reportRouter.get('/inventory', reportsController.reportInventory)
reportRouter.get('/sales/:start_date/:end_date', reportsController.reportSales)

export default reportRouter;