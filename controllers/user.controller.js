const User = require("../models/user");
const cloudinary = require("../config/cloudinary");


const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("products");
    res.status(200).json({ success: true, users, count: users.length });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Error al obtener usuarios", error: error.message });
  }
};


const changeRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, msg: "No autorizado" });
  }

  const validRoles = ["user", "admin"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ success: false, msg: "Rol no válido" });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, msg: "Usuario no encontrado" });
    }

    user.role = role;
    await user.save();

    res.status(200).json({ success: true, msg: `Rol actualizado a ${role}` });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Error al cambiar rol" });
  }
};


const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (req.user.id !== id && req.user.role !== "admin") {
    return res.status(403).json({ success: false, msg: "No autorizado" });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, msg: "Usuario no encontrado" });
    }

    if (user.cloudinary_id) {
      await cloudinary.uploader.destroy(user.cloudinary_id);
    }

    await user.deleteOne(); // o User.findByIdAndDelete(id)

    res.status(200).json({ success: true, msg: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Error al eliminar usuario" });
  }
};

module.exports = {
  getUsers,
  changeRole,
  deleteUser,
};
