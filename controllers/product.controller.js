const Product = require("../models/product");
const { cloudinary } = require("../config/cloudinary");
const { upload } = require("../config/cloudinary");


const createProduct = async (req, res) => {
  try {
    const { title, description } = req.body;

    
    if (!title || !description) {
      return res.status(400).json({ 
        mensaje: "Por favor, completa todos los campos",
        campos: {
          titulo: !title ? "¿Cómo se llama tu producto?" : null,
          descripcion: !description ? "Cuéntanos sobre tu producto" : null
        }
      });
    }

    if (description.length < 10) {
      return res.status(400).json({ mensaje: "La descripción es muy corta, cuéntanos más sobre tu producto" });
    }

    let images = [];
    if (req.file) {
      images = [{
        url: req.file.path,
        public_id: req.file.filename
      }];
    }

    const nuevoProducto = new Product({
      title,
      description,
      images,
      createdBy: req.user._id
    });

    await nuevoProducto.save();

    res.status(201).json({
      mensaje: "¡Producto creado con éxito!",
      producto: nuevoProducto
    });
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ 
      mensaje: "Ups, algo salió mal al crear el producto",
      error: error.message 
    });
  }
};


const getProducts = async (req, res) => {
  try {
    const productos = await Product.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      mensaje: productos.length > 0 ? "¡Aquí están los productos!" : "No hay productos aún",
      total: productos.length,
      productos: productos
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ 
      mensaje: "Ups, algo salió mal al buscar los productos",
      error: error.message 
    });
  }
};


const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ mensaje: "El ID del producto no es válido" });
    }

    const producto = await Product.findById(id).populate('createdBy', 'name email');

    if (!producto) {
      return res.status(404).json({ mensaje: "No encontramos este producto" });
    }

    res.status(200).json(producto);
  } catch (error) {
    console.error("Error al buscar producto:", error);
    res.status(500).json({ 
      mensaje: "Ups, algo salió mal al buscar el producto",
      error: error.message 
    });
  }
};


const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ mensaje: "El ID del producto no es válido" });
    }

    
    if (!title && !description && (!req.files || req.files.length === 0)) {
      return res.status(400).json({ mensaje: "No hay cambios para actualizar" });
    }

    const datosActualizados = {};
    if (title) {
      datosActualizados.title = title;
    }
    if (description) {
      if (description.length < 10) {
        return res.status(400).json({ mensaje: "La descripción es muy corta, cuéntanos más sobre tu producto" });
      }
      datosActualizados.description = description;
    }

    if (req.files && req.files.length > 0) {
      datosActualizados.images = req.files.map(file => ({
        url: file.path,
        public_id: file.filename
      }));
    }

    const productoActualizado = await Product.findByIdAndUpdate(
      id, 
      datosActualizados, 
      { new: true }
    ).populate('createdBy', 'name email');

    if (!productoActualizado) {
      return res.status(404).json({ mensaje: "No encontramos este producto" });
    }

    res.status(200).json({
      mensaje: "¡Producto actualizado con éxito!",
      producto: productoActualizado
    });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ 
      mensaje: "Ups, algo salió mal al actualizar el producto",
      error: error.message 
    });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ mensaje: "El ID del producto no es válido" });
    }

    const producto = await Product.findById(id);
    if (!producto) {
      return res.status(404).json({ mensaje: "No encontramos este producto" });
    }

    
    if (producto.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ mensaje: "No tienes permiso para eliminar este producto" });
    }

    // Borrar imágenes en Cloudinary
    if (producto.images && producto.images.length > 0) {
      for (const img of producto.images) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({ mensaje: "¡Producto eliminado con éxito!" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ 
      mensaje: "Ups, algo salió mal al eliminar el producto",
      error: error.message 
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
