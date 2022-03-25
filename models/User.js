const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const userSchema = mongoose.Schema({
    uName:{
        type: String,
        maxlength: 50
    },
    uEmail:{
        type: String,
        trim: true,
        unique:1
    },
    uPassword:{
        type: String,
        minlength: 5
    },
    uLastname:{
        type: String,
        maxlength: 50
    },
    uRole:{
        type: Number,
        default: 0
    },
    uImage:{
        type: String,
    },
    uTokenExp:{
        type: Number,
    },
})

userSchema.pre('save', function( next ){
     let user =  this;   

    if(user.isModified('uPassword')){
        //비밀번호 암호화
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err)
    
            bcrypt.hash( user.uPassword,salt, function(err,hash){
                if(err) return next(err)
                user.uPassword = hash
                next()
            })
        })
    }
    
})

const User = mongoose.model( 'User', userSchema)

module.exports = { User };