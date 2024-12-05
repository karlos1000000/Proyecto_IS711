import jwt from 'jsonwebtoken';
import 'dotenv/config';

const authMiddleware = (req, res, next) => {

    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({
            message: 'Debe iniciar sesión'
        })
    }

    const clean_token = token.replace('Bearer ', '');

    try {

        const decoded = jwt.verify(clean_token, process.env.SECRET_KEY);

        req.user= decoded;

        next()
    } catch (err) {
        console.log(err);
        return res.status(401).json({
            message: 'Token inválido'
        })
    }
}

export default authMiddleware