import db from "../config/db.js";
import "dotenv/config";
import axios from "axios";
import { promisify } from "util";

const query = promisify(db.query).bind(db);

export class paymentController {


    //#region  Realizar un pago
    static postPayment = async (req, res) => {
        const data = req.body;

        const data_user = {
            user_id: data.user_id,
            cart_id: data.cart_id,
        };

        try {
            // Verificar si el carrito está vacío
            const consultaCarrito = `
                SELECT CI.cart_id, SUM(Cantidad) AS total
                FROM cart_items AS CI
                INNER JOIN carts AS c ON CI.cart_id = c.id
                WHERE c.user_id = ?
                GROUP BY CI.cart_id`;

            const cartResults = await query(consultaCarrito, [data_user.user_id]);

            if (!cartResults.length || cartResults[0].total <= 0) {
                return res.status(400).json({ message: "El carrito está vacío", error: true });
            }

            // Obtener IDs para pago y PixelPay
            const ObtenerIdPago = `SELECT MAX(id) AS id FROM pago`;
            const ObtenerIDPixelPay = `SELECT MAX(id) AS id FROM pixel_pays`;

            const pagoResult = await query(ObtenerIdPago);
            const pixelPayResult = await query(ObtenerIDPixelPay);

            const id_pago = (pagoResult[0]?.id || 0) + 1;
            const id_pixel_pay = (pixelPayResult[0]?.id || 0) + 1;

            const id_pixel_string = id_pixel_pay.toString();

            console.log("id_pago", id_pago);
            console.log("id_pixel_pay", id_pixel_pay);
            // Datos para la solicitud a PixelPay
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
                order_id: id_pixel_string,
                order_currency: data.order_currency,
                order_amount: data.order_amount,
                env: data.env,
            };

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

            // Transacción en la base de datos
            await query('START TRANSACTION');

            const InsertarPago = `INSERT INTO pago (User_id, total, status) VALUES (?, ?, 'Success')`;
            await query(InsertarPago, [data_user.user_id, data.order_amount]);

            const InsertarPago_Detalle = `INSERT INTO pago_detalle (payment_id, product_id, cantidad, price) VALUES (?, ?, ?, ?)`;
            for (const product of data.cart_items) {
                await query(InsertarPago_Detalle, [id_pago, product.id, product.cantidad, product.price]);
            }

            const rebajarInventario = `UPDATE products SET stock = stock - ? WHERE id = ?`;
            for (const product of data.cart_items) {
                await query(rebajarInventario, [product.cantidad, product.id]);
            }

            const InsertarPixelPay = `INSERT INTO pixel_pays (pago_id, final_digits, holder, billing_address, currency, amount) VALUES (?, ?, ?, ?, ?, ?)`;
            await query(InsertarPixelPay, [id_pago, data.card_number.slice(-4), data.card_holder, data.billing_address, data.order_currency, data.order_amount]);

            await query('COMMIT');

            // Limpiar carrito
            const limpiarCarrito = `DELETE FROM cart_items WHERE cart_id = ?`;
            await query(limpiarCarrito, [data_user.cart_id]);

            return res.status(200).json({
                message: "Pago realizado exitosamente",
                data: response.data,
            });
        } catch (error) {
            await query('ROLLBACK');
            return res.status(400).json({
                message: "Error al realizar el pago",
                error: error.response ? error.response.data : error.message,
            });
        }
    };

   
    //#region Obtener el historial de pagos
    static getPaymentHistory = (req, res) => {
        const { id } = req.params;
        const consultaGeneral =
            `SELECT DISTINCT p.id as Pago_ID, pp.holder, pp.billing_address, SUM(pd.price*pd.cantidad) as total, pp.currency, pp.date, p.status 
                FROM pixel_pays AS pp
                INNER JOIN pago AS p on pp.Pago_ID = p.id
                INNER JOIN pago_detalle AS pd ON p.id =pd.payment_id AND pp.Pago_ID = pd.payment_id
            WHERE p.user_id = ?
                GROUP BY p.id, pp.holder, pp.billing_address, pp.currency, pp.date, p.status `;

        const consultaProductos = `
            SELECT DISTINCT p.name, pd.price, pd.cantidad 
                FROM products AS p
                INNER JOIN pago_detalle AS pd ON p.id = pd.product_id
            WHERE pd.payment_id = ?`;        

        try {
            db.query(consultaGeneral, [id], (err, results) => {
                if (err) {
                    return res.status(400).json({
                        message: "Error al obtener el historial de pagos",
                        error: true,
                    });
                }

                if (!results.length) {
                    return res.status(400).json({
                        message: "No hay pagos realizados",
                        error: true,
                    });
                }

                const pagos = results.map(async (pago) => {
                    const productos = await query(consultaProductos, [pago.Pago_ID]);
                    return {
                        ...pago,
                        productos,
                    };
                });

                Promise.all(pagos).then((pagos) => {
                    return res.status(200).json({
                        message: "Historial de pagos",
                        data: pagos,
                    });
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
//#endregion