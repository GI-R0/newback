const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    
    if (!name || !email || !password) {
      return res.status(400).json({ 
        mensaje: "Faltan datos para registrarte",
        campos: {
          nombre: !name ? "¿Cómo te llamas?" : null,
          email: !email ? "¿Cuál es tu correo?" : null,
          contraseña: !password ? "Elige una contraseña" : null
        }
      });
    }

    
    if (password.length < 6) {
      return res.status(400).json({ 
        mensaje: "La contraseña es muy corta",
        sugerencia: "Usa al menos 6 caracteres"
      });
    }

    
    const userExistente = await User.findOne({ email });
    if (userExistente) {
      return res.status(400).json({ 
        mensaje: "Este correo ya está registrado",
        sugerencia: "¿Ya tienes una cuenta? Inicia sesión"
      });
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
      { _id: nuevoUsuario._id, email: nuevoUsuario.email, role: nuevoUsuario.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      mensaje: "¡Bienvenido! Tu cuenta ha sido creada",
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.name,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.role,
        imagen: nuevoUsuario.image
      },
      token
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ 
      mensaje: "Ups, algo salió mal al crear tu cuenta",
      error: error.message 
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    if (!email || !password) {
      return res.status(400).json({ 
        mensaje: "Faltan datos para iniciar sesión",
        campos: {
          email: !email ? "¿Cuál es tu correo?" : null,
          contraseña: !password ? "¿Tu contraseña?" : null
        }
      });
    }

    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        mensaje: "No encontramos una cuenta con este correo",
        sugerencia: "¿Quieres registrarte?"
      });
    }

    
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        mensaje: "La contraseña no es correcta",
        sugerencia: "¿Olvidaste tu contraseña?"
      });
    }

    const token = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      mensaje: "¡Bienvenido de nuevo!",
      usuario: {
        id: user._id,
        nombre: user.name,
        email: user.email,
        rol: user.role,
        imagen: user.image
      },
      token
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ 
      mensaje: "Ups, algo salió mal al iniciar sesión",
      error: error.message 
    });
  }
};

module.exports = {
  register,
  login
};
