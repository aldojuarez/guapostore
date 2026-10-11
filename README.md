# GuapoStore API

Una API REST ligera desarrollada con Node.js y Express, diseñada específicamente con fines educativos para enseñar el consumo y manipulación de datos desde **React** (GET, POST, PUT, DELETE) sin necesidad de configurar un backend complejo.

Actualmente se encuentra desplegada y pública en:  
`https://guapostore.onrender.com/api`

---

## Estructura de Datos (Modelo de Producto)

Cada recurso dentro de la tienda cuenta con la siguiente estructura JSON:

```json
{
  "id": 1,
  "nombre": "Camisa Casual Slim Fit",
  "precio": 699.00,
  "categoria": "Ropa",
  "imagen": "https://images.unsplash.com/...",
  "stock": 12,
  "usuario": "Profesor"
}
```
*El campo `usuario` almacena el apellido del alumno que realizó el registro o la última modificación.*

---

## Endpoints Disponibles

### 1. Obtener todos los productos
Devuelve un arreglo con todos los productos disponibles en la tienda.
* **URL:** `https://guapostore.onrender.com/api/productos`
* **Método:** `GET`

### 2. Crear un nuevo producto
Registra un nuevo artículo en la tienda (el sistema autoincrementa el `id`).
* **URL:** `https://guapostore.onrender.com/api/productos`
* **Método:** `POST`
* **Headers:** `Content-Type: application/json`
* **Body de ejemplo:**
  ```json
  {
    "nombre": "Tenis Deportivos",
    "precio": 1499.00,
    "categoria": "Calzado",
    "imagen": "https://images.unsplash.com/...",
    "stock": 10,
    "usuario": "Juárez"
  }
  ```

### 3. Actualizar un producto
Modifica parcial o totalmente los datos de un producto existente buscándolo por su ID.
* **URL:** `https://guapostore.onrender.com/api/productos/:id` (Ej: `/api/productos/1`)
* **Método:** `PUT`
* **Headers:** `Content-Type: application/json`
* **Body de ejemplo:**
  ```json
  {
    "precio": 1299.00,
    "stock": 5,
    "usuario": "Juárez"
  }
  ```

### 4. Eliminar un producto
Borra un producto del catálogo de forma permanente.
* **URL:** `https://guapostore.onrender.com/api/productos/:id` (Ej: `/api/productos/2`)
* **Método:** `DELETE`

---
