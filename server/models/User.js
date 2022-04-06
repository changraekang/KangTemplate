const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt =require('jsonwebtoken');
const { TokenExpiredError } = require('jsonwebtoken');

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
    uToken:{
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
    } else{
        next()
    }
    
})
userSchema.methods.comparePassword = function(plainPassword, cb){
        bcrypt.compare(plainPassword, this.uPassword, function(err, isMatch){
            if(err) return cb(err);
                cb(null,isMatch)
        })
}
userSchema.methods.generateToken = function(cb){
    
    let user = this;

    //jsonwebtoken이용
    let uToken =jwt.sign(user._id.toHexString(),'secretToken')



    user.uToken = uToken
    user.save(function(err, user) {
        if(err) return cb(err)
        cb(null, user)
    })

}


userSchema.statics.findByToken  = function(uToken, cb) {
    let user = this;

     // token decode 하기 복호화   
    jwt.verify(uToken, 'secretToken', function( err, decoded) {
        //User ID 이용해서 User를 찾은 다음에
        //Client에서 가져 온 token과 DB에 저장된 token을 비교

        user.findOne({"_id" : decoded, "uToken" : uToken} , function(err, user) {
            if (err) return cb(err);
            cb( null, user)

        })

    })


}




const User = mongoose.model( 'User', userSchema)

module.exports = { User };