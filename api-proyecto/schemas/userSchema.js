import { z } from 'zod';

const UserSchema = z.object({
  username: z.string()
    .min(1, { message: "El username es requerido" })
    .max(20, { message: "El username no puede exceder los 20 caracteres" }),
  email: z.string()
    .email({ message: "El email debe ser válido" })
    .max(45, { message: "El email no puede exceder los 45 caracteres" }),
  password: z.string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
    .max(30, { message: "La contraseña no puede exceder los 30 caracteres" }),
  role: z.enum(["cliente", "administrador"], 
    { message: "El role debe ser 'cliente' o 'administrador'" }),
});

export const ValidateUserSchema = (user) => UserSchema.safeParse(user)

export const ValidatePartialUserSchema = (user) => UserSchema.partial().safeParse(user)




