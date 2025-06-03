const Product = require("../models/product");
const { cloudinary } = require("../config/cloudinary");

// Crear producto
const createProduct = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ msg: "Título y descripción son obligatorios" });
    }

    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => ({
        url: file.path,
        public_id: file.filename
      }));
    }

    const nuevoProducto = new Product({
      title,
      description,
      images,
      createdBy: req.user._id
    });

    await nuevoProducto.save();

    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(500).json({ msg: "Error al crear producto", error: error.message });
  }
};

// Obtener todos los productos
const getProducts = async (req, res) => {
  try {
    const productos = await Product.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener productos", error: error.message });
  }
};

// Obtener un solo producto
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Product.findById(id).populate('createdBy', 'name email');

    if (!producto) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }

    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ msg: "Error al buscar producto", error: error.message });
  }
};

// Actualizar producto
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const datosActualizados = { title, description };

    if (req.files && req.files.length > 0) {
      datosActualizados.images = req.files.map(file => ({
        url: file.path,
        public_id: file.filename
      }));
    }

    const productoActualizado = await Product.findByIdAndUpdate(id, datosActualizados, { new: true })
      .populate('createdBy', 'name email');

    if (!productoActualizado) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }

    res.status(200).json(productoActualizado);
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar producto", error: error.message });
  }
};

// Eliminar producto
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Product.findById(id);
    if (!producto) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }

    // Borrar imágenes en Cloudinary
    for (const img of producto.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({ msg: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar producto", error: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
