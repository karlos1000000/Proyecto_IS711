import db from "../config/db.js";
import "dotenv/config";
import axios from "axios";

export class paymentController {

    static postPayment = async (req, res) => {
        const data = req.body;

        const data_user = 
        {
            user_id: data.user.id,
            cart_id: data.cart_id
        };

        const consultaCarrito = `SELECT CI.cart_id SUM(Cantidad) FROM cart_items as CI
                          inner join carts AS c ON CI.cart_id = c.id 
                          WHERE c.user_id = ?
                          group by CI.cart_id`;

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
            order_id: id_pixel_pay, // Este es el id del pago
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
                        "x-auth-key": process.env.X_AUTH_KEY,
                        "x-auth-hash": process.env.X_AUTH_HASH,
                        Accept: "application/json",
                    },
                }
            );

            //#region Guardar el pago en la base de datos

            const consultaPago = `INSERT INTO Pago (User_id, total, status) VALUES ( ?, ?, ?)`;
            const consultaPago_Detalle = `INSERT INTO Pago_Detalle (payment_id, product_id, cantidad, price) VALUES (?, ?, ?, ?)`;
            const rebajarInventario = `UPDATE products SET stock = stock - ? WHERE id = ?`;
    
            

            return res.status(200).json({
                message: "Pago realizado exitosamente",
                data: response.data,
            });
        } catch (error) {
            return res.status(400).json({
                message: "Error al realizar el pago",
                error: error.response ? error.response.data : error.message,
            });
        }
    };

   

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
