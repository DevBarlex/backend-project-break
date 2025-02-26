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
        <li><a href="/api/products">Ver productos</a></li>
        <li><a href="/login">Login</a></li>
        <li><a href="/register">Register</a></li>
        <form action="/logout" method="post">
          <button id="submit" name="Logout">Cerrar Sesión</button>
        </form>
      </ul>
    </nav>
  `;
}


function getFooter(){
  return `
    <footer>
      Politicas<br>
      &copy; Todos los derechos reservados <br>
      <a href="/api/dashboard" class="btn-dash">Dashboard</a>
    </footer>
  `
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
      <link rel="icon" type="image/png" href="/images/images.png">
    </head>
    <body>
  `;
}

//Rutas públicas

// Función para mostrar todos los productos
const showProducts = async (req, res) => {
  try {
    const products = await Product.find();

    let productListHTML = products.map(product => `
        <div class="product-card">
        <img src="${product.image}" alt="${product.name}">
        <a href="/products/${product._id}">Ver detalle</a>
        </div>
        `).join('');

    const fs = require('fs');
    const path = require('path');
    const productsPath = path.join(__dirname, '../public/views/products.html');
    let productsHTML = fs.readFileSync(productsPath, 'utf8');

    productsHTML = productsHTML.replace("{{PRODUCTS}}", productListHTML);

    res.send(productsHTML);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).send("Error interno del servidor");
  }
};


const showCategory = async (req, res) => {
  try {
    const categoria = req.params.categoria;
    const categoriasValidas = ['Camisetas', 'Pantalones', 'Zapatos', 'Accesorios'];
    if (!categoriasValidas.includes(categoria)) {
      return res.status(400).send(`<h1>Categoría no válida: ${categoria}</h1>`);
    }

    const productos = await Product.find({ category: categoria });

    if (productos.length === 0) {
      return res.status(404).send(`<h1>No hay productos en la categoría "${categoria}"</h1>`);
    }

    let productListHTML = productos.map(product => `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}">
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <p>${product.price}€</p>
        <p>${product.size}</p>
        <a href="/products/${product._id}">Ver detalle</a>
      </div>
    `).join('');

    const html = `
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tienda de Ropa</title>
        <link rel="stylesheet" href="/styles.css">
        <link rel="icon" type="image/png" href="/images/images.png">
      </head>
      <nav>
        <ul>
          <li><a href="/">Inicio</a></li>
          <li><a href="/products/categoria/Camisetas">Camisetas</a></li>
          <li><a href="/products/categoria/Pantalones">Pantalones</a></li>
          <li><a href="/products/categoria/Zapatos">Zapatos</a></li>
          <li><a href="/products/categoria/Accesorios">Accesorios</a></li>
          <li><a href="/login">Login</a></li>
          <li><a href="/register">Register</a></li>
          <form action="/logout" method="post">
            <button id="submit" name="Logout">Cerrar Sesión</button>
          </form>
        </ul>
      </nav>
      <main class="main-category">
        <h1>Productos en la categoría: ${categoria}</h1>
        <div class="product-list">${productListHTML}</div>
      </main>
      <footer>
        Politicas
        &copy; Todos los derechos reservados <br>
      </footer>
      </body></html>` ;

    res.send(html);
  } catch (error) {
    console.error("🚨 Error al obtener productos por categoría:", error);
    res.status(500).send("Error interno del servidor");
  }
};


