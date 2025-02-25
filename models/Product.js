// models/Product.js: Archivo que contendrá la definición del esquema del producto utilizando Mongoose.

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true
  },
  description: { 
    type: String,
    required: true 
  },
  image: { 
    type: String,
    required: true 
  },
  category: { 
    type: String,
    enum: ['Camisetas', 'Pantalones', 'Zapatos', 'Accesorios'], 
    required: true 
  },
  size: { 
    type: String, 
    enum: ['XS', 'S', 'M', 'L', 'XL'], 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
