const User = require("../models/User") ;
const Ticket = require('../models/Ticket') ;
const adminPipeline = require('../utils/adminPipeline') ;
const mongoose = require('mongoose') ;
const createNotification = require('../utils/createNotification') ;

const getAllUsers = async (req,res,next) => {
   try {
  
    const users = await User.find() ;
    if(!users) res.sendStatus(204) ;
    else res.status(200).json({users})
   
   } catch(err) {
      next(err) ;
   }
}

const getTicketsCountByStatus = async (req,res,next) => {
   try {
    const priority = req.params.priority ;
    const ticketCount = await Ticket.aggregate(adminPipeline.ticketsCountByStatus(priority)) ;
    res.status(200).json({ticketCount}) ;

   }catch(err) {
      next(err) ;
   }
}
const getTicketsByUser = async (req,res,next) => {
   try {
    const priority = req.query.priority ;
    const status = req.query.status ;
    const userId =   mongoose.Types.ObjectId.createFromHexString(req.query.userId) ;
    const tickets = await Ticket.aggregate(adminPipeline.ticketsByUser(userId,status,priority)) ;
    res.status(200).json({tickets}) ;

   }catch(err) {
      next(err) ;
   }
}


const getAverageAmountOfTickets = async (req,res,next) => {
    try {
     const averageTicketsCount = await Ticket.aggregate(adminPipeline.averageNumberOfTicketsPerUser()) ;
     res.status(averageTicketsCount ? 200 : 204).json({averageTicketsCount}) ;

    } catch(err) {
      next(err) ;
    }
}

const resolveTicket = async (req,res,next) => {
   try {
      const ticketId = req.params.id ;
      if(!ticketId) return res.sendStatus(404) ;
      const ticket = await Ticket.findOne({_id : ticketId }).populate('createdBy').exec() ;
      if(!ticket) return res.sendStatus(409) ;
      ticket.status = 'resolved'
      await ticket.save() ;
      const admin = await User.findOne({role : 'ADMIN'}).exec() ;
   
      createNotification(admin._id,'ticket résolu !',`${admin.fullname} a résolu le ticket de ${ticket.createdBy.fullname}`,
         [...ticket.taggedUsers,ticket.createdBy._id] 
      ) ;
   
      res.status(200).json({message : 'ticket résolu !', ticket}) ;
     
      }catch(err) {
         next(err) ;
      }
}



module.exports = { getAllUsers , getTicketsCountByStatus , getTicketsByUser , resolveTicket , getAverageAmountOfTickets } ;