import { Router } from 'express'
import { inventoryController } from '../controllers/inventoryControllers.js';


const inventoryRouter = Router();

inventoryRouter.post('/restock', inventoryController.restockInventory);//Restock Inventario
inventoryRouter.get('/:id', inventoryController.getInventoryById);//Consultar Inventario por ID


export default inventoryRouter;