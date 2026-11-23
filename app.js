require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const Producto = require('./models/Producto')

const app = express()
app.use(express.json())

const camposValidos = ({ nombre, descripcion, precio } = {}) =>
  typeof nombre === 'string' && nombre.trim() !== '' &&
  typeof descripcion === 'string' && descripcion.trim() !== '' &&
  precio !== undefined && precio !== null && precio !== '' &&
  Number.isFinite(Number(precio)) && Number(precio) >= 0

const idValido = (id) => /^[a-fA-F0-9]{24}$/.test(id)

// GET - Listar productos almacenados en MongoDB
app.get('/productos', async (req, res) => {
  try {
    const productos = await Producto.find()
    res.json(productos)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al consultar productos' })
  }
})

// GET - Consultar un producto por su _id
app.get('/productos/:id', async (req, res) => {
  if (!idValido(req.params.id)) return res.status(400).json({ mensaje: 'Id no valido' })
  try {
    const producto = await Producto.findById(req.params.id)
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' })
    res.json(producto)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al consultar el producto' })
  }
})

// POST - Crear un producto en MongoDB
app.post('/productos', async (req, res) => {
  if (!camposValidos(req.body)) return res.status(400).json({ mensaje: 'Nombre, descripcion y precio validos son obligatorios' })
  try {
    const { nombre, descripcion, precio } = req.body
    const producto = await Producto.create({ nombre: nombre.trim(), descripcion: descripcion.trim(), precio: Number(precio) })
    res.status(201).json(producto)
  } catch (error) {
    if (error.name === 'ValidationError') return res.status(400).json({ mensaje: error.message })
    res.status(500).json({ mensaje: 'Error al crear el producto' })
  }
})

// PUT - Actualizar un producto existente
app.put('/productos/:id', async (req, res) => {
  if (!idValido(req.params.id)) return res.status(400).json({ mensaje: 'Id no valido' })
  if (!camposValidos(req.body)) return res.status(400).json({ mensaje: 'Nombre, descripcion y precio validos son obligatorios' })
  try {
    const { nombre, descripcion, precio } = req.body
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      { nombre: nombre.trim(), descripcion: descripcion.trim(), precio: Number(precio) },
      { new: true, runValidators: true }
    )
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' })
    res.status(200).json(producto)
  } catch (error) {
    if (error.name === 'ValidationError') return res.status(400).json({ mensaje: error.message })
    res.status(500).json({ mensaje: 'Error al actualizar el producto' })
  }
})

// DELETE - Eliminar un producto existente
app.delete('/productos/:id', async (req, res) => {
  if (!idValido(req.params.id)) return res.status(400).json({ mensaje: 'Id no valido' })
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id)
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' })
    res.status(200).json({ mensaje: 'Producto eliminado', producto })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el producto' })
  }
})

// Iniciar servidor solo después de conectar a MongoDB
async function iniciarServidor() {
  try {
    if (!process.env.MONGODB_URI) throw new Error('Falta MONGODB_URI en .env')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Conexion a MongoDB exitosa')
    const puerto = process.env.PORT || 3000
    app.listen(puerto, () => console.log(`Servidor corriendo en http://localhost:${puerto}`))
  } catch (error) {
    console.error('Error de conexion a MongoDB:', error.message)
    process.exitCode = 1
  }
}

iniciarServidor()
