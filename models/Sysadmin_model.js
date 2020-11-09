const mongoose = require('mongoose')

const sysadmin = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: {
        type: String,
        required: true
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

sysadmin.virtual('companies', {
    ref: 'Company',
    localField: '_id',
    foreignField: 'sysadmin'
})

sysadmin.set('toObject', { virtuals: true })
sysadmin.set('toJSON', { virtuals: true })

const SysadminModel = mongoose.model('Sysadmin', sysadmin)

module.exports = { SysadminModel }