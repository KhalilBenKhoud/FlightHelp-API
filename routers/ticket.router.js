const router = require('express').Router() ;
const ticketController = require('../controllers/ticket.controller') ;
const pagination = require('../middlewares/pagination');
const fileUploader = require('express-fileupload')


router.post('/',fileUploader(),ticketController.createTicket) ;
router.post('/search',ticketController.searchTickets) ;
router.put('/close/:id',ticketController.closeTicket) ;
router.get('/all',ticketController.getAllTickets,pagination) ;
router.get('/current/all',ticketController.getTicketsOfCurrentUser,pagination) ;
router.post('/search/users',ticketController.searchUsersToTag) ;
router.put('/:id',ticketController.updateTicket) ;
router.get('/:id',ticketController.getTicket) ;



module.exports = router