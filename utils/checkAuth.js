import Jwt from "jsonwebtoken";

export default (req,res,next) => {
//    спарсим токен и расшифруем
    const token = (req.headers.authorization || '').replace(/Bearer\s?/,'');
    if(token) {
        try{
            const decode = Jwt.verify(token, 'secret123');
            req.userId = decode._id;
            next();
        }catch (e) {
            return  res.status(403).json({
                message:'Нет доступа'
            })
        }
    }else {
       return  res.status(403).json({
            message:'Нет доступа'
        })
    }
}