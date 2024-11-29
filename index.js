import express, { json } from 'express'
import { corsMiddleware } from './middlewares/cors.js'
import productRouter from './routes/product'
import cartRouter from './routes/cart'
import authRouter from './routes/auth'
import paymentsRouter from './routes/payments'
import inventoryRouter from './routes/inventory'



const app = express();

//Middleware
app.disable('x-powered-by')
app.use(json()) //Middleware de express para capturar el body de la petición
app.use(corsMiddleware())

//Puerto
//Agregar la variable PORT al .env
const PORT = process.env.PORT || 3000;

// Rutas
app.use('/products', productRouter);
app.use('/cart', cartRouter);
app.use('/auth', authRouter);
app.use('/payments', paymentsRouter);
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
