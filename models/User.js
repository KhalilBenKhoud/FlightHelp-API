const mongoose = require('mongoose') ;
const Schema = mongoose.Schema ;

const userSchema = new Schema({
    tunisairId : {
        type : String,
        required : true
    },
    fullname : {
        type  : String ,
        required : true,
        minLength : 6,
        maxLength : 35,  
    },
    email : {
        type : String,
        required : true,
        unique : [true,'Il y a déjà un utilisateur avec cet e-mail'],
        validate : {
            validator : v => v.includes("@") && v.includes("."),
            message : props => `${props.value} n'est pas une adresse e-mail valide`
        }
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String ,
        enum : ['USER','ADMIN'] ,
        default : 'USER',
        required : true
    },
    refreshTokenVersion : {
        type : Number,
        default : 0
    },
    resetToken : {
        token : String,
        createdAt : Date
    },
    profileImage : String ,
    createdAt : {
        type : Date,
        default : Date.now()
    },
    updatedAt : Date
})

userSchema.post('save', function(doc) {
    doc.updatedAt = Date.now() ;
})

module.exports = mongoose.model('User',userSchema) ;