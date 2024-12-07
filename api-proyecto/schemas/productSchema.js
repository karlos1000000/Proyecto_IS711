import {z} from 'zod';

const productSchema = z.object({
 
    "name": z.string().max(50).trim(),
    "description": z.string().max(200).trim(),
    "price": z.number().min(0),
    "stock": z.number().min(0),
    "stock_minimo": z.number().min(0),
    
}).strict();

export const ValidateProduct = (product) => productSchema.safeParse(product);

export const ValidatePartialProduct = (product) => productSchema.partial().safeParse(product);