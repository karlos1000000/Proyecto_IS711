import db from '../config/db.js';
import { ValidateCart } from '../schemas/cartSchema.js';

export class cartController{

    static getCartByUser = (req, res) => {
        
        const { user_id } = req.params;
        const consulta =  `select ci.id, p.name AS Nombre, p.price AS Precio, ci.cantidad AS Cantidad 
                                FROM cart_items AS ci 
                                INNER JOIN products AS p ON ci.product_id = p.id 
                                INNER JOIN carts AS c ON ci.cart_id = c.id
                            WHERE c.user_id  =  ?`;

        try {
            db.query(consulta, [user_id], (err, results) => {
                
                if(err)
                {
                    return res.status(400)
                                .json({
                                    message: "Error al obtener el carrito (error en el query)" + err,
                                    error: true
                                });
                }

                if(results.length == 0)
                {
                    return res.status(400)
                                .json({
                                    message: "No se encontraron elementos en el carrito",
                                    error: true
                                });
                }

                return res  .header("Content-Type", "application/json")
                            .status(200)
                            .json(results);

            });
        } catch (error) {
            return res.status(400)
                        .json({
                            message: "Error al obtener el carrito (error en el catch)",
                            error: true
                        });
        } 

    }

    static addToCart = (req, res) => {
        const consulta = `INSERT INTO carrito (usuario_id, producto_id, detalle_id, cantidad) 
                        VALUES (?, ?, ?, ?)`;
        const data = req.body;

        
        const { success, error } = ValidateCart(data);

        if(!success){
            return res.status(400)
                        .json({
                            message: "Error al crear el carrito (error en el schema)" + error,
                            error: true
                        });
        }

        try {
            const { usuario_id, producto_id, detalle_id, cantidad } = data;
            db.query(consulta, [usuario_id, producto_id, detalle_id, cantidad], (error, results) => {
                
                if(error)
                {
                    return res.status(400)
                                .json({
                                    message: "Error al crear el carrito (error en el query)  " + error,
                                    error: true
                                });
                }

                return res  .header("Content-Type", "application/json")
                            .status(200)
                            .json(data);

            });
        } catch (error) {
            return res.status(400)
                        .json({
                            message: "Error al crear el carrito (error en el catch)",
                            error: true
                        });
        } 
    }

    static removeFromCart = (req, res) => {
        const { id  } = req.params;
        const consulta = "DELETE  FROM carrito WHERE id = ?";

        try {
            db.query(consulta, [id], (error, results) => {
                
                if(error)
                {
                    return res.status(400)
                                .json({
                                    message: "Error al eliminar un articulo del carrito (error en el query)  " + error,
                                    error: true
                                });
                }

                return res  .header("Content-Type", "application/json")
                            .status(200)
                            .json({
                                message: "Articulo eliminado del carrito",
                                error: false
                            });

            });
        } catch (error) {
            return res.status(400)
                        .json({
                            message: "Error al eliminar el carrito (error en el catch)  " + error,
                            error: true
                        });
        } 
    }
}
