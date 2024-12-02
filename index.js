import express, { json } from 'express'
//import { corsMiddleware } from './middlewares/cors.js'
//import productRouter from './api-proyecto/routes/product.js'
//import cartRouter from './api-proyecto/routes/cart.js'
import authRouter from './api-proyecto/routes/auth.js'
//import paymentsRouter from './api-proyecto/routes/payments.js'
import inventoryRouter from './api-proyecto/routes/inventory.js'



const app = express();

//Middleware
app.disable('x-powered-by')
app.use(json()) //Middleware de express para capturar el body de la petición
//app.use(corsMiddleware())

//Puerto
//Agregar la variable PORT al .env
const PORT = process.env.PORT2 || 3000;

// Rutas
//app.use('/products', productRouter);
//app.use('/cart', cartRouter);
app.use('/auth', authRouter);
//app.use('/payments', paymentsRouter);
app.use('/inventory',inventoryRouter);

app.use((req, res) => {
    res.status(404).json({
        message: "URL no encontrada"
    })
})

// Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
