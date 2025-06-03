const mongoose = require('mongoose');

const connectDB = async () => {
  try {

    if (!process.env.MONGO_URI) {
      console.error("MONGO_URI no está definida en el archivo .env");
      process.exit(1);
    }
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(process.env.MONGO_URI, options);
    console.log("MongoDB conectado con exitoooo");

    mongoose.connection.on('error', (err) => {
      console.error('Error de conexión a MongoDB:', err);
    });
  } catch (error) {
    console.error('Fallo al conectar con MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
