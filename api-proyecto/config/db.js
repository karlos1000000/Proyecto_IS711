import mysql from 'mysql2';
import 'dotenv/config';

const connection = mysql.createConnection({
    host: process.env.HOST2,
    port: process.env.PORTDB2, // reemplazar con el puerto de la base de datos
    user: process.env.USER2, // reemplazar con el usuario de la base de datos
    password: process.env.PASSWORD2, // contraseña del usuario de la base de datos
    database: process.env.DATABASE2, // reemplazar con el nombre de la base de datos
})

connection.connect((error) => {

    if (error) {
        throw new Error('El error de conexión es: ' + error.message.toString())
    }

})

export default connection;