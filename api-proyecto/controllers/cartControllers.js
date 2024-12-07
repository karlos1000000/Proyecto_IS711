import db from '../config/db.js';
import { ValidateCart } from '../schemas/cartSchema.js';
import { ValidateCartItems } from '../schemas/cartitemsSchema.js';

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
        const { cart_id, product_id, cantidad } = req.body;

        const data = req.body;

        const { success, error } = ValidateCartItems(data);

        if(!success){
            return res.status(400)
                        .json({
                            message: "Error al agregar el producto al carrito (error en el schema)" + error,
                            error: true
                        });
        }
    

        if (!cart_id || !product_id || !cantidad) {
            return res.status(400).json({
                message: "Faltan parámetros: cart_id, product_id y/o cantidad",
                error: true,
            });
        }
    
        const agregarItem = `
            INSERT INTO cart_items (cart_id, product_id, cantidad)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE cantidad = cantidad + ?;
        `;
    
        try {
            db.query(agregarItem, [cart_id, product_id, cantidad, cantidad], (err, results) => {
                if (err) {
                    return res.status(500).json({
                        message: "Error al agregar el producto al carrito",
                        error: true,
                    });
                }
    
                return res.status(200).json({
                    message: "Producto agregado al carrito correctamente",
                });
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error al procesar la solicitud",
                error: true,
            });
        }
    };
    

    static removeFromCart = (req, res) => {
        const { cart_id, product_id } = req.params;
    
        if (!cart_id || !product_id) {
            return res.status(400).json({
                message: "Faltan parámetros: cart_id y/o product_id",
                error: true,
            });
        }
    
        const eliminarItem = `
            DELETE FROM cart_items
            WHERE cart_id = ? AND product_id = ?
        `;
    
        try {
            db.query(eliminarItem, [cart_id, product_id], (err, results) => {
                if (err) {
                    return res.status(500).json({
                        message: "Error al eliminar el producto del carrito",
                        error: true,
                    });
                }
    
                if (results.affectedRows === 0) {
                    return res.status(404).json({
                        message: "No se encontró el producto en el carrito",
                        error: true,
                    });
                }
    
                return res.status(200).json({
                    message: "Producto eliminado del carrito correctamente",
                });
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error al procesar la solicitud",
                error: true,
            });
        }
    };


    //Metodos para rutas adicionales no solicitadas

    static createCart = (req, res) => {
        const { user_id } = req.body;

        const data = req.body;
    
        const { success, error } = ValidateCart(data);

        if(!success){
            return res.status(400)
                        .json({
                            message: "Error al crear el carrito (error en el schema)" + error,
                            error: true
                        });
        }


        if (!user_id) {
            return res.status(400).json({
                message: "El campo user_id es obligatorio",
                error: true,
            });
        }
    
        const crearCarrito = `
            INSERT INTO carts (user_id)
            VALUES (?);
        `;
    
        try {
            db.query(crearCarrito, [user_id], (err, results) => {
                if (err) {
                    return res.status(500).json({
                        message: "Error al crear el carrito",
                        error: true,
                    });
                }
    
                const newCartId = results.insertId;
    
                return res.status(201).json({
                    message: "Carrito creado exitosamente",
                    cart_id: newCartId,
                });
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error al procesar la solicitud",
                error: true,
            });
        }
    };
    
    
}
