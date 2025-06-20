const mongoose = require('mongoose');
const Product = require('../models/product');
require('dotenv').config();

const products = [
  { title: 'Producto 1', description: 'Descripción 1', createdBy: '6834e3cde3f77bd49901d7bf' },
  { title: 'Producto 2', description: 'Descripción 2', createdBy: '6834e3cde3f77bd49901d7bf' },
  { title: 'Producto 3', description: 'Descripción 3', createdBy: '6834e3cde3f77bd49901d7bf' },
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Product.insertMany(products)
      .then(() => console.log('Productos insertados'))
      .catch(err => console.error('Error al insertar productos:', err));
    mongoose.connection.close();
  })
  .catch((err) => console.error('Error en la seed:', err));
