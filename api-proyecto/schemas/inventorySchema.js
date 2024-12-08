import {z} from 'zod';


const inventorySchema = z.object({

    "stock": z.number().int(),
    "id": z.number().int(),

}).strict();


export const ValidateInventorySchema = (inventory) => inventorySchema.safeParse(inventory)

export const ValidatePartialInventorySchema = (inventory) => inventorySchema.partial().safeParse(inventory)

