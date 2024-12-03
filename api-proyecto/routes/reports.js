import { Router } from 'express'
import { reportsController } from '../controllers/reportsControllers.js';


const reportRouter = Router();

reportRouter.get('/inventory', reportsController.reportInventory)

export default reportRouter;