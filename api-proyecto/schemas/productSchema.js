import {z} from 'zod';

const productSchema = z.object({
 
    "nombre": z.string().max(50).trim(),
    "descripcion": z.string().max(200).trim(),
    "precio": z.number().min(0),
    "stock": z.number().min(0),
    "categoria": z.string().max(50).trim(),
    
}).strict();

export const ValidateProduct = (product) => productSchema.safeParse(product);

export const ValidatePartialProduct = (product) => productSchema.partial().safeParse(product);