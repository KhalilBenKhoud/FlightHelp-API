const router = require('express').Router() ;
const notificationController = require('../controllers/notification.controller') ;
const pagination = require('../middlewares/pagination');

router.get('/current',notificationController.getNotificationsByUser,pagination) ;

module.exports = router ;