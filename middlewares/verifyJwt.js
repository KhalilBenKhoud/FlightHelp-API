const jwt = require('jsonwebtoken') ;

const verifyJwt = async (req,res,next) => {
    const header = req.headers.authorization || req.headers.AUTHORIZATION ;
    if(!header?.startsWith('Bearer ')) return res.sendStatus(401) ;
    const token = header.split(' ')[1] ;
     jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(error,decoded) => {
        if(error) return res.sendStatus(403) ;
        req.connected_id = decoded._id ;
        req.role = decoded.role ;
        next() ;
     })
}

module.exports  = verifyJwt