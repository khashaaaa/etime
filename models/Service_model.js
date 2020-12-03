const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    staff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    startdate: {
        type: Date,
        required: true
    },
    enddate: {
        type: Date,
        required: true
    },
    accomplished: false
})

const ServiceModel = mongoose.model('Service', serviceSchema)

module.exports = { ServiceModel }