// Función para mostrar un producto por su ID
const showProductById = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId); 
    
    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }
    
    const sizes = product.size.join(', '); // Convertir array en string
    
    const html = baseHtml() + getNavBar() + `
      <div>
        <h1>${product.name}</h1>
        <img src="${product.image}" alt="${product.name}">
        <p>${product.description}</p>
        <p>${product.price}€</p>
        <p>Categoría: ${product.category}</p>
        <p>Tallas: ${sizes}</p> 
      </div>
    </body></html> `;
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
              <img src="${product.image}" alt="${product.name}" >
              <h2>${product.name}</h2>
              <p><strong>Descripción:</strong> ${product.description}</p>
              <p><strong>Precio:</strong> ${product.price}€</p>              
              <p><strong>Talla:</strong> ${product.size}</p> 
              <a href="/dashboard/${product._id}/edit">Editar</a><br><br>
              <a href="/dashboard/${product._id}">Ver detalle</a><br><br>
              <form action="/dashboard/${product._id}/delete" method="POST">
                  <button type="submit" onclick="return confirm('¿Estás seguro de eliminar este producto?')">Eliminar</button>
              </form>
          </div>
      `).join('');

      // Leer el archivo HTML del dashboard
      const fs = require('fs');
      const path = require('path');
      const dashboardPath = path.join(__dirname, '../public/views/dashboard.html');
      let dashboardHTML = fs.readFileSync(dashboardPath, 'utf8');

      // Insertar los productos en el HTML
      dashboardHTML = dashboardHTML.replace("{{DASHBOARD}}", productListHTML);

      // Enviar la respuesta con el HTML
      res.send(dashboardHTML);
  } catch (error) {
      console.error("🚨 Error al cargar el dashboard:", error);
      res.status(500).send("Error al cargar el dashboard");
  }
};

// Función para mostrar el formulario para crear un nuevo producto
const showNewProduct = (req, res) => {
  const html = baseHtml() + `
  <nav>
      <ul>
        <li><a href="/">Inicio</a></li>
        <li><a href="/api/products">Ver productos</a></li>
        <form action="/logout" method="post">
          <button id="submit" name="Logout">Cerrar Sesión</button>
        </form>
      </ul>
  </nav>
  <main class="main-nd">
    <div class="form-nd">
      <h1>Nuevo Producto</h1>
      <form action="/api/dashboard" method="POST">
        <label for="name"><strong>Nombre:</strong></label>
        <input type="text" id="form-newp" name="name" required><br>
        <label for="description"><strong>Descripción:</strong></label>
        <input type="text" id="form-newp" name="description" required><br>
        <label for="price"><strong>Precio:</strong></label>
        <input type="number" id="form-newp" name="price" required><br>
        <label for="image"><strong>Imagen:</strong></label>
        <input type="text" id="form-newp" name="image" required><br>
        <label for="category"><strong>Categoría:</strong></label>
        <select name="category" id="category"  required onchange="updateSizeOptions()">
          <option value="">Selecciona una categoría</option>
          <option value="Camisetas">Camisetas</option>
          <option value="Pantalones">Pantalones</option>
          <option value="Zapatos">Zapatos</option>
          <option value="Accesorios">Accesorios</option>
        </select><br>
        <label for="size"><strong>Talla:</strong></label>
        <select name="size" id="size" required>
          <option value="">Selecciona una categoría primero</option>
        </select><br><br>
        <button type="submit">Crear Producto</button>
      </form>
    </div>
  </main>
  <footer class="footer-login">
    Politicas <br>
    &copy; Todos los derechos reservados
  </footer>

    <script>
      function updateSizeOptions() {
        const category = document.getElementById("category").value;
        const sizeSelect = document.getElementById("size");
        sizeSelect.innerHTML = ""; // Limpiar opciones previas

        let sizes = [];
        if (category === "Zapatos") {
          sizes = ["38", "39", "40", "41", "42", "43", "44"];
        } else if (category === "Camisetas" || category === "Pantalones") {
          sizes = ["XS", "S", "M", "L", "XL"];
        } else {
          sizes = ["Único"]; // Para accesorios o categorías sin talla
        }

        sizes.forEach(size => {
          const option = document.createElement("option");
          option.value = size;
          option.textContent = size;
          sizeSelect.appendChild(option);
        });
      }
    </script>
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
    const html = baseHtml() + `
      <nav>
        <ul>
          <li><a href="/">Inicio</a></li>
          <li><a href="/api/products">Ver productos</a></li>
          <form action="/logout" method="post">
            <button id="submit" name="Logout">Cerrar Sesión</button>
          </form>
        </ul>
      </nav>
        <div>
          <h1>${product.name}</h1>
          <img src="${product.image}" alt="${product.name}" style="width: 300px;">
          <p><strong>Descripción:</strong> ${product.description}</p>
          <p><strong>Precio:</strong> ${product.price}€</p>
          <p><strong>Talla:</strong> ${product.size}</p>
          <a href="/dashboard/${product._id}/edit" class="btn-edit">Editar</a><br><br>
          <form action="/dashboard/${product._id}/delete" method="POST">
            <button type="submit" onclick="return confirm('¿Estás seguro de eliminar este producto?')">Eliminar</button>
          </form>
          <br>
          <a href="/api/dashboard" class="btn-edit">Volver al Dashboard</a>
        </div>
      </html>
    `;
    res.send(html)
  } catch (error) {
    console.error(" Error al obtener producto en el dashboard:", error);
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

    // Lista de categorías y tallas
    const categorias = ['Camisetas', 'Pantalones', 'Zapatos', 'Accesorios'];
    const tallasRopa = ['XS', 'S', 'M', 'L', 'XL'];
    const tallasZapatos = ['38', '39', '40', '41', '42', '43', '44'];

    const html = baseHtml() + `
      <nav>
        <ul>
          <li><a href="/">Inicio</a></li>
          <li><a href="/api/products">Ver productos</a></li>
          <form action="/logout" method="post">
            <button id="submit" name="Logout">Cerrar Sesión</button>
          </form>
        </ul>
      </nav>
      <main class="main-nd">
        <div class="form-nd">
          <h1>Editar Producto</h1>
          <form action="/dashboard/${product._id}" method="POST">
            <label for="name">Nombre:</label>
            <input type="text" name="name" id="form-newp" value="${product.name}" required><br>
            <label for="description">Descripción:</label>
            <input type="text" name="description" id="form-newp" value="${product.description}" required><br>
            <label for="price">Precio:</label>
            <input type="number" name="price" id="form-newp" value="${product.price}" required><br>
            <label for="image">Imagen URL:</label>
            <input type="text" name="image" id="form-newp" value="${product.image}" required><br>
            <label for="category">Categoría:</label>
            <select name="category" id="category" required onchange="updateSizeOptions()">
              ${categorias.map(cat => `
                <option value="${cat}" ${product.category === cat ? 'selected' : ''}>${cat}</option>
              `).join('')}
            </select><br>

            <label for="size">Talla:</label>
            <select name="size" id="size" required>
              <!-- Opciones de talla se llenarán dinámicamente con JS -->
            </select><br>

            <button type="submit">Actualizar Producto</button>
          </form>
        </div>  
      </main>
      <footer class="footer-login">
        Politicas <br>
        &copy; Todos los derechos reservados
      </footer>
      <script>
        function updateSizeOptions() {
          const category = document.getElementById("category").value;
          const sizeSelect = document.getElementById("size");
          sizeSelect.innerHTML = "";

          let sizes = [];
          if (category === "Zapatos") {
            sizes = ${JSON.stringify(tallasZapatos)};
          } else if (category === "Camisetas" || category === "Pantalones") {
            sizes = ${JSON.stringify(tallasRopa)};
          } else {
            sizes = ["Único"];
          }

          sizes.forEach(size => {
            const option = document.createElement("option");
            option.value = size;
            option.textContent = size;
            if (size === "${product.size}") {
              option.selected = true;
            }
            sizeSelect.appendChild(option);
          });
        }
        // Ejecutar la función al cargar la página para mostrar las tallas correctas
        updateSizeOptions();
      </script>
    </body></html>`;

    res.send(html);
  } catch (error) {
    console.error(" Error al obtener el producto para editar:", error);
    res.status(500).send("Error al obtener el producto para editar");
  }
};

