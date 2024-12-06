import {z} from 'zod';


const inventorySchema = z.object({

    "usuario_id": z.number().int(),
    "producto_id": z.number().int(),
    "detalle_id": z.number().int().optional(),
    "cantidad": z.number().int(),

}).strict();


export const ValidateCart = (cart) => cartSchema.safeParse(cart);

export const ValidatePartialCart = (cart) => cartSchema.partial().safeParse(cart);