

const pagination = (req,res,next) => {
     try {
     const page = req.query.page ; // the first page is of index 1
     const limit = req.query.limit ;
     const data = req.data ;
     if(!limit || !page) return res.status(200).json({data}) ;
     const paginatedData = data.slice((page-1)*limit,page*limit) ;
     res.status(200).json({data : paginatedData}) ;
     }catch(err) {
          next(err)
     }
}

module.exports = pagination