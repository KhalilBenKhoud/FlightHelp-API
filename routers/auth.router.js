const router = require('express').Router() ;
const authController = require('../controllers/auth.controller')

router.get('/test',authController.testAuth) ;

router.post('/register',authController.register) ;

router.post('/login',authController.login) ;

router.post('/refreshToken',authController.handleRefreshToken) ;

router.post('/logout', authController.logout) ;

router.post('/forgetPassword',authController.forgetPassword) ;

router.post('/verifyToken',authController.verifyToken) ;

router.post('/resetPassword',authController.resetPassword) ;


module.exports = router