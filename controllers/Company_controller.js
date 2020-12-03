const mongoose = require('mongoose')
const { SysadminModel } = require('../models/Sysadmin_model')
const { CompanyModel } = require('../models/Company_model')
const { StaffModel } = require('../models/Staff_model')
const { ServiceModel } = require('../models/Service_model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.profile = async (yw, ir) => {

    const { companyID } = yw.params
    const exist = await CompanyModel.findById(companyID)

    if(exist.length == 0) return ir.status(404).json('Result not found')

    try {
        ir.status(200).json(exist)
    }
    catch(aldaa) {
        ir.json(aldaa)
    }
}

exports.updateOne = async (yw, ir) => {

    const { companyID } = yw.params

    const salt = await bcrypt.genSalt()
    const hashed = await bcrypt.hash(yw.body.password, salt)

    var ognoo = new Date()

    const obj = {
        reg: yw.body.reg,
        name: yw.body.name,
        email: yw.body.email,
        address: yw.body.address,
        phone: yw.body.phone,
        password: hashed,
        updated: {
            year: ognoo.getFullYear(),
            month: ognoo.getMonth() + 1,
            weekday: ognoo.getDay(),
            day: ognoo.getDate(),
            hour: ognoo.getHours(),
            minute: ognoo.getMinutes()
        },
    }

    const update = await CompanyModel.findOneAndUpdate(companyID, obj)

    const updated = await CompanyModel.findOne({ _id: update.id }).populate({
        path: 'sysadmin',
        model: 'Sysadmin'
    })

    try {
        ir.status(200).json(updated)
    }
    catch(aldaa) {
        ir.json(aldaa)
    }
}

exports.companyLogin = async (yw, ir) => {

    const { email, password } = yw.body
    const company = await CompanyModel.findOne({ email: email })
    const isMatch = await bcrypt.compare(password, company.password)

    if(!company) return ir.json(`There is no user with the email ${email}`)
    if(!isMatch) return ir.json('Invalid password. Check again')

    try {

        const token = jwt.sign(company.toJSON(), process.env.JWT_SECRET, { expiresIn: '1h' })

        if(isMatch) return ir.status(200).json(
            {
                token,
                company
            }
        )
    }
    catch(aldaa) {
        ir.json(aldaa.message)
    }
}

// Staff route
exports.createStaff = async (yw, ir) => {

    const { companyID } = yw.params

    var ognoo = new Date()

    const staffdata = {
        _id: new mongoose.Types.ObjectId(),
        company: companyID,
        fathername: yw.body.fathername,
        givenname: yw.body.givenname,
        email: yw.body.email,
        phone: yw.body.phone,
        address: yw.body.address,
        description: yw.body.description,
        created: {
            year: ognoo.getFullYear(),
            month: ognoo.getMonth() + 1,
            weekday: ognoo.getDay(),
            day: ognoo.getDate(),
            hour: ognoo.getHours(),
            minute: ognoo.getMinutes()
        }
    }

    const newStaff = new StaffModel(staffdata)
    const saved = await newStaff.save()

    const created = await CompanyModel.findByIdAndUpdate(companyID, {
        $push: {
            staffs: saved
        }
    })

    const staff = await StaffModel.findOne({ company: created }).populate({
        path: 'company',
        model: 'Company'
    })

    try {
        ir.status(201).json(saved)
    }
    catch(aldaa) {
        ir.json(aldaa)
    }
}

exports.getStaffs = async (yw, ir) => {

    const { companyID } = yw.params

    const isFound = await StaffModel.find({ company: companyID }).populate({
        path: 'services',
        model: 'Service'
    })

    if(isFound.length == 0) return ir.status(404).json('There is no Staff admin')

    try {
        ir.status(200).json(isFound)
    }
    catch(aldaa) {
        ir.json(aldaa)
    }
}

exports.getSingleStaff = async (yw, ir) => {

    const { companyID, staffID } = yw.params

    const isFound = await StaffModel.findOne({ _id: staffID, company: companyID }).populate({
        path: 'company',
        model: 'Company'
    }).populate({
        path: 'services',
        model: 'Service'
    })

    if(isFound.length == 0) return ir.status(404).json('There is no Staff')

    try {
        ir.status(200).json(isFound)
    }
    catch(aldaa) {
        ir.json(aldaa)
    }
}

