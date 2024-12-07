import db from "../config/db.js";
import "dotenv/config";
import axios from "axios";

export class paymentController {

    static postPayment = async (req, res) => {
        const data = req.body;

        const data_user = 
        {
            user_id: data.user_id,
            cart_id: data.cart_id
        };

        const consultaCarrito = `SELECT CI.cart_id, SUM(Cantidad) FROM cart_items as CI inner join carts AS c ON CI.cart_id = c.id  WHERE c.user_id = ? group by CI.cart_id`;

        try {
            db.query(consultaCarrito, [data_user.user_id], (err, results) => {
                if (err) {
                    return res.status(400).json({
                        message:
                            "Error al obtener los items del carrito (error en el query)" + err,
                        error: true,
                    });
                }

                if (results == 0 || results == null || results == undefined || results == "" || results <= 0) {
                    return res.status(400).json({
                        message: "El carrito está vacío",
                        error: true,
                    });
                }

            });
        } catch (error) {
            return res.status(400).json({
                message: "Error al obtener el total del carrito (error en el catch)",
                error: true,
            });

        }

        const ObtenerIdPago = `SELECT MAX(id) as id FROM pago `;
        const ObtenerIDPixelPay = `SELECT MAX(id) as id FROM pixel_pays`;
        let id_pago = 0;
        let id_pixel_pay = 0;
        //#region Obtener el id del pago
        try {
            db.query(ObtenerIdPago, (err, results) => {
                if (err) {
                    return res.status(400).json({
                        message:
                            "Error al obtener el id del pago (error en el query)" + err,
                        error: true,
                    });
                }

                if (results == 0 || results == null || results == undefined || results == "" || results <= 0) {
                    return res.status(400).json({
                        message: "No se encontró el id del pago",
                        error: true,
                    });
                }
                id_pago = results[0].id;
                id_pago = id_pago + 1;

            });
        }
        catch (error) {
            return res.status(400).json({
                message: "Error al obtener el id del pago (error en el catch)",
                error: true,
            });
        }

        //#region Obtener el id de pixel pay
        try {
            db.query(ObtenerIDPixelPay, (err, results) => {
                if (err) {
                    return res.status(400).json({
                        message:
                            "Error al obtener el id del pago (error en el query)" + err,
                        error: true,
                    });
                }

                if (results == 0 || results == null || results == undefined || results == "" || results <= 0) {
                    return res.status(400).json({
                        message: "No se encontró el id del pago",
                        error: true,
                    });
                }
                id_pixel_pay = results[0].id;
                id_pixel_pay = id_pixel_pay + 1;

            });
        }
        catch (error) {
            return res.status(400).json({
                message: "Error al obtener el id del pago (error en el catch)",
                error: true,
            });
        }

        let id_pixel_string = id_pixel_pay.toString();
        const paymentData = {
            customer_name: data.customer_name,
            card_number: data.card_number,
            card_holder: data.card_holder,
            card_expire: data.card_expire,
            card_cvv: data.card_cvv,
            customer_email: data.customer_email,
            billing_address: data.billing_address,
            billing_city: data.billing_city,
            billing_country: data.billing_country,
            billing_state: data.billing_state,
            billing_phone: data.billing_phone,
            order_id: id_pixel_string, // Este es el id del pago
            order_currency: data.order_currency, // Moneda
            order_amount: data.order_amount, // Monto
            env: data.env,
        };

        try {
            const response = await axios.post(
                "https://pixel-pay.com/api/v2/transaction/sale",
                paymentData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-auth-key": '1234567890',
                        "x-auth-hash": process.env.X_AUTH_HASH,
                        Accept: "application/json",
                    },
                }
            );


            const InsertarPago = `INSERT INTO Pago (User_id, total, status) VALUES ( ?, ?, 'Success')`;
            const InsertarPago_Detalle = `INSERT INTO Pago_Detalle (pago_id, product_id, cantidad, price) VALUES (?, ?, ?, ?)`;
            const rebajarInventario = `UPDATE products SET stock = stock - ? WHERE id = ?`;
            const InsertarPixelPay = `INSERT INTO pixel_pays (id, status, created_date) VALUES (?, ?, ?)`;
            
            //#region Guardar el pago en la base de datos
            try {
                db.query(InsertarPago, [data_user.user_id, data.order_amount], (error, results) => {
                    if (error) {
                        return res.status(400).json({
                            message: "Error al insertar el pago en la base de datos",
                            error: true,
                        });
                    }
                });
                
            } catch (error) {
                return res.status(400).json({
                    message: "Error al insertar el pago en la base de datos (error en el catch)",
                    error: true,
                });
            }
            //#region Guardar el detalle del pago en la base de datos
            try {
                data.cart_items.forEach(product => {

                    db.query(InsertarPago_Detalle, [id_pago, product.id, product.cantidad, product.price], (error, results) => {
                        if (error) {
                            return res.status(400).json({
                                message: "Error al insertar el detalle del pago en la base de datos",
                                error: true,
                            });
                        }
                    });
                });
                
            } catch (error) {
                funcionesRollBack.EliminarPago(id_pago);
                return res.status(400).json({
                    message: "Error al insertar el pago en la base de datos (error en el catch)",
                    error: true,
                });
            }

