

const pagination = (req,res,next) => {
     try {
     let page = req.query?.page ; // the first page is of index 1
     let limit = req.query?.limit ;
     const data = req.data ;
     const dataLength = data?.length ;
     console.log('from pagination',page,limit) ;
     if(!limit || !page) return res.status(200).json({data , dataLength}) ;
     page = parseInt(page) ;
     limit = parseInt(limit) ;
     const paginatedData = data.slice((page-1)*limit,page*limit) ;
     
     res.status(200).json({data : paginatedData , dataLength}) ;

     }catch(err) {
          next(err)
     }
}

module.exports = pagination