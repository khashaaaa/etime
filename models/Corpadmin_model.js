const mongoose = require('mongoose')

const companyschema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
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
    type: {
        type: String
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
        type: String,
        required: true
    },
    sysadmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sysadmin',
        required: true
    }
}, { timestamps: true })

companyschema.virtual('staffs', {
    ref: 'Staff',
    localField: '_id',
    foreignField: 'company'
})

companyschema.set('toObject', { virtuals: true })
companyschema.set('toJSON', { virtuals: true })

const CompanyModel = mongoose.model('Company', companyschema)

module.exports = { CompanyModel }