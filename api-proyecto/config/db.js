import mysql from 'mysql2';
import 'dotenv/config';

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, // reemplazar con el puerto de la base de datos
    user: process.env.DB_USER, // reemplazar con el usuario de la base de datos
    password: process.env.DB_PASSWORD, // contraseña del usuario de la base de datos
    database: process.env.DB_NAME, // reemplazar con el nombre de la base de datos
})

connection.connect((error) => {

    if (error) {
        throw new Error('El error de conexión es: ', error)
    }

})

export default connection;