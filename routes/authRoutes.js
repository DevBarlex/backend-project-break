// routes/authRoutes.js: Archivo que contendrá la definición de las rutas para la autenticación. Este llama a los métodos del controlador.
const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const checkAuth = require('../middlewares/authMiddleware')


router.get('/', authController.getIndexPage)

// Rutas para las vistas de la página de registro
router.get('/login', authController.getLoginPage);
router.post('/register', authController.registerUser);


// Rutas para las vistas de la página de Login
router.get('/register', authController.getRegisterPage);
router.post('/login', authController.loginUser);


// Ruta para acceder a la página del dashboard
router.get('/dashboard', checkAuth, authController.getDashboardPage);

// Ruta para acceder a la página de products
router.get('/products', checkAuth, authController.getProductsPage);

// Ruta para cerrar sesión
router.post('/logout', authController.logOutUser);


module.exports = router