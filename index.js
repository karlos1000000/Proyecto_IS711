import express, { json } from 'express'
//import { corsMiddleware } from './middlewares/cors.js'
import productRouter from './api-proyecto/routes/product.js'
import cartRouter from './api-proyecto/routes/cart.js'
import authRouter from './api-proyecto/routes/auth.js'
import paymentRouter from './api-proyecto/routes/payments.js'
import inventoryRouter from './api-proyecto/routes/inventory.js'
import reportRouter from './api-proyecto/routes/reports.js';
import "dotenv/config"



const app = express();

//Middleware
app.disable('x-powered-by')
app.use(json()) //Middleware de express para capturar el body de la petición
//app.use(corsMiddleware())

//Puerto
//Agregar la variable PORT al .env
const PORT = process.env.PORT || 3000;

// Rutas
app.use('/products', productRouter);
app.use('/cart', cartRouter);
app.use('/auth', authRouter);
app.use('/payment', paymentRouter);
app.use('/inventory',inventoryRouter);
app.use('/report',reportRouter);

app.use((req, res) => {
    res.status(404).json({
        message: "URL no encontrada"
    })
})

// Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
