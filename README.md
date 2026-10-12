# 🛍️ GuapoStore API

API REST ligera construida con Node.js y Express para el proyecto integrador del curso de React. Cuenta con autenticación por roles, gestión de productos y administración de usuarios.

---

## 🚀 URL Base (Base URL)
`https://guapostore.onrender.com/api`

---

## 👥 Roles de Usuario y Permisos

1. **`cliente`**: Solo puede consultar el catálogo de productos (`GET`). No puede crear, modificar ni eliminar.
2. **`admin`**: Tiene control total sobre la tienda (Crear, Editar y Eliminar productos), pero **no tiene acceso** a la gestión de usuarios.
3. **`superadmin`**: Control total absoluto sobre la tienda **y** exclusividad para ver, crear y modificar cuentas de usuario.

### Credenciales por defecto para pruebas:
* **Superadmin:** `username: superadmin` | `password: 123`
* **Admin:** `username: admin` | `password: 123`
* **Cliente:** `username: cliente` | `password: 123`

---

## 🔐 Endpoints de Autenticación

### Iniciar Sesión (Login)
* **URL:** `/login`
* **Método:** `POST`
* **Body:**
  ```json
  {
    "username": "admin",
    "password": "123"
  }
  ```
* **Respuesta (`200 OK`):** Devuelve los datos del usuario y su `rol` para que la aplicación de React controle el acceso y las vistas.

---

## 📦 Endpoints de Productos

### 1. Obtener todos los productos
* **URL:** `/productos`
* **Método:** `GET`
* **Respuesta (`200 OK`):** Retorna un arreglo con los 8 productos iniciales del catálogo.

### 2. Crear un nuevo producto
* **URL:** `/productos`
* **Método:** `POST`
* **Restricción:** Solo `admin` y `superadmin`.
* **Body:**
  ```json
  {
    "nombre": "Chamarra de Piel",
    "precio": 1999,
    "categoria": "Ropa",
    "imagen": "https://images.unsplash.com/...",
    "stock": 5,
    "rol": "admin",
    "usuario": "admin"
  }
  ```

### 3. Actualizar un producto
* **URL:** `/productos/:id`
* **Método:** `PUT`
* **Restricción:** Solo `admin` y `superadmin`.
* **Body:**
  ```json
  {
    "precio": 1799,
    "stock": 4,
    "rol": "admin"
  }
  ```

### 4. Eliminar un producto
* **URL:** `/productos/:id`
* **Método:** `DELETE`
* **Restricción:** Solo `admin` y `superadmin`.
* **Headers requeridos:** `x-rol: admin` (o `superadmin`)

---

## 👤 Endpoints de Usuarios (Exclusivo Superadmin)

### 1. Obtener todos los usuarios
* **URL:** `/usuarios`
* **Método:** `GET`
* **Headers requeridos:** `x-rol: superadmin`

### 2. Crear un nuevo usuario
* **URL:** `/usuarios`
* **Método:** `POST`
* **Body:**
  ```json
  {
    "rolUser": "superadmin",
    "username": "nuevo_gerente",
    "password": "123",
    "rol": "admin",
    "nombreCompleto": "Carlos Pérez"
  }
  ```

### 3. Modificar usuario
* **URL:** `/usuarios/:id`
* **Método:** `PUT`
* **Headers requeridos:** `x-rol: superadmin`
* **Body:**
  ```json
  {
    "password": "nuevo_password",
    "rol": "cliente"
  }
  ```

---

## 💻 Ejemplo de consumo en React (Login y Listado)

```javascript
import { useState, useEffect } from 'react';

function App() {
  const [productos, setProductos] = useState([]);
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);

  useEffect(() => {
    fetch('https://guapostore.onrender.com/api/productos')
      .then(res => res.json())
      .then(data => setProductos(data));
  }, []);

  const handleLogin = (username, password) => {
    fetch('https://guapostore.onrender.com/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
      if (data.rol) {
        setUsuarioLogueado(data);
        alert(`Bienvenido ${data.nombreCompleto} (${data.rol})`);
      } else {
        alert(data.error);
      }
    });
  };

  return (
    <div>
      <h1>GuapoStore - Panel</h1>
      {usuarioLogueado ? (
        <p>Sesión activa: {usuarioLogueado.nombreCompleto} [{usuarioLogueado.rol}]</p>
      ) : (
        <button onClick={() => handleLogin('admin', '123')}>Iniciar sesión como Admin</button>
      )}

      <h2>Catálogo</h2>
      <ul>
        {productos.map(p => (
          <li key={p.id}>{p.nombre} - ${p.precio} (Stock: {p.stock})</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```
