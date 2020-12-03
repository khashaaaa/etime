const mongoose = require('mongoose')

const userschema = new mongoose.Schema({
    fathername: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true,
        minlength: 8
    },
    address: {
        type: String
    },
    profilepic: {
        type: String
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
}, { timestamps: true })

const UserModel = mongoose.model('User', userschema)

module.exports = { UserModel }