// Función para actualizar un producto
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    let { name, description, price, image, category, size } = req.body;

    // Lista de categorías válidas
    const categoriasValidas = ['Camisetas', 'Pantalones', 'Zapatos', 'Accesorios'];
    if (!categoriasValidas.includes(category)) {
      return res.status(400).send("Categoría no válida.");
    }

    // Asignar las tallas válidas según la categoría
    const tallasRopa = ['XS', 'S', 'M', 'L', 'XL'];
    const tallasZapatos = ['38', '39', '40', '41', '42', '43', '44'];
    const tallaUnica = ['Único'];

    let tallasPermitidas = [];
    if (category === "Zapatos") {
      tallasPermitidas = tallasZapatos;
    } else if (category === "Camisetas" || category === "Pantalones") {
      tallasPermitidas = tallasRopa;
    } else {
      tallasPermitidas = tallaUnica;
    }

    // Validar la talla ingresada
    if (!tallasPermitidas.includes(size)) {
      return res.status(400).send(`Talla no válida para la categoría ${category}.`);
    }

    // Actualizar el producto
    const updatedProduct = await Product.findByIdAndUpdate(
      productId, 
      { name, description, price, image, category, size }, 
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).send("Producto no encontrado.");
    }

    // Redirigir al detalle del producto actualizado
    res.redirect(`/dashboard/${updatedProduct._id}`);
  } catch (error) {
    console.error("🚨 Error al actualizar el producto:", error);
    res.status(500).send("Error interno del servidor al actualizar el producto.");
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
  showCategory,
  showDashboard,
  showNewProduct,
  createProduct,
  showProductInDashboard,
  showEditProduct,
  updateProduct,
  deleteProduct
};
