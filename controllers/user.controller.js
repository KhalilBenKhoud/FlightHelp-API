const User = require('../models/User') ;
<<<<<<< HEAD
const Ticket = require('../models/Ticket') ;
=======
>>>>>>> 518a7d06a59903dfec308f5380d7d44ad6c92f63
const path = require('path') ;
const fs = require('fs') ;
const fsPromises = require('fs').promises ;
const  {setValue, retriveValue} = require('../config/redisClient')
<<<<<<< HEAD
const bcrypt = require('bcrypt')
=======
>>>>>>> 518a7d06a59903dfec308f5380d7d44ad6c92f63

const getCurrentUser = async (req,res,next) => {
    try {
     const cachedUser = await retriveValue(`user_${req.connected_id}`) ;
<<<<<<< HEAD
     const openTickets = await Ticket.countDocuments({createdBy : req.connected_id , status : 'open'}).exec();
    if(cachedUser && Object.keys(cachedUser).length > 0) {
         console.log('cached user from redis ') ;
         res.status(200).json({profile : {...cachedUser,openTickets}}) ;
=======
    if(Object.keys(cachedUser).length > 0) {
         console.log('cached user from redis ') ;
         res.status(200).json({profile : cachedUser}) ;
>>>>>>> 518a7d06a59903dfec308f5380d7d44ad6c92f63
    }
    else {
    const user = await User.findOne({_id : req.connected_id}).exec() ;
    if(!user) res.sendStatus(404) ;
    else {
        await setValue(`user_${req.connected_id}`,user) ;
<<<<<<< HEAD
        res.status(200).json({profile : {...user,openTickets}}) ;
    }
    }
   }catch(err) {
      console.error(err) ;
=======
        res.status(200).json({profile : user}) ;
    }
    }
   }catch(err) {
>>>>>>> 518a7d06a59903dfec308f5380d7d44ad6c92f63
      next(err) ;
   }
}

const uploadProfileImage = async (req,res,next) => {
    try {
    const file = req.files?.profile ;
    if(!file) return res.sendStatus(404) ;
    const prefix = req.connected_id ;
    // each profile image starts with the id of the user
    const imageName =  prefix + '_' + file.name ;
    
    const oldProfileImages = fs.readdirSync(path.join(__dirname,'..','public','images')).filter(file => 
        file.startsWith(prefix)
    )
    
    Promise.all(oldProfileImages.map(image => fsPromises.rm(path.join(__dirname,'..','public','images',image),{force : true}) )).then(() => fsPromises.writeFile(path.join(__dirname,'..','public','images',imageName),file.data)  ) ;

    const user = await User.findOne({_id : req.connected_id}).exec() ;
    user.profileImage = imageName ;
    await user.save() ;
    res.status(200).json({message : 'photo de profil ajoutée'}) ;
    }
    catch(err) {
       next(err) ;
    }
}

const retrieveProfileImage = async (req,res,next) => {
    try { 
    
    const user = await User.findOne({_id : req.connected_id}).exec() ;
    if(!user) return res.sendStatus(400) ;
<<<<<<< HEAD
    if(!user.profileImage) return res.sendStatus(204) ;

    const image = await fsPromises.readFile(path.join(__dirname,'..','public','images',user.profileImage)) ;
    if(!image) res.sendStatus(204) ;
    else {
        const imageBase64 = image.toString('base64'); 
        res.status(200).json({image : imageBase64}) ;
    }
=======
    const image = await fsPromises.readFile(path.join(__dirname,'..','public','images',user.profileImage)) ;
    if(!image) res.sendStatus(204) ;
    else res.status(200).json({image}) ;
>>>>>>> 518a7d06a59903dfec308f5380d7d44ad6c92f63
    
    }catch(err) {
        next(err) ;
    }
}

const updateProfile = async (req,res,next) => {
    
    try {
     const {tunisairId, fullname, email, password} = req.body ;
     const user = await User.findOne({_id : req.connected_id}).exec() ;
     if(tunisairId) user.tunisairId = tunisairId ;
     if(fullname) user.fullname = fullname ;
     if(email) user.email = email ;
<<<<<<< HEAD
     if(password){
        const hashedPassword = await bcrypt.hash(password,10) ;
        user.password = hashedPassword ;
     }
=======
     if(password) user.password = password ;
>>>>>>> 518a7d06a59903dfec308f5380d7d44ad6c92f63
    
     await user.save() ; 
     await setValue(`user_${req.connected_id}`,user) ;

     res.status(200).json({message: 'informations mises à jour !'}) ;
    } catch(err) {
        next(err)
    }
}

<<<<<<< HEAD


=======
>>>>>>> 518a7d06a59903dfec308f5380d7d44ad6c92f63
module.exports = {getCurrentUser , uploadProfileImage , retrieveProfileImage , updateProfile} 