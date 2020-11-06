const mongoose = require('mongoose')

const adminschema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
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
        required: true
    },
    phone: {
        type: String,
        required: true,
        minlength: 8
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    }
}, { timestamps: true })


adminschema.virtual('staffs', {
    ref: 'Staff',
    localField: '_id',
    foreignField: 'admin'
})

adminschema.set('toObject', { virtuals: true })
adminschema.set('toJSON', { virtuals: true })

const CorpAdminModel = mongoose.model('CorpAdmin', adminschema)

module.exports = { CorpAdminModel }