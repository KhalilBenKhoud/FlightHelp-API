const Ticket = require('../models/Ticket') ;
const User = require('../models/User') ;
const createNotification = require('../utils/createNotification') ;
const fsPromises = require('fs').promises ;
const path = require('path') ;

const createTicket = async (req,res,next) => {
    try {
      const {title, description , priority , taggedUsers } = req.body ;
      const file = req.files?.image ;
      const prefix = req.connected_id ;
      const imageName = file ? (prefix + '_' + file?.name) : '' ;


      if(!title || !description  || !priority) return res.status(400).json({message : 'Veuillez remplir tous les champs !'}) ;
      const createdTicket = await Ticket.create({
          title,
          description,
          priority,
          status : 'open',
          createdBy :  req.connected_id,
          taggedUsers : taggedUsers || [],
          image : imageName
      })
      if(file)
      await fsPromises.writeFile(path.join(__dirname,'..','public','tickets',imageName),file.data)

      const user = await User.findOne({_id : req.connected_id }).exec() ;

      createNotification(req.connected_id,'ticket crée !',`${user.fullname} a crée un ticket à ${new Date().toLocaleString()}`,[...(taggedUsers || []),req.connected_id]) ;

      res.status(201).json({'message' : 'ticket crée avec succès !'}) ;

    }catch(err) {
        next(err)
    }
}

const updateTicket = async (req,res,next) => {
   try {
   const ticketId = req.params.id ;
   const {description , priority , taggedUsers } = req.body ;
   if(!ticketId) return res.sendStatus(404) ;
   const ticket = await Ticket.findOne({_id : ticketId }).exec() ;
   if(!ticket) return res.sendStatus(409) ;
   if(ticket.createdBy != req.connected_id) return res.sendStatus(401) ;
    if(description) ticket.description = description ;
    if(priority) ticket.priority = priority ;
    if(taggedUsers) ticket.taggedUsers = taggedUsers ;
    await ticket.save() ;
    res.status(200).json({message : 'ticket mis à jour !', ticket})
  
   }catch(err) {
      next(err) ;
   }
}

const closeTicket = async (req,res,next) => {
   try {
   const ticketId = req.params.id ;
   if(!ticketId) return res.sendStatus(404) ;
   const ticket = await Ticket.findOne({_id : ticketId }).populate('createdBy').exec() ;
   if(!ticket) return res.sendStatus(409) ;
   if(ticket.createdBy._id != req.connected_id) return res.sendStatus(401) ;
   ticket.status = "closed" ;
   await ticket.save() ;



   createNotification(req.connected_id,'ticket fermé !',`${ticket.createdBy?.fullname} a fermé un ticket à ${new Date().toLocaleString()}`,[...(ticket.taggedUsers || []),req.connected_id]) ;


   res.status(200).json({message : 'ticket fermé !', ticket}) ;
  
   }catch(err) {
      next(err) ;
   }
}

const getTicketsOfCurrentUser = async (req,res,next) => {
   try {
      
      const tickets = await Ticket.find({createdBy : req.connected_id}).sort({updatedAt : -1,createdAt : -1}).populate('createdBy','fullname')
      .populate({
         path: 'taggedUsers',
         select: 'email', 
     })
     .exec()  ;
      if(!tickets) {
        return res.sendStatus(204) ;
      }
      else {
      req.data = tickets ;
      next() ;
      }
   }catch(err) {
      next(err) ;
   }
}

const getAllTickets = async (req,res,next) => {
   try {
      
      const tickets = await Ticket.find().sort({updatedAt : -1, createdAt : -1}).populate('createdBy','fullname')
      .populate({
         path: 'taggedUsers',
         select: 'email', 
     })
     .exec() ;
      if(!tickets) {
        return res.sendStatus(204) ;
      }
    
      req.data = tickets ;
      next() ;
      
   }catch(err) {
      next(err) ;
   }
}

const searchUsersToTag = async (req,res,next) => {
   try {
      const {query} = req.body ;

      const users = await User.find({email : {$regex : query , $options : 'i'} }) ;
      if(!users) res.sendStatus(204) ;
      else res.status(200).json({users}) ;

   }catch(err) {
      next(err) ;
   }
}

const searchTickets = async (req,res,next) => {
   try {
      const {query} = req.body ;

      const tickets = await Ticket.find({$or : 
         [
            {title : {$regex : query , $options : 'i'} } ,
            {description : {$regex : query , $options : 'i'} } ,
         ] } ) ;
      if(!tickets) res.sendStatus(204) ;
      else res.status(200).json({tickets}) ;

   }catch(err) {
      next(err) ;
   }
}

const getTicket = async (req,res,next) => {
   try {

      const {id} = req.params ;
      if(!id) return res.sendStatus(404) ;

      const ticket = await Ticket.findOne({_id : id}).populate('createdBy','fullname')
      .populate({
         path: 'taggedUsers',
         select: 'email', 
     })
     .populate({
      path : 'feedbacks',
      populate : {
         path : 'createdBy',
         select : 'fullname'
      }
     })
     .exec() ;

  
     let imageBase64 = '';
     if (ticket.image) {
       const image = await fsPromises.readFile(
         path.join(__dirname, '..', 'public', 'tickets', ticket.image)
       );
       imageBase64 = image.toString('base64'); 
     }
 

      res.status(200).json({ticket : {...ticket._doc , image: imageBase64 || '' }}) ;

   }catch(err) {
      next(err) ;
   }
}

module.exports = {getTicket , searchTickets,  createTicket  ,  updateTicket , closeTicket , getTicketsOfCurrentUser , getAllTickets, searchUsersToTag}