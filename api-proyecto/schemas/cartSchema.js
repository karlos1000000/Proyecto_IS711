import {z} from 'zod';


const cartSchema = z.object({

    "user_id": z.number().int(),

}).strict();


export const ValidateCart = (cart) => cartSchema.safeParse(cart);

export const ValidatePartialCart = (cart) => cartSchema.partial().safeParse(cart);