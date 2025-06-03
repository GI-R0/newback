const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    const userExistente = await User.findOne({ email });
    if (userExistente) {
      return res.status(400).json({ msg: "Este correo ya está registrado" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    let image = null;
    if (req.file) {
      image = {
        url: req.file.path,
        public_id: req.file.filename
      };
    }

    const nuevoUsuario = new User({
      name,
      email,
      password: hashedPassword,
      image
    });

    await nuevoUsuario.save();

    const token = jwt.sign(
      { id: nuevoUsuario._id, email: nuevoUsuario.email, role: nuevoUsuario.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      user: {
        id: nuevoUsuario._id,
        name: nuevoUsuario.name,
        email: nuevoUsuario.email,
        role: nuevoUsuario.role,
        image: nuevoUsuario.image
      },
      token
    });
  } catch (error) {
    res.status(500).json({ msg: "Error al registrar", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Faltan datos para ingresar" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Credenciales incorrectas" });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image
      },
      token
    });
  } catch (error) {
    res.status(500).json({ msg: "Error al iniciar sesión", error: error.message });
  }
};

module.exports = {
  register,
  login,
};
