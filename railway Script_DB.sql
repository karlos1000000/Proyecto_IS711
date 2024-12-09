/*
 Navicat MySQL Dump SQL

 Source Server         : Proyecto Disenio
 Source Server Type    : MySQL
 Source Server Version : 90100 (9.1.0)
 Source Host           : junction.proxy.rlwy.net:34615
 Source Schema         : railway

 Target Server Type    : MySQL
 Target Server Version : 90100 (9.1.0)
 File Encoding         : 65001

 Date: 08/12/2024 21:48:19
*/


DROP DATABASE IF EXISTS railway;
CREATE DATABASE railway;

USE railway;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for cart_items
-- ----------------------------
DROP TABLE IF EXISTS `cart_items`;
CREATE TABLE `cart_items`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `cart_id` int NOT NULL,
  `product_id` int NOT NULL,
  `cantidad` int NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `cart_id`(`cart_id` ASC) USING BTREE,
  INDEX `product_id`(`product_id` ASC) USING BTREE,
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 22 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of cart_items
-- ----------------------------
INSERT INTO `cart_items` VALUES (1, 1, 1, 1);
INSERT INTO `cart_items` VALUES (2, 1, 2, 2);
INSERT INTO `cart_items` VALUES (3, 2, 3, 1);
INSERT INTO `cart_items` VALUES (4, 2, 4, 1);
INSERT INTO `cart_items` VALUES (5, 3, 5, 2);
INSERT INTO `cart_items` VALUES (18, 6, 4, 3);
INSERT INTO `cart_items` VALUES (21, 7, 4, 3);

-- ----------------------------
-- Table structure for carts
-- ----------------------------
DROP TABLE IF EXISTS `carts`;
CREATE TABLE `carts`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `created_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of carts
-- ----------------------------
INSERT INTO `carts` VALUES (1, 3, '2024-12-02 04:53:03');
INSERT INTO `carts` VALUES (2, 4, '2024-12-02 04:53:03');
INSERT INTO `carts` VALUES (3, 5, '2024-12-02 04:53:03');
INSERT INTO `carts` VALUES (4, 8, '2024-12-07 06:07:33');
INSERT INTO `carts` VALUES (5, 10, '2024-12-07 22:18:47');
INSERT INTO `carts` VALUES (6, 16, '2024-12-09 01:56:31');
INSERT INTO `carts` VALUES (7, 17, '2024-12-09 02:12:56');
INSERT INTO `carts` VALUES (8, 18, '2024-12-09 02:22:48');
INSERT INTO `carts` VALUES (9, 19, '2024-12-09 02:30:23');
INSERT INTO `carts` VALUES (10, 21, '2024-12-09 02:30:47');
INSERT INTO `carts` VALUES (11, 22, '2024-12-09 02:31:20');
INSERT INTO `carts` VALUES (12, 23, '2024-12-09 02:31:37');
INSERT INTO `carts` VALUES (13, 24, '2024-12-09 02:36:28');
INSERT INTO `carts` VALUES (14, 25, '2024-12-09 02:45:18');
INSERT INTO `carts` VALUES (15, 26, '2024-12-09 02:45:55');
INSERT INTO `carts` VALUES (16, 27, '2024-12-09 03:11:50');

-- ----------------------------
-- Table structure for pago
-- ----------------------------
DROP TABLE IF EXISTS `pago`;
CREATE TABLE `pago`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `total` decimal(10, 2) NOT NULL,
  `status` enum('success','failed','pending') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'success',
  `created_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  CONSTRAINT `pago_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of pago
-- ----------------------------
INSERT INTO `pago` VALUES (1, 3, 1250.00, 'success', '2024-12-02 04:53:36');
INSERT INTO `pago` VALUES (2, 4, 225.00, 'success', '2024-12-02 04:53:36');
INSERT INTO `pago` VALUES (3, 5, 90.00, 'success', '2024-12-02 04:53:36');
INSERT INTO `pago` VALUES (4, 3, 1200.00, 'success', '2024-12-02 04:53:36');
INSERT INTO `pago` VALUES (5, 4, 75.00, 'success', '2024-12-02 04:53:36');
INSERT INTO `pago` VALUES (11, 4, 6.00, 'success', '2024-12-07 07:19:45');
INSERT INTO `pago` VALUES (12, 8, 1.00, 'success', '2024-12-07 07:20:24');
INSERT INTO `pago` VALUES (13, 8, 1.00, 'success', '2024-12-07 20:26:18');
INSERT INTO `pago` VALUES (14, 8, 1.00, 'success', '2024-12-09 01:20:48');
INSERT INTO `pago` VALUES (15, 8, 1.00, 'success', '2024-12-09 01:21:57');
INSERT INTO `pago` VALUES (16, 8, 1.00, 'success', '2024-12-09 02:19:13');

-- ----------------------------
-- Table structure for pago_detalle
-- ----------------------------
DROP TABLE IF EXISTS `pago_detalle`;
CREATE TABLE `pago_detalle`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `payment_id` int NOT NULL,
  `product_id` int NOT NULL,
  `cantidad` int NOT NULL,
  `price` decimal(10, 2) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `payment_id`(`payment_id` ASC) USING BTREE,
  INDEX `product_id`(`product_id` ASC) USING BTREE,
  CONSTRAINT `pago_detalle_ibfk_1` FOREIGN KEY (`payment_id`) REFERENCES `pago` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `pago_detalle_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 21 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of pago_detalle
