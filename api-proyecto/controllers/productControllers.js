import db from '../config/db.js';
import { ValidateProduct } from '../schemas/productSchema.js';


export class productController {

    //#region Obtener todos los productos
    static getAllProducts = (req, res) => {
        const consulta = "SELECT id, name, description, price, stock FROM products";

        try {
            db.query(consulta, (err, results) => {
                
                if (err) {
                    return res.status(400)
                              .json({
                                  message: "Error al obtener los productos (error en el query)" + err,
                                  error: true
                              });
                }

                if (results.length === 0) {
                    return res.status(400)
                              .json({
                                  message: "No se encontraron productos",
                                  error: true
                              });
                }

                return res.header("Content-Type", "application/json")
                          .status(200)
                          .json(results);
            });
        } catch (error) {
            return res.status(400)
                      .json({
                          message: "Error al obtener los productos (error en el catch)",
                          error: true
                      });
        }
    }

    // Obtener un producto específico por ID
    static getProductById = (req, res) => {
        const { productId } = req.params;
        const consulta = "SELECT id as productId, name, description, price, stock FROM products WHERE id = ?";

        try {
            db.query(consulta, [productId], (err, results) => {
                
                if (err) {
                    return res.status(400)
                              .json({
                                  message: "Error al obtener el producto (error en el query)" + err,
                                  error: true
                              });
                }

                if (results.length === 0) {
                    return res.status(400)
                              .json({
                                  message: "No se encontró el producto",
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
                          message: "Error al obtener el producto (error en el catch)",
                          error: true
                      });
        }
    }

    // Crear un nuevo producto
    static createProduct = (req, res) => {
        const consulta = "INSERT INTO products (name, description, price, stock, stock_minimo) VALUES (?, ?, ?, ?, ?)";
        const { name, description, price, stock, stock_minimo} = req.body;
        
        const data = req.body;

        const { success, error } = ValidateProduct(data);

        if(!success){
            return res.status(400)
                        .json({
                            message: "Error al crear el producto (error en el schema)" + error,
                            error: true
                        });
        }

        try {
            db.query(consulta, [name, description, price, stock, stock_minimo], (err, results) => {
                
                if (err) {
                    return res.status(400)
                              .json({
                                  message: "Error al crear el producto (error en el query)" + err,
                                  error: true
                              });
                }

                return res.header("Content-Type", "application/json")
                          .status(200)
                          .json({
                              message: "Producto creado exitosamente",
                              productId: results.insertId
                          });
            });
        } catch (error) {
            return res.status(400)
                      .json({
                          message: "Error al crear el producto (error en el catch)",
                          error: true
                      });
        }
    }

    // Actualizar un producto existente
    static updateProduct = (req, res) => {
        const { productId } = req.params;
        const { name, description, price, stock, stock_minimo } = req.body;
        const consulta = "UPDATE products SET name = ?, description = ?, price = ?, stock = ?, stock_minimo = ? WHERE id = ?";

        try {
            db.query(consulta, [ name, description, price, stock, stock_minimo, productId], (err, results) => {
                
                if (err) {
                    return res.status(400)
                              .json({
                                  message: "Error al actualizar el producto (error en el query)" + err,
                                  error: true
                              });
                }

                if (results.affectedRows === 0) {
                    return res.status(400)
                              .json({
                                  message: "No se encontró el producto para actualizar",
                                  error: true
                              });
                }

                return res.header("Content-Type", "application/json")
                          .status(200)
                          .json({
                              message: "Producto actualizado exitosamente"
                          });
            });
        } catch (error) {
            return res.status(400)
                      .json({
                          message: "Error al actualizar el producto (error en el catch)",
                          error: true
                      });
        }
    }

    // Eliminar un producto
    static deleteProduct = (req, res) => {
        const { productId } = req.params;
        const consulta = "DELETE FROM products WHERE id = ?";

        try {
            db.query(consulta, [productId], (err, results) => {
                
                if (err) {
                    return res.status(400)
                              .json({
                                  message: "Error al eliminar el producto (error en el query)" + err,
                                  error: true
                              });
                }

                if (results.affectedRows === 0) {
                    return res.status(400)
                              .json({
                                  message: "No se encontró el producto para eliminar",
                                  error: true
                              });
                }

                return res.header("Content-Type", "application/json")
                          .status(200)
                          .json({
                              message: "Producto eliminado exitosamente"
                          });
            });
        } catch (error) {
            return res.status(400)
                      .json({
                          message: "Error al eliminar el producto (error en el catch)",
                          error: true
                      });
        }
    }
}
