import db from '../config/db.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import 'dotenv/config';

export class authController{
    

    static registerUser = (req, res) => {
        const consulta = `INSERT INTO users ( username, email, password)  VALUES (?, ?, ?)`;
        const data = req.body;
        const { username, email, password} = data;
        if(!username|| !email || !password)//verificamos que ingreso todo lo que solicitamos
        {
            return res.status(400).json({
                message: "Debe de ingresar: username, email y password"
            })
        }

        const passwordhash = bcrypt.hashSync(password,10)

        try {
            
            db.query(consulta, [username, email, passwordhash], (error, results) => {
                
                if(error){
                    return res.status(400).json({
                        message: "Hubo un error al obtener los datos en el servidor"
                    })
                }

                return res.status(200).json(data)

            });
        } catch (error) {
            return res.status(400)
                        .json({
                            message: "Error al registrar usuario (error en el catch)",
                            error: true
                        });
        } 
    }

    static loginUser(req, res) {

        const { username, password: password_user } = req.body
    
        // Validar entrada
        if (!username || !password_user) {
            return res.status(400).json({
                error: true,
                message: "Debe de ingresar username y password"
            })
        }
    
        const query = `SELECT id, username, password, role FROM users WHERE username = ?`
    
        try {
            db.query(query, [username], (error, results) => {
                // Manejo de errores en la consulta
                if (error) {
                    return res.status(400).json({
                        error: true,
                        message: "Ocurrió un error al obtener los datos: " + error
                    })
                }
    
                // Validar si no hay resultados
                if (results && results.length === 0) {
                    return res.status(404).json({
                        error: true,
                        message: "Usuario no encontrado"
                    })
                }
    
                // Extraer contraseña de la base de datos
                const { password: password_db } = results[0]
    
                // Comparar contraseñas
                bcrypt.compare(password_user, password_db, function (error, isMatch) {
                    if (error || !isMatch) {
                        return res.status(400).json({
                            error: true,
                            message: "La contraseña es incorrecta"
                        })
                    }
    
                    // Eliminar contraseña antes de enviar los datos
                    const data = results[0]
                    delete data.password
    
                    // Generar token JWT
                    const token = jwt.sign({ ...data }, process.env.SECRET_KEY, { expiresIn: '1h' })
                    data.token = token
    
                    return res.status(200).json({
                        error: false,
                        message: "Bienvenido",
                        data: data
                    })
                })
            })
        } catch (error) {
            return res.status(500).json({
                error: true,
                message: "Ocurrió un error en el servidor"
            })
        }
    }
    
   
}
