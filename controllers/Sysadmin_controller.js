const mongoose = require('mongoose')
const { SysadminModel } = require('../models/Sysadmin_model')
const { CompanyModel } = require('../models/Company_model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.createOne = async (yw, ir) => {

    const existed = await SysadminModel.find({})
    if(existed.length > 0) return ir.status(405).json('The system admin already exists')

    const { name, email, phone, password } = yw.body
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const newSysadmin = new SysadminModel({
        _id: new mongoose.Types.ObjectId(),
        name: name,
        email: email,
        phone: phone,
        password: hash
    })

    try {
        await newSysadmin.save().then(created => {
            return ir.status(201).json(created)
        }).catch(error => {
            return ir.status(401).json(error.message)
        })
    }
    catch(aldaa) {
        ir.json(aldaa.message)
    }
}

exports.getSingle = async (yw, ir) => {

    const { sysadminID } = yw.params

    try {
        await SysadminModel.findById(sysadminID).then(result => {
            return ir.status(200).json(result)
        }).catch(error => {
            return ir.status(400).json(error)
        })
    }
    catch(aldaa) {
        ir.json(aldaa.message)
    }
}

exports.updateOne = async (yw, ir) => {

    const { sysadminID } = yw.params

    const found = await SysadminModel.findById(sysadminID).populate({
        path: 'companies',
        model: 'Company'
    })

    if(found.length == 0) return ir.status(404).json('This user is not found or has been removed')

    const salt = await bcrypt.genSalt()
    const hashed = await bcrypt.hash(yw.body.password, salt)

    const update = await SysadminModel.findByIdAndUpdate(sysadminID, {
        name: yw.body.name,
        email: yw.body.email,
        phone: yw.body.phone,
        password: hashed
    })

    try {
        await SysadminModel.findOne({ _id: update.id }, (error, result) => {
            if(error) return ir.status(401).json(error)
            ir.status(200).json(result)
        })
    }
    catch(aldaa) {
        return ir.json(aldaa.message)
    }
}

exports.removeOne = async (yw, ir) => {

    const { sysadminID } = yw.params

    const found = await SysadminModel.findById(sysadminID).populate({
        path: 'companies',
        model: 'Company'
    })

    if(found.companies.length > 0) return ir.status(403).json('Cannot remove this account')

    if(found.length == 0) return ir.status(404).json('This user is not found or has been removed')

    const deleted = await SysadminModel.findByIdAndDelete(sysadminID)

    try {
        if(!deleted) return ir.status(401).json('Error occured to delete user')
        ir.status(200).json(deleted)
    }
    catch(aldaa) {
        return ir.json(aldaa.message)
    }
}

exports.login = async (yw, ir, next) => {

    const { phone, password } = yw.body
    const sysadmin = await SysadminModel.findOne({ phone: phone })

    const isMatch = await bcrypt.compare(password, sysadmin.password)

    if(!isMatch) return ir.status(405).json('Invalid password. Check again')

    const token = jwt.sign({ _id: sysadmin.id }, process.env.JWT_SECRET, { expiresIn: '1h' })

    try {
        ir.status(200).json({ token, sysadmin })
        next()
    }
    catch(aldaa) {
        ir.json(aldaa.message)
    }
}

// Company controllers
exports.createCompany = async (yw, ir) => {

    const { sysadminID } = yw.params

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(yw.body.password, salt)

    var ognoo = new Date()

    const companyobj = {
        _id: new mongoose.Types.ObjectId(),
        sysadmin: sysadminID,
        reg: yw.body.reg,
        name: yw.body.name,
        email: yw.body.email,
        address: yw.body.address,
        phone: yw.body.phone,
        password: hash,
        created: {
            year: ognoo.getFullYear(),
            month: ognoo.getMonth() + 1,
            weekday: ognoo.getDay(),
            day: ognoo.getDate(),
            hour: ognoo.getHours(),
            minute: ognoo.getMinutes()
        }
    }

    const exist = await CompanyModel.findOne({ email: companyobj.email })
    if(exist) return ir.status(401).json('It seems the email has been registered before')

    try {
        await new CompanyModel(companyobj, {
            $push: {
                sysadmin: sysadminID
            }
        }).save()
        .then(urdun => {
            return ir.status(201).json(urdun)
        })
        .catch(aldaa => {
            return ir.json(aldaa)
        })
    }
    catch(aldaa) {
        ir.json(aldaa.message)
    }
}

exports.getAllCompany = async (yw, ir) => {

    const { sysadminID } = yw.params

    const companies = await CompanyModel.find({ sysadmin: sysadminID })

    try {
        ir.status(200).json(companies)
    }
    catch(aldaa) {
        ir.json(aldaa.message)
    }
}

exports.getSingleCompany = async (yw, ir) => {

    const { sysadminID, companyID } = yw.params

    const company = await CompanyModel.findOne({ _id: companyID, sysadmin: sysadminID })

    if(company.length == 0) return ir.status(404).json('This company not found')

    const result = company.populate({
        path: 'sysadmin',
        model: 'Sysadmin'
    })

    try {
        ir.status(200).json(result)
    }
    catch(aldaa) {
        ir.json(aldaa)
    }
}

exports.updateCompany = async (yw, ir) => {

    const { sysadminID, companyID } = yw.params
    const company = await CompanyModel.findOne({ _id: companyID, sysadmin: sysadminID })

    if(company.length == 0) return ir.status(404).json('Company does not exist')

    const {
        reg,
        name,
        email,
        type,
        address,
        phone,
        password
    } = yw.body

    const salt = await bcrypt.genSalt()
    const hashed = await bcrypt.hash(password, salt)

    var ognoo = new Date()

    const update = await CompanyModel.findOneAndUpdate({ _id: companyID, sysadmin: sysadminID }, {
        reg: reg,
        name: name,
        email: email,
        type: type,
        address: address,
        phone: phone,
        password: hashed,
        updated: {
            year: ognoo.getFullYear(),
            month: ognoo.getMonth() + 1,
            weekday: ognoo.getDay(),
            day: ognoo.getDate(),
            hour: ognoo.getHours(),
            minute: ognoo.getMinutes()
        },
    })

    try {
        await CompanyModel.findOne({ _id: update.id }).populate({
            path: 'sysadmin',
            model: 'Sysadmin'
        }).populate({
            path: 'staffs',
            model: 'Staff'
        }).then(result => {
            return ir.status(200).json(result)
        }).catch(error => {
            return ir.status(400).json(error)
        })
    }
    catch(aldaa) {
        ir.json(aldaa.message)
    }
}

exports.removeCompany = async (yw, ir) => {

    const { sysadminID, companyID } = yw.params
    const exist = await CompanyModel.findOne({ _id: companyID, sysadmin: sysadminID })

    if(exist.length == 0) return ir.status(404).json('This company has been removed or not in the list')

    try {
        await CompanyModel.findOneAndDelete({ _id: companyID, sysadmin: sysadminID }).then(result => {
            return ir.status(200).json(result)
        }).catch(error => {
            return ir.status(400).json(error)
        })
    }
    catch(aldaa) {
        ir.json(aldaa.message)
    }
}

exports.removeAllCompany = async (yw, ir) => {

    const { sysadminID } = yw.params
    const exist = await CompanyModel.find({ sysadmin: sysadminID })

    if(exist.length == 0) return ir.status(404).json('No companies in your list')

    try {
        await CompanyModel.deleteMany({ sysadmin: sysadminID }).then(deleted => {
            return ir.status(200).json(deleted)
        }).catch(error => {
            return ir.status(401).json(error)
        })
    }
    catch(aldaa) {
        ir.json(aldaa)
    }
}