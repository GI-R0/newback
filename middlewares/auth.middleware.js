const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (req, res, next) => {
    console.log('Headers recibidos:', req.headers);
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('Error: No se proporcionó el token o formato incorrecto');
        return res.status(401).json({ 
            message: 'No se proporcionó el token de autenticación',
            received: authHeader
        });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token extraído:', token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decodificado:', decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error verificando token:', error.message);
        return res.status(401).json({ 
            message: 'Token inválido o expirado',
            error: error.message
        });
    }
}

module.exports = { auth };