-- ----------------------------
INSERT INTO `pago_detalle` VALUES (1, 1, 1, 1, 1200.00);
INSERT INTO `pago_detalle` VALUES (2, 1, 2, 2, 25.00);
INSERT INTO `pago_detalle` VALUES (3, 2, 3, 1, 75.00);
INSERT INTO `pago_detalle` VALUES (4, 2, 4, 1, 150.00);
INSERT INTO `pago_detalle` VALUES (5, 4, 5, 2, 45.00);
INSERT INTO `pago_detalle` VALUES (10, 4, 1, 1, 45.00);
INSERT INTO `pago_detalle` VALUES (11, 12, 1, 2, 1200.00);
INSERT INTO `pago_detalle` VALUES (12, 12, 2, 1, 25.00);
INSERT INTO `pago_detalle` VALUES (13, 13, 1, 2, 1200.00);
INSERT INTO `pago_detalle` VALUES (14, 13, 2, 1, 25.00);
INSERT INTO `pago_detalle` VALUES (15, 14, 1, 2, 1200.00);
INSERT INTO `pago_detalle` VALUES (16, 14, 2, 1, 25.00);
INSERT INTO `pago_detalle` VALUES (17, 15, 1, 2, 1200.00);
INSERT INTO `pago_detalle` VALUES (18, 15, 2, 1, 25.00);
INSERT INTO `pago_detalle` VALUES (19, 16, 1, 2, 1200.00);
INSERT INTO `pago_detalle` VALUES (20, 16, 2, 1, 25.00);

