const mongoose = require('mongoose')

const staffschema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
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
    created: {
        year: Number,
        month: Number,
        weekday: Number,
        day: Number,
        hour: Number,
        minute: Number
    },
    updated: {
        year: Number,
        month: Number,
        weekday: Number,
        day: Number,
        hour: Number,
        minute: Number
    }
})

staffschema.virtual('services', {
    ref: 'Service',
    localField: '_id',
    foreignField: 'staff'
})

staffschema.set('toObject', { virtuals: true })
staffschema.set('toJSON', { virtuals: true })

const StaffModel = mongoose.model('Staff', staffschema)

module.exports = { StaffModel }