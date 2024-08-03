const router = require('express').Router() ;
const ticketController = require('../controllers/ticket.controller') ;


router.post('/',ticketController.createTicket) ;
router.put('/:id',ticketController.updateTicket) ;
router.put('/close/:id',ticketController.closeTicket) ;


module.exports = router