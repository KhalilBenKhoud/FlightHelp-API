const mongoose = require('mongoose') ;
const Schema = mongoose.Schema ;

const ticketSchema = new Schema({
    title : {
        type : String,
        required : true ,
        unique : true
    },
    description : {
        type : String,
        required  :true 
    },
    createdBy : {
       type : mongoose.Schema.Types.ObjectId ,
       ref : 'User',
       required : true
    },
    status : {
        type : String,
        enum : ['open', 'resolved', 'closed'],
        required : true
    },
    priority : {
        type : String,
        enum  : ['low', 'medium', 'high', 'critical'],
        required : true
    },
    taggedUsers : [
        {
            type : mongoose.Schema.Types.ObjectId ,
            ref : 'User'
        }
    ],
    createdAt : {
        type : Date,
        default : Date.now()
    },
<<<<<<< HEAD
    image : {
        type : String,
        default : ''
    } ,
    feedbacks : [{
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'Feedback'
    }],
    solution : String,
=======
>>>>>>> 518a7d06a59903dfec308f5380d7d44ad6c92f63
    updatedAt : Date,
    resolvedAt : Date
})


ticketSchema.post('save',function(doc) {
   doc.updatedAt = Date.now()
})


module.exports = mongoose.model('Ticket',ticketSchema) ;