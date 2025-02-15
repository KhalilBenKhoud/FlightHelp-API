const router = require('express').Router() ;
const ticketController = require('../controllers/ticket.controller') ;
const pagination = require('../middlewares/pagination');
<<<<<<< HEAD
const fileUploader = require('express-fileupload')


router.post('/',fileUploader(),ticketController.createTicket) ;
router.post('/search',ticketController.searchTickets) ;
router.put('/close/:id',ticketController.closeTicket) ;
router.get('/all',ticketController.getAllTickets,pagination) ;
router.get('/current/all',ticketController.getTicketsOfCurrentUser,pagination) ;
router.post('/search/users',ticketController.searchUsersToTag) ;
router.put('/:id',ticketController.updateTicket) ;
router.get('/:id',ticketController.getTicket) ;


=======


router.post('/',ticketController.createTicket) ;
router.put('/:id',ticketController.updateTicket) ;
router.put('/close/:id',ticketController.closeTicket) ;
router.get('/current/all',ticketController.getTicketsOfCurrentUser,pagination)
>>>>>>> 518a7d06a59903dfec308f5380d7d44ad6c92f63

module.exports = router