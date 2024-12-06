import db from '../config/db.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import 'dotenv/config';

export class paymentController{


    static postPayment = (req, res) => {

    }

    static checkOut = (req, res) => {
        const consultaPago = `INSERT INTO Pago (User_id, total, status) VALUES ( ?, ?, ?)`;
        const ObtenerIdPago = `SELECT id FROM Pago WHERE User_id = ? AND total = ? AND status = ?`;
        const consultaPago_Detalle = `INSERT INTO Pago_Detalle (payment_id, product_id, cantidad, price) VALUES (?, ?, ?, ?)`; 
                        
        const data = req.body;

        try {
            db.query(consultaPago, [data.User_id, data.total, data.status], (err, results) => {
                
                if (err) {
                    return res.status(400)
                            .json({
                                message: "Error al realizar el pago (error en el query)" + err,
                                error: true
                    });
                } 

                if (results.affectedRows === 0) {
                    return res.status(400)
                            .json({
                                message: "No se realizó el pago",
                                error: true
                            });
                }

                db.query(ObtenerIdPago, [data.User_id, data.total, data.status], (err, results) => {
                    if (err) {
                        return res.status(400)
                                .json({
                                    message: "Error al obtener el id del pago (error en el query)" + err,
                                    error: true
                        });
                    } 

                    if (results.length === 0) {
                        return res.status(400)
                                .json({
                                    message: "No se encontró el id del pago",
                                    error: true
                                });
                    }

                    const payment_id = results[0].id;

                    data.products.forEach(product => {
                        db.query(consultaPago_Detalle, [payment_id, product.id, product.cantidad, product.price], (err, results) => {
                            if (err) {
                                return res.status(400)
                                        .json({
                                            message: "Error al realizar el pago (error en el query)" + err,
                                            error: true
                                });
                            } 

                            if (results.affectedRows === 0) {
                                return res.status(400)
                                        .json({
                                            message: "No se realizó el pago",
                                            error: true
                                        });
                            }
                        });
                    });

                    return res.header("Content-Type", "application/json")
                            .status(200)
                            .json({
                                message: "Pago realizado exitosamente",
                                paymentId: payment_id
                            });
                });
            });

        } catch (error) {
            
            return res.status(400)
                    .json({
                        message: "Error al realizar el pago (error en el catch)",
                        error: true
            });
        }
    }

    static getPaymentHistory = (req, res) => {
        const { id } = req.params;
        const consulta = "SELECT id, total, userId, created_date FROM Pago WHERE userId = ?";

        try {
           
            db.query(consulta, [id], (err, results) => {
                
                if (err) {
                    return res.status(400)
                            .json({
                                message: "Error al obtener el historial de pagos (error en el query)" + err,
                                error: true
                    });
                }

                if (results.length === 0) {
                    return res.status(400)
                            .json({
                                message: "No se encontró el historial de pagos",
                                error: true
                            });
                }

                return res.header("Content-Type", "application/json")
                        .status(200)
                        .json({
                            message: "Historial de pagos",
                            payments: results
                        });
            });
        } catch (error) {
            
            return res.status(400)
                    .json({
                        message: "Error al obtener el historial de pagos (error en el catch)",
                        error: true
            });
    
        }
    }
}