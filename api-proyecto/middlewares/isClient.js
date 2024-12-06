
const isClient = (req, res, next) => {
    try {

        if (req.user.role !== 'cliente') {
            return res.status(403).json({
                message: 'Es necesario ser cliente para acceder a esta ruta'
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

export default isClient