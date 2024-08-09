const Ticket = require('../models/Ticket') ;
const User = require('../models/User') ;
const createNotification = require('../utils/createNotification')

const createTicket = async (req,res,next) => {
    try {
      const {title, description , priority , taggedUsers } = req.body ;
      if(!title || !description  || !priority) return res.status(400).json({message : 'Veuillez remplir tous les champs !'}) ;
      const createdTicket = await Ticket.create({
          title,
          description,
          priority,
          status : 'open',
          createdBy :  req.connected_id,
          taggedUsers
      })

      const user = await User.findOne({_id : req.connected_id }).exec() ;

      createNotification(req.connected_id,'ticket crée !',`${user.fullname} a crée un ticket`,[...taggedUsers,req.connected_id]) ;

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
   const ticket = await Ticket.findOne({_id : ticketId }).exec() ;
   if(!ticket) return res.sendStatus(409) ;
   if(ticket.createdBy != req.connected_id) return res.sendStatus(401) ;
   ticket.status = 'closed'
   await ticket.save() ;
   createNotification(req.connected_id,'ticket fermé !',`${user.fullname} a fermé son ticket`,[...ticket.taggedUsers,req.connected_id]) ;

   res.status(200).json({message : 'ticket fermé !', ticket}) ;
  
   }catch(err) {
      next(err) ;
   }
}

const getTicketsOfCurrentUser = async (req,res,next) => {
   try {
      
      const tickets = await Ticket.find({createdBy : req.connected_id}).sort({createdAt : -1}).exec() ;
      if(!tickets) {
         res.sendStatus(204) ;
      }
      else {
      req.data = tickets ;
      next() ;
      }
   }catch(err) {
      next(err) ;
   }
}


module.exports = {createTicket  ,  updateTicket , closeTicket , getTicketsOfCurrentUser}