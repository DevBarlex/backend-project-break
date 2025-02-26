// routes/productRoutes.js: Archivo que contendrá la definición de las rutas CRUD para los productos. Este llama a los métodos del controlador.

const express = require('express');
const router = express.Router();

// Importamos las funciones del controlador
const {
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
} = require('../controllers/productController');
const checkAuth = require('../middlewares/authMiddleware')


// Rutas públicas

router.get('/api/products', showProducts);
router.get('/products/categoria/:categoria', showCategory)// Obtener productos por categoria
router.get('/products/:productId', showProductById);


// Rutas del dashboard

// Vista del dashboard con todos los productos
router.get('/api/dashboard', checkAuth, showDashboard);

// Mostrar el formulario para crear un nuevo producto
router.get('/dashboard/new', checkAuth, showNewProduct);

// Crear un nuevo producto (cuando se envía el formulario)
router.post('/api/dashboard', checkAuth, createProduct);

// Detalle de un producto en el dashboard
router.get('/dashboard/:productId', checkAuth, showProductInDashboard);

// Mostrar el formulario para editar un producto
router.get('/dashboard/:productId/edit', checkAuth, showEditProduct);

// Actualizar un producto (cuando se envía el formulario)
router.post('/dashboard/:productId', checkAuth, updateProduct);

// Eliminar un producto
router.post('/dashboard/:productId/delete', checkAuth, deleteProduct);

module.exports = router;


