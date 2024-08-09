const router = require('express').Router() ;
const ticketController = require('../controllers/ticket.controller') ;
const pagination = require('../middlewares/pagination');


router.post('/',ticketController.createTicket) ;
router.put('/:id',ticketController.updateTicket) ;
router.put('/close/:id',ticketController.closeTicket) ;
router.get('/current/all',ticketController.getTicketsOfCurrentUser,pagination)

module.exports = router