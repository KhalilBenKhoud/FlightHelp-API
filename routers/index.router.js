const router = require('express').Router() ;
const verifyJwt = require('../middlewares/verifyJwt');
const authRouter = require('./auth.router') ;
const testRouter = require('./test.router') ;
const ticketRouter = require('./ticket.router') ;
const userRouter = require('./user.router') ;
const notificationRouter = require('./notification.router') ;
const feedbackRouter = require('./feedback.router') ;
const adminRouter = require('./admin.router') ;
const verifyRole = require('../middlewares/verifyRole') ;

router.use('/auth',authRouter) ;

router.use(verifyJwt)
router.use('/test',testRouter) ;
router.use('/ticket',ticketRouter) ;
router.use('/user',userRouter) ;
router.use('/notification',notificationRouter) ;
router.use('/feedback', feedbackRouter) ;

router.use(verifyRole('ADMIN')) ;
router.use('/admin',adminRouter) ;

router.all('*',(req,res) => {
    res.status(404).json({message : 'no route found !'})
})

module.exports = router