const mongoose = require('mongoose')

const errorHandler = (err,req,res,next) => {
     
       if(err instanceof mongoose.Error.ValidationError) {
          const formatted = {}
          for(const [key,value] of Object.entries(err.errors))
          {
               formatted[key] = value.message ;
          }
          return res.status(400).json({message : formatted})
       }
        console.error(err) ;
      res.status(501).json({message : err.message})  
}

module.exports = errorHandler ;

