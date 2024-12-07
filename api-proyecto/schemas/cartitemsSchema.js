import {z} from 'zod';


const cartitemsSchema = z.object({

    "cart_id": z.number().int(),
    "product_id": z.number().int(),
    "cantidad": z.number().int(),

}).strict();


export const ValidateCartItems = (cartItems) => cartitemsSchema.safeParse(cartItems);

export const ValidatePartialCartItems = (cartItems) => cartitemsSchema.partial().safeParse(cartItems);