
const credentials = (req,res,next) => {
<<<<<<< HEAD
        res.header('Access-Control-Allow-Credentials', '*') ;
=======
        res.header('Access-Control-Allow-Credentials', true) ;
>>>>>>> 518a7d06a59903dfec308f5380d7d44ad6c92f63
        next()
    }

module.exports = credentials ; 