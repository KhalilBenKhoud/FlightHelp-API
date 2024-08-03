const router = require('express').Router() ;
const notificationController = require('../controllers/notification.controller') ;

router.get('/current',notificationController.getNotificationsByUser) ;

module.exports = router ;