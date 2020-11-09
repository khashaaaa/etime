const mongoose = require('mongoose')

const staffschema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    isAdmin: false,
    fathername: {
        type: String,
        required: true,
        trim: true
    },
    givenname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        minlength: 8
    },
    address: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    calendar: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CorpAdmin',
        required: true
    }
}, { timestamps: true })

const StaffModel = mongoose.model('Staff', staffschema)

module.exports = { StaffModel }