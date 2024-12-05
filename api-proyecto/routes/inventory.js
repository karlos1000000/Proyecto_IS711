import { Router } from 'express'
import { inventoryController } from '../controllers/inventoryControllers.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import isAdmin from '../middlewares/isAdmin.js';


const inventoryRouter = Router();
inventoryRouter.use([authMiddleware, isAdmin])
inventoryRouter.post('/restock', inventoryController.restockInventory);//Restock Inventario
inventoryRouter.get('/:id', inventoryController.getInventoryById);//Consultar Inventario por ID


export default inventoryRouter;