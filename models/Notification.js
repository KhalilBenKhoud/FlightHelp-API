const mongoose = require('mongoose') ;
const Schema = mongoose.Schema ;

const notificationSchema = new Schema({
    issuer : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required: true
    },
    receivers : [
       {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User',
            required: true
       }  
    ],
    title : {
        type : String ,
        required : true
    },
    content : {
       type : String,
       required : true
    },
    createdAt : {
        type : Date,
        default : Date.now() 
    }
})

module.exports =  mongoose.model('Notification',notificationSchema) ;