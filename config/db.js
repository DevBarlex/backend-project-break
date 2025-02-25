// config/db.js: Archivo que contendrá la configuración de la base de datos. Deberá conectarse a la base de datos de mongo en Atlas.

const mongoose = require('mongoose');
require('dotenv').config();

const dbConnection = async() => {
    try {
        console.log(process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Database connected successfully');
    } catch (error) {
        console.error(error);
        throw new Error('Error at database startup');
    }
};

module.exports = {
    dbConnection,
};

