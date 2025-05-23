const User = require("../models/user");
const cloudinary = require("../config/cloudinary");


const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate('products');
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener usuarios" });
  }
};

const changeRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "No autorizado" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    user.role = role;
    await user.save();

    res.status(200).json({ msg: `Rol actualizado a ${role}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al cambiar rol" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id && req.user.role !== "admin") {
      return res.status(403).json({ msg: "No autorizado para eliminar este usuario" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    if (user.cloudinary_id) {
      await cloudinary.uploader.destroy(user.cloudinary_id);
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({ msg: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al eliminar usuario" });
  }
};

module.exports = {
  getUsers,
  changeRole,
  deleteUser,
};
