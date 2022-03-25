const mongoose = require('mongoose');

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

const User = mongoose.model( 'USer', userSchema)

module.exports = { User };