exports.updateStaff = async (yw, ir) => {
    
    const { companyID, staffID } = yw.params

    const staff = await StaffModel.findOne({ company: companyID })

    if(staff.length == 0) return ir.status(404).json('Company not found')

    const {
        fathername,
        givenname,
        email,
        phone,
        address,
        description
    } = yw.body

    const updated = await StaffModel.findOneAndUpdate(staffID, {
        fathername: fathername,
        givenname: givenname,
        email: email,
        phone: phone,
        address: address,
        description: description
    })

    try {
        await StaffModel.findOne({ _id: updated.id }).then(result => {
            return ir.status(200).json(result)
        }).catch(error => {
            return ir.status(401).json(error)
        })
    }
    catch(aldaa) {
        ir.json(aldaa)
    }
}

exports.removeStaff = async (yw, ir) => {

    const { companyID, staffID } = yw.params

    const exist = await StaffModel.findOne({ company: companyID })

    if(exist.length == 0) return ir.status(404).json('Staff not exists')

    try {
        await StaffModel.findByIdAndDelete(staffID).then(result => {
            return ir.status(200).json(result)
        }).catch(error => {
            return ir.status(401).json(error)
        })
    }
    catch(aldaa) {
        ir.json(aldaa)
    }
}

exports.removeAllStaff = async (yw, ir) => {

    const { companyID } = yw.params

    const exist = await StaffModel.find({ company: companyID })

    if(exist.length == 0) return ir.status(404).json('Staff not exists')

    try {
        await StaffModel.deleteMany({ company: companyID }).then(result => {
            return ir.status(200).json(result.deletedCount + ' item deleted')
        }).catch(error => {
            return ir.status(401).json(error)
        })
    }
    catch(aldaa) {
        ir.json(aldaa)
    }
}

// Service routes
exports.createService = async (yw, ir) => {

    const { companyID, staffID } = yw.params

    const staffs = await StaffModel.find({ company: companyID })

    ir.body = staffs

    const obj = {
        _id: new mongoose.Types.ObjectId(),
        company: companyID,
        staff: staffID,
        title: yw.body.title,
        startdate: yw.body.startdate,
        enddate: yw.body.enddate
    }

    const newservice = new ServiceModel(obj).save()
    const staff = await StaffModel.findByIdAndUpdate(staffID, {
        $push: newservice
    })
    const result = await ServiceModel.findOne({ staff: staff })

    try {
        ir.status(200).json(result)
    }
    catch(aldaa) {
        ir.json(aldaa)
    }
}

exports.getServices = async (yw, ir) => {

    const { companyID, staffID } = yw.params

    const services = await ServiceModel.find({ company: companyID, staff: staffID })

    try {
        ir.status(200).json(services)
    }
    catch(aldaa) {
        ir.json(aldaa)
    }
}

exports.getSingleService = async (yw, ir) => {

    const { companyID, staffID, serviceID } = yw.params

    const company = await ServiceModel.findOne({ _id: serviceID, company: companyID, staff: staffID })

    try {
        ir.status(200).json(company)
    }
    catch(aldaa) {
        ir.json(aldaa)
    }
}

exports.updateService = async (yw, ir) => {

    const { companyID, staffID, serviceID } = yw.params

    const obj = {
        title: yw.body.title,
        startdate: yw.body.startdate,
        enddate: yw.body.enddate
    }

    const update = await ServiceModel.findOneAndUpdate({ _id: serviceID, staff: staffID, company: companyID }, obj)

    const updated = await ServiceModel.findById({ _id: update.id })

    if(!updated) return ir.status(401).json('Cannot update')

    try {
        ir.status(200).json(updated)
    }
    catch(aldaa) {
        ir.json(aldaa)
    }
}

exports.removeService = async (yw, ir) => {

    const { companyID, serviceID } = yw.params

    const exist = await ServiceModel.findOne({ _id: serviceID, company: companyID })

    if(exist.length == 0) return ir.status(404).json('The service not found')

    const removed = await ServiceModel.findOneAndDelete({ _id: serviceID, company: companyID })

    try {
        ir.json(removed)
    }
    catch(aldaa) {
        ir.json(aldaa)
    }
}

exports.removeAllService = async (yw, ir) => {

    const { companyID } = yw.params

    const removed = await ServiceModel.deleteMany({})

    const exist = await ServiceModel.find({ company: companyID })

    if(exist.length == 0) return ir.status(404).json('You don t have any services yet')

    try {
        ir.status(200).json(removed)
    }
    catch(aldaa) {
        ir.json(aldaa)
    }
}