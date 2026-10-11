const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Base de datos en memoria inicial para GuapoStore (con campo usuario/apellido)
let productos = [
  { id: 1, nombre: "Camisa Casual Slim Fit", precio: 699.00, categoria: "Ropa", imagen: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=500&q=80", stock: 12, usuario: "Profesor" },
  { id: 2, nombre: "Tenis Urbanos Minimalistas", precio: 1299.00, categoria: "Calzado", imagen: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80", stock: 8, usuario: "Profesor" },
  { id: 3, nombre: "Reloj Minimalista de Cuero", precio: 899.00, categoria: "Accesorios", imagen: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80", stock: 15, usuario: "Profesor" },
  { id: 4, nombre: "Mochila de Lona y Piel", precio: 1150.00, categoria: "Accesorios", imagen: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80", stock: 5, usuario: "Profesor" }
];

// GET: Obtener todos los productos
app.get('/api/productos', (req, res) => {
  res.json(productos);
});

// POST: Crear un nuevo producto (incluyendo el apellido/usuario del alumno)
app.post('/api/productos', (req, res) => {
  const { nombre, precio, categoria, imagen, stock, usuario } = req.body;
  const nuevoProducto = {
    id: productos.length > 0 ? productos[productos.length - 1].id + 1 : 1,
    nombre: nombre || "Sin nombre",
    precio: Number(precio) || 0,
    categoria: categoria || "General",
    imagen: imagen || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80",
    stock: Number(stock) || 0,
    usuario: usuario || "Anónimo" // Apellido o usuario que realiza el registro
  };
  productos.push(nuevoProducto);
  res.status(201).json(nuevoProducto);
});

// PUT: Actualizar un producto (registrando quién hizo el cambio)
app.put('/api/productos/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = productos.findIndex(p => p.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  const { nombre, precio, categoria, imagen, stock, usuario } = req.body;
  productos[index] = {
    ...productos[index],
    nombre: nombre !== undefined ? nombre : productos[index].nombre,
    precio: precio !== undefined ? Number(precio) : productos[index].precio,
    categoria: categoria !== undefined ? categoria : productos[index].categoria,
    imagen: imagen !== undefined ? imagen : productos[index].imagen,
    stock: stock !== undefined ? Number(stock) : productos[index].stock,
    usuario: usuario !== undefined ? usuario : productos[index].usuario // Actualiza quién modificó el registro
  };

  res.json(productos[index]);
});

// DELETE: Eliminar un producto
app.delete('/api/productos/:id', (req, res) => {
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
  console.log(`GuapoStore API corriendo en puerto ${PORT}`);
});
