const mongoose = require('mongoose')

// Esquema de los productos almacenados en MongoDB
const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  descripcion: { type: String, required: true, trim: true },
  precio: { type: Number, required: true, min: 0 }
})

module.exports = mongoose.model('Producto', productoSchema)