            //#region Rebajar el inventario

            try {
                data.cart_items.forEach(product => {
                    db.query(rebajarInventario, [product.cantidad, product.id], (error, results) => {
                        if (error) {
                            return res.status(400).json({
                                message: "Error al rebajar el inventario en la base de datos",
                                error: true,
                            });
                        }
                    });
                });
            } catch (error) {
                funcionesRollBack.EliminarPagoDetalle(id_pago);
                funcionesRollBack.EliminarPago(id_pago);
                return res.status(400).json({
                    message: "Error al rebajar el inventario en la base de datos (error en el catch)",
                    error: true,
                });
            }

            //#region Guardar el pixel pay en la base de datos
            try {
                db.query(InsertarPixelPay, [id_pixel_pay, 'Success', new Date()], (error, results) => {
                    if (error) {
                        return res.status(400).json({
                            message: "Error al insertar el pixel pay en la base de datos",
                            error: true,
                        });
                    }
                });
            } catch (error) {
                funcionesRollBack.RestaurarInventario(id_pago);
                funcionesRollBack.EliminarPagoDetalle(id_pago);
                funcionesRollBack.EliminarPago(id_pago);
                return res.status(400).json({
                    message: "Error al insertar el pixel pay en la base de datos (error en el catch)",
                    error: true,
                });
            }

            funcionesRollBack.LimpiarCarrito(data_user.cart_id);

            return res.status(200).json({
                message: "Pago realizado exitosamente",
                data: response.data,
            });


        } catch (error) {
            return res.status(400).json({
                message: "Error al realizar el pago (pixel pay)",
                error: error.response ? error.response.data : error.message,
            });
        }
    };

   
    //#region Obtener el historial de pagos
    static getPaymentHistory = (req, res) => {
        const { id } = req.params;
        const consulta =
            "SELECT id, total, userId, created_date FROM Pago WHERE userId = ?";

        try {
            db.query(consulta, [id], (err, results) => {
                if (err) {
                    return res.status(400).json({
                        message:
                            "Error al obtener el historial de pagos (error en el query)" +
                            err,
                        error: true,
                    });
                }

                if (results.length === 0) {
                    return res.status(400).json({
                        message: "No se encontró el historial de pagos",
                        error: true,
                    });
                }

                return res.header("Content-Type", "application/json").status(200).json({
                    message: "Historial de pagos",
                    payments: results,
                });
            });
        } catch (error) {
            return res.status(400).json({
                message: "Error al obtener el historial de pagos (error en el catch)",
                error: true,
            });
        }
    };
}

class funcionesRollBack {

    //#region Eliminar el pago
    static EliminarPago = (id_pago) => {
        const EliminarPago = `DELETE FROM Pago WHERE id = ?`;
        try {
            db.query(EliminarPago, [id_pago], (error, results) => {
                if (error) {
                    return res.status(400).json({
                        message: "Error al eliminar el pago en la base de datos",
                        error: true,
                    });
                }
            });
        } catch (error) {
            return res.status(400).json({
                message: "Error al eliminar el pago en la base de datos (error en el catch)",
                error: true,
            });
        }
    };

    //#region  Eliminar el detalle del pago
    static EliminarPagoDetalle = (id_pago) => {
        const EliminarPagoDetalle = `DELETE FROM Pago_Detalle WHERE pago_id = ?`;
        try {
            db.query(EliminarPagoDetalle, [id_pago], (error, results) => {
                if (error) {
                    return res.status(400).json({
                        message: "Error al eliminar el detalle del pago en la base de datos",
                        error: true,
                    });
                }
            });
        } catch (error) {
            return res.status(400).json({
                message: "Error al eliminar el detalle del pago en la base de datos (error en el catch)",
                error: true,
            });
        }
    }

    //#region  Restaurar el inventario
    static RestaurarInventario = (id_pago) => {
        const ObtenerProductos = `SELECT product_id, cantidad FROM Pago_Detalle WHERE pago_id = ?`;
        const ActualizarInventario = `UPDATE products SET stock = stock + ? WHERE id = ?`;

        try {
            db.query(ObtenerProductos, [id_pago], (error, results) => {
                if (error) {
                    return res.status(400).json({
                        message: "Error al obtener los productos del pago",
                        error: true,
                    });
                }

                results.forEach(product => {
                    db.query(ActualizarInventario, [product.cantidad, product.product_id], (error, results) => {
                        if (error) {
                            return res.status(400).json({
                                message: "Error al restaurar el inventario",
                                error: true,
                            });
                        }
                    });
                });
            });
        } catch (error) {
            return res.status(400).json({
                message: "Error al obtener los productos del pago (error en el catch)",
                error: true,
            });
        }
    }

    //#region Limpiar el carrito
    static LimpiarCarrito = (id_carrito) => {
        const EliminarCarrito = `DELETE FROM cart_items WHERE cart_id = ?`;
        try {
            db.query(EliminarCarrito, [id_carrito], (error, results) => {
                if (error) {
                    return res.status(400).json({
                        message: "Error al eliminar el carrito",
                        error: true,
                    });
                }
            });
        } catch (error) {
            return res.status(400).json({
                message: "Error al eliminar el carrito (error en el catch)",
                error: true,
            });
        }
    }

}