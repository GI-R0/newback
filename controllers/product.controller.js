const Product = require("../models/product");

const createProduct = async (req, res) => {
  try {
    const { title, description } = req.body;

    const newProduct = new Product({
      title,
      description,
    });

    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al crear producto" });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('createdBy');
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener productos" });
  }
};

const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate('createdBy');
    if (!product) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener producto" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al actualizar producto" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }

    res.status(200).json({ msg: "Producto eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al eliminar producto" });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
