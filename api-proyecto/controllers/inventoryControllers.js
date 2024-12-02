import db from '../config/db.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import 'dotenv/config';

export class inventoryController{


    static restockInventory = (req, res) => {
        const consulta = `INSERT INTO Inventory (productId, changeAmount,changeType, createdAt) 
                        VALUES (?, ?, ?, ?)`;
        const data = req.body;


        try {
            const { productId, changeAmount,changeType, createdAt} = data;
            db.query(consulta, [productId, changeAmount,changeType, createdAt], (error, results) => {
                
                if(error)
                {
                    return res.status(400)
                                .json({
                                    message: "Error al ingresar inventario (error en el query)  " + error,
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
                            message: "Error al ingresar inventario (error en el catch)",
                            error: true
                        });
        }
        
    }

    static getInventoryById = (req, res) => {
        const { id } = req.params;
        const consulta = "SELECT id , name, description, stock, price FROM Products WHERE id = ?";

        try {
            db.query(consulta, [id], (err, results) => {
                
                if (err) {
                    return res.status(400)
                              .json({
                                  message: "Error al obtener el inventario (error en el query)" + err,
                                  error: true
                              });
                }

                if (results.length === 0) {
                    return res.status(400)
                              .json({
                                  message: "No se encontró el inventario",
                                  error: true
                              });
                }

                return res.header("Content-Type", "application/json")
                          .status(200)
                          .json(results[0]);
            });
        } catch (error) {
            return res.status(400)
                      .json({
                          message: "Error al obtener el inventario (error en el catch)",
                          error: true
                      });
        }
    }







}