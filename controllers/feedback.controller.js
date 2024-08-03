const Feedback = require('../models/Feedback')

const addFeedback = async (req,res,next) => {
      try {
      const creator = req.connected_id ;
      const ticket_id = req.params.ticket_id ;
      const {content , stars} = req.body ;
      if(!content || !stars) return res.status(400).json({message : 'veuillez fournir votre avis'}) ;
      const feedback = await Feedback.create({
        content,
        stars,
        createdBy : creator,
        concernedTicket : ticket_id
      })
      res.status(201).json({message : 'merci pour votre feedback'}) ;

      } catch(err) {
        next(err) ;
      }
}

const updateFeedback = async (req,res,next) => {
      try {
      const id = req.params.id ;
      const {content , stars} = req.body ;
      const feedback = await Feedback.findOne({ _id : id }).exec() ; 
      if(content) feedback.content = content ;
      if(stars) feedback.stars = stars ;
      await feedback.save() ;
      res.status(200).json({message : 'feedback mis à jour !'}) ;

    } catch(err) {
        next(err) ;
    }
}

const deleteFeedback = async (req,res,next) => {
      
    try {
      
      const id = req.params.id ;
      const feedback = await Feedback.deleteOne({ _id : id }).exec() ; 
      res.status(200).json({message : 'feedback supprimé !'}) ;
    
    } catch(err) {
        next(err) ;
    }
}


module.exports = { addFeedback , updateFeedback , deleteFeedback } 
