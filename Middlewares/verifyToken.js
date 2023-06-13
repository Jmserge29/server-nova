import jwt from 'jsonwebtoken'
import User from '../Models/User.js'
import Role from '../Models/Role.js'

export const verifyToken = async (req, res, next) => {
    try {
        // Getting the headers for token
        const token = req.headers['x-access-token']
        if (!token) {
            return res.status(401).json({
                auth: false,
                message: 'no token provided'
            })
        }

        const tokenDecoded = jwt.verify(token, process.env.SECRET_KEY_TOKEN)
        req.userId = tokenDecoded.id;

        const user = await User.findById(req.userId, { password: 0 })

        if (!user) return res.status(404).json({
            message: 'User not found'
        })

        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }
}

export const isAdmin = async(req,res,next)=>{
    try {
        const user = await User.findById(req.userId)
        const roleUser = await Role.find({_id: {$in: user.roles}})
        for(let i=0; i<roleUser.length;i++){
            if(roleUser[i].property === 'admin'){
                next();
                return;  
            }
        }
        return res.status(401).json({
            message: 'Unauthorized, required admin role'
        })
    } catch (error) {
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }
}

export const isModerator = async(req,res,next)=>{
    try {
        const user = await User.findById(req.userId)
        const roleUser = await Role.find({_id: {$in: user.roles}})
        for(let i=0; i<roleUser.length;i++){
            if(roleUser[i].property === 'moderator'){
                next();
                return;  
            }
        }
        return res.status(401).json({
            message: 'Unauthorized, required moderator role'
        })
    } catch (error) {
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }
}