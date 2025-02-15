
const credentials = (req,res,next) => {
        res.header('Access-Control-Allow-Credentials', '*') ;
        next()
    }

module.exports = credentials ; 