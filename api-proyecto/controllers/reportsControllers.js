import db from '../config/db.js';
import 'dotenv/config';

export class reportsController {
    static reportInventory(req,res) {
        const consulta = "SELECT * FROM products"

        db.query(consulta, (error, results) => {
            if(error){
                return res.status(400).json({   
                    message: "Hubo un error al obtener los datos en el servidor"
                })
            }

            return res.header('Content-type', 'application/json').status(201).json(results)
        })

    }
}

export default reportsController
