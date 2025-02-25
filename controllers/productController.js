// controllers/productController.js: Archivo que contendrá la lógica para manejar las solicitudes CRUD de los productos. Devolverá las respuestas en formato HTML.

const path = require('path')
const admin = require('firebase-admin')
const auth = admin.auth()
const Product = require('../models/Product'); // Importamos el modelo de Producto
const fs = require('fs')

// Función auxiliar para generar la barra de navegación
function getNavBar() {
  return `
    <nav>
      <ul>
        <li><a href="/">Inicio</a></li>
        <li><a href="/api//products">Ver productos</a></li>
        <li><a href="/api/dashboard">Dashboard</a></li>
      </ul>
    </nav>
  `;
}

// Función auxiliar para generar el HTML de las tarjetas de productos
function getProductCards(products) {
  let html = '';
  for (let product of products) {
    html += `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}">
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <p>${product.price}€</p>
        <a href="/products/${product._id}">Ver detalle</a>
      </div>
    `;
  }
  return html;
}

// Función auxiliar para la estructura HTML base de todas las vistas
function baseHtml() {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Tienda de Ropa</title>
      <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
  `;
}

//Rutas públicas

// Función para mostrar todos los productos
const showProducts = async (req, res) => {
  try {
    // Obtener productos desde MongoDB
    const products = await Product.find();
      
    // Leer el archivo base `products.html`
    const filePath = path.join(__dirname, '../public/views', 'products.html');
    let html = fs.readFileSync(filePath, 'utf8');
      
    // Generar tarjetas de productos
    let productCards = products.map(product => `
      <div class="product-card">
      <img src="${product.image}" alt="${product.name}">
      <h2>${product.name}</h2>
      <p>${product.description}</p>
      <p>${product.price}€</p>
      <a href="/products/${product._id}">Ver detalle</a>
      </div>
      `).join('');
        
      // Reemplazar el marcador en `products.html` con los productos
      html = html.replace('<!--PRODUCTS_PLACEHOLDER-->', productCards);
        
      res.send(html);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).send("Error interno del servidor");
  }
};
    

// Función para mostrar un producto por su ID
const showProductById = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId); // Buscar el producto por su ID
    
  if (!product) {
    return res.status(404).send('Producto no encontrado');
  }
    
  const html = baseHtml() + getNavBar() + `
    <h1>${product.name}</h1>
    <img src="${product.image}" alt="${product.name}">
    <p>${product.description}</p>
    <p>${product.price}€</p>
    <p>${product.category}</p>
    <p>${product.size}</p>
    <a href="/dashboard/${product._id}/edit">Editar</a>
    <form action="/dashboard/${product._id}/delete" method="POST">
      <button type="submit">Eliminar</button>
    </form>
    </body></html>`;
    res.send(html);
    } catch (error) {
    res.status(500).send("Error al obtener el producto");
    }
};


// Redes Dashboard
//Funcion para mostrar el dashboard
const showDashboard = async (req, res) => {
  try {
      // Buscar todos los productos en MongoDB
      const products = await Product.find();

      // Generar HTML con los productos
      let productListHTML = products.map(product => `
          <div class="product-card">
              <img src="${product.image}" alt="${product.name}">
              <h2>${product.name}</h2>
              <p>${product.description}</p>
              <p>${product.price}€</p>
              <a href="/products/${product._id}">Ver detalle</a>
              <a href="/dashboard/${product._id}/edit">Editar</a>
              <form action="/dashboard/${product._id}/delete" method="POST">
                  <button type="submit">Eliminar</button>
              </form>
          </div>
      `).join('');

      // Leer el archivo HTML del dashboard
      const fs = require('fs');
      const path = require('path');
      const dashboardPath = path.join(__dirname, '../public/views/dashboard.html');
      let dashboardHTML = fs.readFileSync(dashboardPath, 'utf8');

      // Insertar los productos en el HTML
      dashboardHTML = dashboardHTML.replace("{{PRODUCTS}}", productListHTML);

      // Enviar la respuesta con el HTML
      res.send(dashboardHTML);
  } catch (error) {
      console.error("🚨 Error al cargar el dashboard:", error);
      res.status(500).send("Error al cargar el dashboard");
  }
};

// Función para mostrar el formulario para crear un nuevo producto
const showNewProduct = (req, res) => {
  const html = baseHtml() + getNavBar() + `
    <h1>Nuevo Producto</h1>
    <form action="/api/dashboard" method="POST">
      <label for="name">Nombre:</label>
      <input type="text" name="name" required>
      <label for="description">Descripción:</label>
      <input type="text" name="description" required>
      <label for="price">Precio:</label>
      <input type="number" name="price" required>
      <label for="image">Imagen URL:</label>
      <input type="text" name="image" required>
      <label for="category">Categoría:</label>
      <input type="text" name="category" required>
      <label for="size">Tamaño:</label>
      <input type="text" name="size" required>
      <button type="submit">Crear Producto</button>
    </form>
    `;
  res.send(html);
};


// Función para crear un nuevo producto
const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, size } = req.body;
    const newProduct = new Product({ name, description, price, image, category, size });
    await newProduct.save(); //// Guardar el nuevo producto en la base de datos
    res.redirect("/api/dashboard"); // Redirigir a la vista de detalles del producto
  } catch (error) {
    res.status(500).send("Error al crear el producto");
  }
};
    

// Mostrar detalle de un producto en el dashboard
const showProductInDashboard = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
  if (!product) return res.status(404).send("Producto no encontrado");
    res.send(`
      <html>
        <head>
          <title>${product.name} - Dashboard</title>
          <link rel="stylesheet" href="/styles.css">
        </head>
        <body>
          <h1>${product.name}</h1>
          <img src="${product.image}" alt="${product.name}" style="width: 300px;">
          <p>${product.description}</p>
          <p>Precio: ${product.price}€</p>
          <a href="/dashboard/${product._id}/edit">Editar</a>
          <form action="/dashboard/${product._id}/delete" method="POST">
            <button type="submit" onclick="return confirm('¿Estás seguro de eliminar este producto?')">Eliminar</button>
          </form>
          <br>
          <a href="/api/dashboard">Volver al Dashboard</a>
          </body>
      </html>
    `);
  } catch (error) {
    console.error("❌ Error al obtener producto en el dashboard:", error);
    res.status(500).send("Error interno del servidor");
  }
};

// Función para mostrar el formulario de edición de un producto
const showEditProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }

    const html = baseHtml() + getNavBar() + `
      <h1>Editar Producto</h1>
      <form action="/dashboard/${product._id}" method="POST">
        <label for="name">Nombre:</label>
        <input type="text" name="name" value="${product.name}" required>
        <label for="description">Descripción:</label>
        <input type="text" name="description" value="${product.description}" required>
        <label for="price">Precio:</label>
        <input type="number" name="price" value="${product.price}" required>
        <label for="image">Imagen URL:</label>
        <input type="text" name="image" value="${product.image}" required>
        <label for="category">Categoría:</label>
        <input type="text" name="category" value="${product.category}" required>
        <label for="size">Tamaño:</label>
        <input type="text" name="size" value="${product.size}" required>
        <button type="submit">Actualizar Producto</button>
      </form>
      </body></html>`;
    res.send(html);
  } catch (error) {
    res.status(500).send("Error al obtener el producto para editar");
  }
};

// Función para actualizar un producto
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const { name, description, price, image, category, size } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(productId, { name, description, price, image, category, size }, { new: true });

    if (!updatedProduct) {
      return res.status(404).send('Producto no encontrado');
    }

    res.redirect(`/products/${updatedProduct._id}`); // Redirigir al detalle del producto actualizado
  } catch (error) {
    res.status(500).send("Error al actualizar el producto");
  }
};

// Función para eliminar un producto
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).send('Producto no encontrado');
    }

    res.redirect("/api/dashboard"); // Redirigir a la lista de productos
  } catch (error) {
    res.status(500).send("Error al eliminar el producto");
  }
};

module.exports = {
  showProducts,
  showProductById,
  showDashboard,
  showNewProduct,
  createProduct,
  showProductInDashboard,
  showEditProduct,
  updateProduct,
  deleteProduct
};
