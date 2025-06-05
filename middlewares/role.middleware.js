const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                mensaje: 'Necesitas iniciar sesión para continuar'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                mensaje: 'No tienes permiso para realizar esta acción'
            });
        }

        next();
    };
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ 
            mensaje: 'Solo los administradores pueden realizar esta acción'
        });
    }
    next();
};

const esMismoUsuarioOAdmin = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user._id !== req.params.id) {
        return res.status(403).json({ 
            mensaje: 'Solo puedes modificar tu propia cuenta'
        });
    }
    next();
};

module.exports = {
    checkRole,
    isAdmin,
    esMismoUsuarioOAdmin
};