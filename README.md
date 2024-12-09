# Proyecto_IS711
Gerson Adalid Murillo Palma
Carlos Roberto Osegueda Mejía
Carlos David Trejo Mejia

-
# Proyecto: API de Gestión de Carrito e Inventario

## Notas de Ejecución

### Dependencias
Para instalar las dependencias, usar el comando:

```bash
npm install [dependencia]
```

### Ejecucion del proyecto
Desplazarse a la ubicacion del index.js

```bash
cd api-proyecto
```

#### Lista de dependencias
```json
{
  "bcrypt": "^5.1.1",
  "cors": "^2.8.5",
  "dotenv": "^16.4.5",
  "express": "^4.21.1",
  "mysql2": "^3.11.4",
  "zod": "^3.23.8",
  "@pixelpay/sdk-core": "^2.3.1",
  "jsonwebtoken": "^9.0.2"
}
```

### Configuración del Archivo `.env`

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
HOST=junction.proxy.rlwy.net    		//Host del servidor DB
PORT=34615					//Base de datos DB
USER=root					//usuario DB
PASSWORD=oxidvdgpYJBNhmALjMDzkaxTzeMOVyly	//password DB
DATABASE=railway				//Nombre de la DB
SECRET_KEY=1b7788f8bad1001efbb61930167e687f
X_AUTH_KEY=1234567890
X_AUTH_HASH=36cdf8271723276cb6f94904f8bde4b6
```

---

## Rutas de la API

### Rutas accesibles sin autenticación

**Registro de usuario**  
POST `https://proyecto-is711-4npw.onrender.com/auth/register`

```json
{
  "username": "Javier Perez",
  "email": "JavierPerez@gmail.com",
  "password": "perez123",
  "role": "cliente"
}
```

**Inicio de sesión**  
POST `https://proyecto-is711-4npw.onrender.com/auth/login`

```json
{
  "username": "Javier Perez",
  "password": "perez123"
}
```

---

### Rutas disponibles para clientes

**Mostrar carrito por ID**  
GET `https://proyecto-is711-4npw.onrender.com/cart/:user_id`

**Agregar un ítem al carrito**  
POST `https://proyecto-is711-4npw.onrender.com/cart/`

```json
{
  "cart_id": 7,
  "product_id": 4,
  "cantidad": 3
}
```

**Eliminar un ítem del carrito**  
DELETE `https://proyecto-is711-4npw.onrender.com/cart/:cart_id/:product_id`

**Realizar un pago (PixelPay)**  
POST `https://proyecto-is711-4npw.onrender.com/payment/checkout`

```json
{
  "user_id": 8,
  "cart_id": 4,
  "cart_items": [
    {
      "id": 1,
      "cantidad": 2,
      "price": 1200.00
    },
    {
      "id": 2,
      "cantidad": 1,
      "price": 25.00
    }
  ],
  "customer_name": "Javier Perez",
  "card_number": "4111111111111111",
  "card_holder": "Javier Perez",
  "card_expire": "2512",
  "card_cvv": "999",
  "customer_email": "JavierPerez@gmail.com",
  "billing_address": "Col. Jardines del valle",
  "billing_city": "Sula",
  "billing_country": "HN",
  "billing_state": "HN-CR",
  "billing_phone": "+1234567890",
  "order_currency": "USD",
  "order_amount": "1",
  "env": "sandbox"
}
```

**Historial de pagos por usuario**  
GET `https://proyecto-is711-4npw.onrender.com/payment/history/:user_id`

---

### Rutas disponibles para administradores

**Reabastecer stock**  
POST `https://proyecto-is711-4npw.onrender.com/inventory/restock`

```json
{
  "stock": 4,
  "id": 2
}
```

**Mostrar inventario por ID de producto**  
GET `https://proyecto-is711-4npw.onrender.com/inventory/:product_id`

**Reportes de inventario y ventas**  
GET Inventario: `https://proyecto-is711-4npw.onrender.com/report/inventory`  
GET Ventas: `https://proyecto-is711-4npw.onrender.com/report/sales/:start_date/:end_date`

**Operaciones sobre productos**  
- Mostrar todos los productos  
  GET `https://proyecto-is711-4npw.onrender.com/products/`

- Mostrar producto por ID  
  GET `https://proyecto-is711-4npw.onrender.com/products/:product_id`

- Crear un nuevo producto  
  POST `https://proyecto-is711-4npw.onrender.com/products/`

  ```json
  {
    "name": "Parlante",
    "description": "XBOOM de 20 WATTS",
    "price": 125.00,
    "stock": 15,
    "stock_minimo": 10
  }
  ```

- Actualizar un producto  
  PUT `https://proyecto-is711-4npw.onrender.com/products/:product_id`

  ```json
  {
    "name": "Parlante",
    "description": "XBOOM de 20 WATTS",
    "price": 115.00,
    "stock": 15,
    "stock_minimo": 10
  }
  ```

- Eliminar un producto  
  DELETE `https://proyecto-is711-4npw.onrender.com/products/:product_id`

---