-- ----------------------------
-- Table structure for pixel_pays
-- ----------------------------
DROP TABLE IF EXISTS `pixel_pays`;
CREATE TABLE `pixel_pays`  (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Pago_ID` int NOT NULL,
  `final_digits` varchar(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `holder` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `billing_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `currency` varchar(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `amount` float(12, 2) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `FK_pixel_Pago`(`Pago_ID` ASC) USING BTREE,
  CONSTRAINT `FK_pixel_Pago` FOREIGN KEY (`Pago_ID`) REFERENCES `pago` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of pixel_pays
-- ----------------------------
INSERT INTO `pixel_pays` VALUES (1, 5, '3452', 'Gerson Murillo', 'San pedro sula', 'HNL', 192.00, '2024-12-07 04:57:58');
INSERT INTO `pixel_pays` VALUES (2, 12, '1111', 'John Doe', 'Col. Jardines del valle', 'USD', 1.00, '2024-12-07 07:20:24');
INSERT INTO `pixel_pays` VALUES (3, 13, '1111', 'John Doe', 'Col. Jardines del valle', 'USD', 1.00, '2024-12-07 20:26:19');
INSERT INTO `pixel_pays` VALUES (4, 14, '1111', 'John Doe', 'Col. Jardines del valle', 'USD', 1.00, '2024-12-09 01:20:48');
INSERT INTO `pixel_pays` VALUES (5, 15, '1111', 'John Doe', 'Col. Jardines del valle', 'USD', 1.00, '2024-12-09 01:21:58');
INSERT INTO `pixel_pays` VALUES (6, 16, '1111', 'Carlos Trejo', 'Col. Jardines del valle', 'USD', 1.00, '2024-12-09 02:19:13');

-- ----------------------------
-- Table structure for products
-- ----------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `price` decimal(10, 2) NOT NULL,
  `stock` int NOT NULL,
  `Stock_minimo` int NULL DEFAULT 10,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of products
-- ----------------------------
INSERT INTO `products` VALUES (1, 'Laptop', '15 pulgadas, 8GB RAM', 1200.00, 9, 10);
INSERT INTO `products` VALUES (2, 'Mouse', 'Inalámbrico, ergonómico', 25.00, 53, 15);
INSERT INTO `products` VALUES (3, 'Teclado', 'Mecánico, RGB', 75.00, 20, 10);
INSERT INTO `products` VALUES (4, 'Monitor', '24 pulgadas, Full HD', 150.00, 5, 5);
INSERT INTO `products` VALUES (5, 'Cámara Web', '1080p, micrófono integrado', 45.00, 10, 5);
INSERT INTO `products` VALUES (7, 'Parlante', 'XBOOM de 20 WATTS', 115.00, 20, 10);

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('administrador','cliente') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'cliente',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE,
  UNIQUE INDEX `email`(`email` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 28 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'admin1', 'admin1@example.com', '$2a$12$1O7Sc3bmF9g4nUlzROoMBup1yHyUXRUdhbGh/qiijVQKjlAkGAsQ.', 'administrador');
INSERT INTO `users` VALUES (2, 'admin2', 'admin2@example.com', '$2a$12$E.Io3oRgGUBAjTK.esgj5.Ecj5ZjNR1VON2mf7zzUkt3BENq7HhTy', 'administrador');
INSERT INTO `users` VALUES (3, 'client1', 'client1@example.com', '$2a$12$PnByhHq1/x3yvVpKl7QmouLkCBCziI6YpmwCFN1KnG1S.aPZ.oGPq', 'cliente');
INSERT INTO `users` VALUES (4, 'client2', 'client2@example.com', '$2a$12$TSB6FuyL.GyRZh/Z6DvuQ.y5mfwk./ukN.UKQKkffMlafKwmmXDg.\n', 'cliente');
INSERT INTO `users` VALUES (5, 'client3', 'client3@example.com', '$2a$12$YcxgmuPLZe2GJojaSZZ/u.wCKt3ig1XBVPcxGrlX5G0yc8xxjtohO', 'cliente');
INSERT INTO `users` VALUES (6, 'Carlos Trejo', 'ctrejom@ejemplo.com', '$2b$10$pD.t34pK5j29WooMbhpQxO/d7mQX4gdFk23vVPReA8Y/nMAegJ06.', 'cliente');
INSERT INTO `users` VALUES (7, 'Mario Flores', 'mario@ejemplo.com', '$2b$10$xhC0O4S2PDdkkWX25K/j6.Fx6LtEc4C7OIALvu/zJWgTNC64cFazG', 'cliente');
INSERT INTO `users` VALUES (8, 'gerson', 'gmurillop@unah.hn', '$2b$10$qBOPm1y9Y9REFx2L5t1mkePWOBfaifWxCmwn2siSwBiTgvngmYv8i', 'cliente');
INSERT INTO `users` VALUES (10, 'murillo', 'gmurillom@unah.hn', '$2b$10$0dJhBvHUwKNghRXurh6OU.vWDwF2M4l.nYPvY4bmD/zrT9Nncof6y', 'administrador');
INSERT INTO `users` VALUES (11, 'Mario Martinez', 'mariomartinez@ejemplo.com', '$2b$10$qJycLMWfOAt9qEwKoACBse05/z8daszqcco2CgDKUNNCcOWwXmw/6', 'administrador');
INSERT INTO `users` VALUES (12, 'Mario Oscar', 'mariooscar@ejemplo.com', '$2b$10$ivTYHiC.3O49ZpUbrAmZIui6/WTRohhYuxbySw6MSnYSk4OqrONvC', 'cliente');
INSERT INTO `users` VALUES (13, 'Mario Luigi', 'mariobros@ejemplo.com', '$2b$10$6lYtWnh0Dm9bMtjak6LzpuaFIYAGwP1R8VXkuwwn2yLW0cllJJQ8.', 'cliente');
INSERT INTO `users` VALUES (14, 'Mario Wario', 'mariowario@ejemplo.com', '$2b$10$rNop5.PlpX11vGlq3yub5ONc5z82TnlHzGvmjUNVPbKAkj6G2pNu6', 'cliente');
INSERT INTO `users` VALUES (16, 'Mario Pario', 'mariopario@ejemplo.com', '$2b$10$IrsLvkkD7m0nBDiltghIzOTvbyF4pbcO7mcIDd5XxGxwUA6AZrW.W', 'cliente');
INSERT INTO `users` VALUES (17, 'Mario Barahona', 'mariobarahona@ejemplo.com', '$2b$10$VB0bhWsGx4uIO3h9JO5E4upxg6DSFui8e7/j9sR0XCVfL8Gf3VK7e', 'cliente');
INSERT INTO `users` VALUES (18, 'Mario Castañeda', 'mariocastaneda@ejemplo.com', '$2b$10$E9ylkomjxY2nj0Z7llPZUuhN/uOZ7qmYdALxB54K7CwQcomuaD4rK', 'cliente');
INSERT INTO `users` VALUES (19, 'Mario loco', 'marioloco@ejemplo.com', '$2b$10$sa4QxlpeItYCTJwpr3.uT.3iysdpmSstCAzmUlqbe8um1XBZuerWm', 'cliente');
INSERT INTO `users` VALUES (21, 'Mario locs', 'mariol@ejemplo.com', '$2b$10$2GKLZriHlK3c/Wki/cJlt.tRfjIfRVPYZvZhSBiz4l0CaV94W.XpK', 'cliente');
INSERT INTO `users` VALUES (22, 'Mario locsadas', 'marioasdafad@ejemplo.com', '$2b$10$LmsEJg6X/4DhdxBdRutc2uZxygDRdKhBLihysO/MILT9RHTi.CSku', 'cliente');
INSERT INTO `users` VALUES (23, 'Mario wsadas', 'marioasdad@ejemplo.com', '$2b$10$.PZLOi.DM6ItPt6lccIe3OC5RhByEFbHT57YxU.zyIMbKaV61AJJu', 'cliente');
INSERT INTO `users` VALUES (24, 'Mario wgjtks', 'mariogkhu@ejemplo.com', '$2b$10$UAOCraX.jIbez.PxfM7uMepxzjHfjQQhZQ49Ls2atFIdT1vIiL9JS', 'cliente');
INSERT INTO `users` VALUES (25, 'Mario wgloxasks', 'mariogptsm@ejemplo.com', '$2b$10$KmrcvC37.cZgej4pE6Kmj.jjdISqEapZEK7c/a.d.rxCbSXpUAsu2', 'cliente');
INSERT INTO `users` VALUES (26, 'Mariopisn', 'marmiogpts@ejemplo.com', '$2b$10$XqMsYpoHm2jVjvHFE2uPZOAEYzSJ13DW08qc.B8xUzu6jR4DakQSq', 'cliente');
INSERT INTO `users` VALUES (27, 'Javier Perez', 'JavierPerez@gmail.com', '$2b$10$0S.XVG0A4iUKpPAqDV6eqOCnsyeRosr0OpLNBe9TQHaBv9qT/Cgai', 'cliente');

SET FOREIGN_KEY_CHECKS = 1;
