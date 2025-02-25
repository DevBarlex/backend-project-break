// index.js: Archivo principal que iniciará el servidor Express. Importa las rutas y las usa. También tiene que estar configurado para servir archivos estáticos 
// y para leer el body de las peticiones de formularios.

const express = require('express');
const morgan = require('morgan') //para ver el status de la peticion
const { dbConnection } = require('./config/db');
const path = require('path');
const admin = require('firebase-admin') // para ser admin de firebase
const serviceAccount = require('./config/serviceAccount') // llamar a firebase
const cookieParser = require('cookie-parser');
require('dotenv').config()

admin.initializeApp({ // con esto inicializamos firebase
  credential: admin.credential.cert(serviceAccount)
});


const app = express();
const router = require('./routes/authRoutes') // ruta de la autentificacion de los usuarios
const productRoutes = require('./routes/productRoutes')
const PORT = process.env.PORT || 3000;

// Conectar con la base de datos
dbConnection();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));  // Para leer datos de formularios
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));  // Archivos estáticos
app.use(morgan('dev')) // solicitud para ver el status de la peticion
app.use("/", router);
app.use("/", productRoutes)


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
