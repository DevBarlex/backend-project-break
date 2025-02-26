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
    type: [String], // Ahora es un array para permitir múltiples tallas
    required: true,
    validate: {
      validator: function(sizes) {
        const validSizes = {
          'Zapatos': ['38', '39', '40', '41', '42', '43', '44'],
          'Camisetas': ['XS', 'S', 'M', 'L', 'XL'],
          'Pantalones': ['XS', 'S', 'M', 'L', 'XL'],
          'Accesorios': ['Único']
        };
        return sizes.every(size => validSizes[this.category]?.includes(size));
      },
      message: props => `Al menos una talla no es válida para la categoría ${props.instance.category}`
    }
  },
  price: { 
    type: Number, 
    required: true 
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
