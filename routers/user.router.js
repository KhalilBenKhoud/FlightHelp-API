const router = require('express').Router() ;
const userController = require('../controllers/user.controller') ;
const fileUploader = require('express-fileupload')

router.get('/current',userController.getCurrentUser) ;
router.post('/upload/profileImage',fileUploader(),userController.uploadProfileImage) ;
router.get('/profileImage',userController.retrieveProfileImage) ;
router.put('/current/update',userController.updateProfile) ;

module.exports = router ;