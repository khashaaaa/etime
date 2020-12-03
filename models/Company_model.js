const mongoose = require('mongoose')

const companyschema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    sysadmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sysadmin',
        required: true
    },
    reg: {
        type: Number,
        minlength: 7,
        required: true
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        minlength: 8,
        required: true
    },
    password: {
        type: String
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

companyschema.virtual('staffs', {
    ref: 'Staff',
    localField: '_id',
    foreignField: 'company'
})

companyschema.virtual('services', {
    ref: 'Service',
    localField: '_id',
    foreignField: 'company'
})

companyschema.set('toObject', { virtuals: true })
companyschema.set('toJSON', { virtuals: true })

const CompanyModel = mongoose.model('Company', companyschema)

module.exports = { CompanyModel }