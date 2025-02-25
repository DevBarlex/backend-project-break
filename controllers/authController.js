// controllers/authController.js: Archivo que contendrá la lógica para manejar las solicitudes de autenticación. Devolverá las respuestas en formato HTML.

const path = require('path')
const admin = require('firebase-admin')
const auth = admin.auth()


const getIndexPage = (req, res) => {
  res.sendFile(path.join(__dirname, '../public/views', 'index.html'));
};


// Función para registrar un usuario
const registerUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      await auth.createUser({
        email,
        password,
      });
      res.redirect('/login');
    } catch (error) {
      console.error(`Error al registrar el usuario: ${error}`);
      res.redirect('/register');
    }
};


// Función para iniciar sesión
const loginUser = async (req, res) => {
    const { idToken } = req.body;
  
    try {
      // Verifica el ID Token enviado desde el frontend
      await auth.verifyIdToken(idToken);
  
      // Si la verificación es exitosa, establece una cookie con el token
      res.cookie('token', idToken, { httpOnly: true, secure: false });
      res.json({ success: true });
    } catch (error) {
      console.log(`Error al verificar el token: ${error}`);
      res.status(400).json({ success: false, message: 'Error de autenticación' });
    }
};

// Función para redirigir a la página de inicio de sesión
const getLoginPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views', 'login.html'));
};
  
// Función para redirigir a la página de registro
const getRegisterPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views', 'register.html'));
};
  
// Función para redirigir a la página de dashboard
const getDashboardPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views', 'dashboard.html'));
};

// Función para redirigir a la página de products
const getProductsPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views', 'products.html'));
};

const logOutUser = (req, res) => {
  res.clearCookie("token")
  res.redirect("/login");  
};



module.exports = {
    getIndexPage,
    registerUser,
    loginUser,
    getLoginPage,
    getRegisterPage,
    getDashboardPage,
    getProductsPage,
    logOutUser,
  };