

const test = (req,res,next) => {
    res.json({message : 'test controller works'})
}

const testPost = (req,res,next) => {
    res.json({message : req.body.message })
}



module.exports = {test , testPost}