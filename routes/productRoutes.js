// routes/productRoutes.js: Archivo que contendrá la definición de las rutas CRUD para los productos. Este llama a los métodos del controlador.

const express = require('express');
const router = express.Router();

// Importamos las funciones del controlador
const {
  showProducts,
  showProductById,
  showDashboard,
  showNewProduct,
  createProduct,
  showProductInDashboard,
  showEditProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const checkAuth = require('../middlewares/authMiddleware')


// Rutas públicas

router.get('/api/products', showProducts);
router.get('/products/:productId', showProductById);


// Rutas del dashboard

// Vista del dashboard con todos los productos
router.get('/api/dashboard', checkAuth, showDashboard);

// Mostrar el formulario para crear un nuevo producto
router.get('/dashboard/new', showNewProduct);

// Crear un nuevo producto (cuando se envía el formulario)
router.post('/api/dashboard', checkAuth, createProduct);

// Detalle de un producto en el dashboard
router.post('/dashboard/:productId', showProductInDashboard);

// Mostrar el formulario para editar un producto
router.get('/dashboard/:productId/edit', showEditProduct);

// Actualizar un producto (cuando se envía el formulario)
router.post('/dashboard/:productId', updateProduct);

// Eliminar un producto
router.post('/dashboard/:productId/delete', deleteProduct);

module.exports = router;


