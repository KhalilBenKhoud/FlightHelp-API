const router = require('express').Router() ;
const adminController = require('../controllers/admin.controller') ;

router.get('/allUsers',adminController.getAllUsers) ;
router.get('/ticket/count/:priority?',adminController.getTicketsCountByStatus) ;
router.get('/ticket/by/user',adminController.getTicketsByUser) ;
router.get('/ticket/average',adminController.getAverageAmountOfTickets) ;
router.put('/ticket/resolve/:id',adminController.resolveTicket) ;


module.exports = router 