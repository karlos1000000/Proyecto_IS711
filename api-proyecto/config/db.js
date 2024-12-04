import mysql from 'mysql2';
import 'dotenv/config';

const connection = mysql.createConnection({
    host: process.env.HOST,
    port: process.env.PORTDB, // reemplazar con el puerto de la base de datos
    user: process.env.USER, // reemplazar con el usuario de la base de datos
    password: process.env.PASSWORD, // contraseña del usuario de la base de datos
    database: process.env.DATABASE, // reemplazar con el nombre de la base de datos
})

connection.connect((error) => {

    if (error) {
        throw new Error('El error de conexión es: ' + error.message.toString())
    }

})

export default connection;