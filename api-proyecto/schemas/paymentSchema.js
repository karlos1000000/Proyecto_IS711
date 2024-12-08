import { z } from 'zod';

const PaymentSchema = z.object({
 
    "user_id": z.number().int(),
    "cart_id": z.number().int(),

}).strict();

export const ValidatePaymentSchema = (payment) => PaymentSchema.safeParse(payment)

export const ValidatePartialPaymentSchema = (payment) => PaymentSchema.partial().safeParse(payment)

