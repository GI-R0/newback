
const isAdmin = (req, res, next) => {
  if (req.user.rol !== "admin") {
    return res.status(403).json({ message: "Permiso denegado: solo administradores" });
  }
  next();
};


const esMismoUsuarioOAdmin = (req, res, next) => {
  if (req.user.rol !== "admin" && req.user.id !== req.params.id) {
    return res.status(403).json({ message: "Solo puedes modificar tu propia cuenta" });
  }
  next();
};

module.exports = {
  isAdmin,
  esMismoUsuarioOAdmin,
};