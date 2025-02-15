const mongoose = require('mongoose')
const Schema = mongoose.Schema ;

const feedbackSchema = new Schema({
    content : {
        type : String,
<<<<<<< HEAD
       
=======
        required : true 
>>>>>>> 518a7d06a59903dfec308f5380d7d44ad6c92f63
    },
    stars : {
        type : Number,
        required : true ,
        validate : {
            validator : v => v <= 5 && v >= 0
        }
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User',
        required : true
     },
     concernedTicket : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'Ticket',
        required : true
     },
     createdAt : {
        type : Date,
        default : Date.now() 
     }
})

module.exports = mongoose.model('Feedback',feedbackSchema) 