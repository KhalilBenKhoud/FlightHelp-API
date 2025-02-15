

const test = (req,res,next) => {
    res.json({message : 'test controller works'})
}

<<<<<<< HEAD
const testPost = (req,res,next) => {
    res.json({message : req.body.message })
}



module.exports = {test , testPost}
=======

module.exports = {test}
>>>>>>> 518a7d06a59903dfec308f5380d7d44ad6c92f63
