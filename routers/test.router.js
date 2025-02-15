const router = require('express').Router() ;
const testController = require('../controllers/test.controller')

router.get('/test',testController.test) ;

<<<<<<< HEAD
router.post('/test',testController.testPost) ;

=======
>>>>>>> 518a7d06a59903dfec308f5380d7d44ad6c92f63

module.exports = router
