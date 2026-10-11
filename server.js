const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Base de datos de Usuarios
let usuarios = [
  { id: 1, username: "drguapo", password: "123456", rol: "superadmin", nombreCompleto: "DR. GUAPO" },
  { id: 2, username: "aquino", password: "123456", rol: "admin", nombreCompleto: "AQUINO RIVERA JOSE FRANCISCO" },
  { id: 3, username: "arvayo", password: "123456", rol: "admin", nombreCompleto: "ARVAYO COTA CRISTAL ALEJANDRA" },
  { id: 4, username: "buelna", password: "123456", rol: "admin", nombreCompleto: "BUELNA ESPINOZA JOSE FERNANDO" },
  { id: 5, username: "cordova", password: "123456", rol: "admin", nombreCompleto: "CORDOVA CISCOMANI DIEGO EMILIO" },
  { id: 6, username: "diaz", password: "123456", rol: "admin", nombreCompleto: "DIAZ OSUNA CARLOS ANTONIO"},
  { id: 7, username: "galvan", password: "123456", rol: "admin", nombreCompleto: "GALVAN MOLINERO ARTURO DE JESUS" },
  { id: 8, username: "gonzalez", password: "123456", rol: "admin", nombreCompleto: "GONZALEZ HOYOS ARTURO EDUARDO" },
  { id: 9, username: "moreno", password: "123456", rol: "admin", nombreCompleto: "MORENO DURAZO JOSE MANUEL" },
  { id: 10, username: "cliente@gmail.com", password: "123456", rol: "cliente", nombreCompleto: "GUADALUPE PEREZ" }
];

// Base de datos de Productos (8 productos iniciales)
let productos = [
  { id: 1, nombre: "Camisa Casual Slim Fit", precio: 699.00, categoria: "Ropa", imagen: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=500&q=80", stock: 12, usuario: "drguapo" },
  { id: 2, nombre: "Tenis Urbanos Minimalistas", precio: 1299.00, categoria: "Calzado", imagen: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80", stock: 8, usuario: "drguapo" },
  { id: 3, nombre: "Reloj Minimalista de Cuero", precio: 899.00, categoria: "Accesorios", imagen: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80", stock: 15, usuario: "drguapo" },
  { id: 4, nombre: "Mochila de Lona y Piel", precio: 1150.00, categoria: "Accesorios", imagen: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80", stock: 5, usuario: "drguapo" },
  { id: 5, nombre: "Chamarra de Mezclilla Vintage", precio: 1450.00, categoria: "Ropa", imagen: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=500&q=80", stock: 7, usuario: "drguapo" },
  { id: 6, nombre: "Lentes de Sol Clásicos", precio: 599.00, categoria: "Accesorios", imagen: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=500&q=80", stock: 20, usuario: "drguapo" },
  { id: 7, nombre: "Botas de Piel Casuales", precio: 1899.00, categoria: "Calzado", imagen: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=500&q=80", stock: 6, usuario: "drguapo" },
  { id: 8, nombre: "Sudadera Oversize Hoodie", precio: 850.00, categoria: "Ropa", imagen: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=500&q=80", stock: 14, usuario: "drguapo" }
];

// --- AUTENTICACIÓN ---

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = usuarios.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
  }

  res.json({
    mensaje: "Login exitoso",
    id: user.id,
    username: user.username,
    nombreCompleto: user.nombreCompleto,
    rol: user.rol // "superadmin", "admin", o "cliente"
  });
});

// --- GESTIÓN DE USUARIOS (EXCLUSIVO SUPERADMIN) ---

app.get('/api/usuarios', (req, res) => {
  const rolHeader = req.headers['x-rol'];
  if (rolHeader !== 'superadmin') {
    return res.status(403).json({ error: "Acceso denegado. Solo el Superadmin puede ver los usuarios." });
  }
  res.json(usuarios);
});

app.post('/api/usuarios', (req, res) => {
  const { rolUser, username, password, rol, nombreCompleto } = req.body;

  if (rolUser !== 'superadmin') {
    return res.status(403).json({ error: "Acceso denegado. Solo el Superadmin puede crear nuevos usuarios." });
  }

  const nuevoUsuario = {
    id: usuarios.length > 0 ? usuarios[usuarios.length - 1].id + 1 : 1,
    username: username || "nuevo_user",
    password: password || "123",
    rol: rol || "cliente",
    nombreCompleto: nombreCompleto || "Sin nombre"
  };

  usuarios.push(nuevoUsuario);
  res.status(201).json(nuevoUsuario);
});

app.put('/api/usuarios/:id', (req, res) => {
  const rolHeader = req.headers['x-rol'];

  if (rolHeader !== 'superadmin') {
    return res.status(403).json({ error: "Acceso denegado. Solo el Superadmin puede modificar usuarios." });
  }

  const id = Number(req.params.id);
  const index = usuarios.findIndex(u => u.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  const { username, password, rol, nombreCompleto } = req.body;
  usuarios[index] = {
    ...usuarios[index],
    username: username !== undefined ? username : usuarios[index].username,
    password: password !== undefined ? password : usuarios[index].password,
    rol: rol !== undefined ? rol : usuarios[index].rol,
    nombreCompleto: nombreCompleto !== undefined ? nombreCompleto : usuarios[index].nombreCompleto
  };

  res.json(usuarios[index]);
});

// --- GESTIÓN DE PRODUCTOS (ADMIN Y SUPERADMIN) ---

app.get('/api/productos', (req, res) => {
  res.json(productos);
});

app.post('/api/productos', (req, res) => {
  const { nombre, precio, categoria, imagen, stock, rol, usuario } = req.body;

  if (rol === 'cliente') {
    return res.status(403).json({ error: "Acceso denegado. Los clientes no pueden crear productos." });
  }

  const nuevoProducto = {
    id: productos.length > 0 ? productos[productos.length - 1].id + 1 : 1,
    nombre: nombre || "Sin nombre",
    precio: Number(precio) || 0,
    categoria: categoria || "General",
    imagen: imagen || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80",
    stock: Number(stock) || 0,
    usuario: usuario || "Anónimo"
  };
  productos.push(nuevoProducto);
  res.status(201).json(nuevoProducto);
});

app.put('/api/productos/:id', (req, res) => {
  const { rol, nombre, precio, categoria, imagen, stock, usuario } = req.body;

  if (rol === 'cliente') {
    return res.status(403).json({ error: "Acceso denegado. Los clientes no pueden modificar productos." });
  }

  const id = Number(req.params.id);
  const index = productos.findIndex(p => p.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  productos[index] = {
    ...productos[index],
    nombre: nombre !== undefined ? nombre : productos[index].nombre,
    precio: precio !== undefined ? Number(precio) : productos[index].precio,
    categoria: categoria !== undefined ? categoria : productos[index].categoria,
    imagen: imagen !== undefined ? imagen : productos[index].imagen,
    stock: stock !== undefined ? Number(stock) : productos[index].stock,
    usuario: usuario !== undefined ? usuario : productos[index].usuario
  };

  res.json(productos[index]);
});

app.delete('/api/productos/:id', (req, res) => {
  const rol = req.headers['x-rol'];

  if (rol === 'cliente') {
    return res.status(403).json({ error: "Acceso denegado. Los clientes no pueden eliminar productos." });
  }

  const id = Number(req.params.id);
  const initialLength = productos.length;
  productos = productos.filter(p => p.id !== id);

  if (productos.length === initialLength) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json({ mensaje: "Producto eliminado correctamente" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`GuapoStore API con 8 productos corriendo en puerto ${PORT}`);
});
