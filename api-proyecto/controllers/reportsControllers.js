import db from '../config/db.js';
import 'dotenv/config';

export class reportsController {
    static reportInventory(req,res) {
        const consulta = "SELECT id, name, description, price, stock, Stock_minimo FROM products"

        try{
            db.query(consulta, (error, results) => {
                if(error){
                    return res.status(400).json({   
                        message: "Hubo un error al obtener los datos en el servidor"
                    })
                }
    
                return res.header('Content-type', 'application/json').status(201).json(results)
            })
        }catch(error){
            if(error){
                return res.status(400).json({   
                    message: "Hubo un error al obtener los datos en el servidor"
                })
            }
        }

    }

    static reportSales(req,res) {
        const consulta = "SELECT id, user_id, total, status, created_date FROM pago WHERE created_date BETWEEN ? AND ADDDATE(?,1)  "

        const {start_date, end_date} = req.params

        if (!start_date || !end_date) {
            return res.status(400).json({
                message: "Debe proporcionar start_date y end_date como parámetros de la URL.",
            })
        }

        // Validar formato de las fechas
        if (isNaN(Date.parse(start_date)) || isNaN(Date.parse(end_date))) {
            return res.status(400).json({
                message: "Las fechas proporcionadas no tienen un formato valido. Use YYYY-MM-DD.",
            })
        }
        
        // Verificar que start_date no sea posterior a end_date
        if (new Date(start_date) > new Date(end_date)) {
            return res.status(400).json({
                message: "La fecha de inicio no puede ser posterior a la fecha de fin.",
            })
        }

        try{
            db.query(consulta, [start_date, end_date], (error, results) => {
                if(error){
                    return res.status(400).json({   
                        message: "Hubo un error al obtener los datos en el servidor"
                    })
                }
                
                // Verificar si hay resultados
                if (results.length === 0) {
                    return res.status(200).json({
                        message: "No se encontraron ventas en el rango de fechas especificado."
                    })
                }
    
                return res.header('Content-type', 'application/json').status(201).json(results)
            })

        }catch(error){
            if(error){
                return res.status(400).json({   
                    message: "Hubo un error al generar el reporte"
                })
            }
        }

        

    }
}

export default reportsController
