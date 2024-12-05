
const isAdmin = (req, res, next) => {
    try {

        if (req.user.role !== 'administrador') {
            return res.status(403).json({
                message: 'No tiene permisos para acceder a esta ruta'
            })
        }

        next()
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Error en el servidor'
        })
    }
}

export default isAdmin