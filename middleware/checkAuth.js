import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

const checkAuth = async (req, res, next) => {
    let token = req.headers.authorization;
    if(token && token.startsWith('Bearer')){
        try {
            token = token.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            req.usuario = await Usuario.findById(decoded.id).select("-password -confirmado -token -createdAt -updatedAt -__v");
        } catch (error) {
            return res.status(404).json({msg: 'Hubo un error'});
        }
    } else {
        const error = new Error('Token no válido');
        return res.status(401).json({msg: error.message});
    }

    next();
};

export default checkAuth;