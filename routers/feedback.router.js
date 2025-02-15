const router = require('express').Router() ;
const feedbackController = require('../controllers/feedback.controller') ;

router.post('/:ticket_id',feedbackController.addFeedback) ;
router.put('/:id',feedbackController.updateFeedback) ;
router.delete('/:id',feedbackController.deleteFeedback) ;

module.exports = router 