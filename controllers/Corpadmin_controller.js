const mongoose = require('mongoose')
const { SysadminModel } = require('../models/Sysadmin_model')
const { CompanyModel } = require('../models/Corpadmin_model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.getAll = async (yw, ir) => {

    const companies = await CompanyModel.find().populate({
        path: 'sysadmin',
        model: 'Sysadmin'
    }).populate({
        path: 'staffs',
        model: 'Staff'
    })

    if(!companies) return ir.json('Error occured to fetch companies')

    try {
        ir.status(200).json(companies)
    }
    catch(aldaa) {
        ir.status(500).json(aldaa.message)
    }
}

exports.getSingle = async (yw, ir) => {

    const id = yw.params.id
    const company = await CompanyModel.findById(id).populate({
        path: 'sysadmin',
        model: 'Sysadmin'
    }).populate({
        path: 'staffs',
        model: 'Staff'
    })

    if(!company) return ir.status(404).json('This company has been removed or not created yet')

    try {
        ir.status(200).json(company)
    }
    catch(aldaa) {
        ir.status(500).json(aldaa.message)
    }
}

exports.createOne = async (yw, ir) => {

    const sysadmin = await SysadminModel.find({})
    if(!sysadmin) return ir.status(405).json('Systems admin does not exists')

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

    const newCompany = new CompanyModel({
        _id: new mongoose.Types.ObjectId(),
        reg: reg,
        name: name,
        email: email,
        type: type,
        address: address,
        phone: phone,
        password: hashed,
        sysadmin: sysadmin[0]
    })

    const id = yw.params.id
    const exist = await CompanyModel.findById(id)

    if(exist) return ir.status(405).json('Admin is already exist')

    try {
        await newCompany.save().then(company => {
            return ir.status(201).json(company)
        }).catch(error => {
            return ir.status(400).json(error)
        })
    }
    catch(aldaa) {
        ir.status(500).json(aldaa.message)
    }
}

exports.updateOne = async (yw, ir) => {

    const sysadmin = await SysadminModel.find({})
    if(!sysadmin) return ir.status(405).json('The systems admin not found')

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

    const update = await CompanyModel.findOneAndUpdate({ _id: yw.params.id }, {
        reg: reg,
        name: name,
        email: email,
        type: type,
        address: address,
        phone: phone,
        password: hashed
    })

    const id = yw.params.id
    const exist = await CompanyModel.findById(id)

    if(!exist) return ir.status(404).json('This company does not exist')

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
        ir.status(500).json(aldaa.message)
    }
}

exports.removeOne = async (yw, ir) => {

    const id = yw.params.id
    const exist = await CompanyModel.findById(id).populate({
        path: 'staffs',
        model: 'Staff'
    })

    if(!exist) return ir.status(404).json('This company has been removed or not in the list')

    try {
        await CompanyModel.findByIdAndRemove(id).populate({
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
        ir.status(500).json(aldaa.message)
    }
}

// Remove all Admin
exports.removeAll = async (yw, ir) => {

    const companies = await CompanyModel.find({})
    const remove = await CompanyModel.deleteMany({})

    if(!companies) return ir.status(404).json('There are already no company in the list')
    if(!remove) return ir.status(400).json('Error occured to delete companies')

    try {
        ir.status(200).json(remove)
    }
    catch(aldaa) {
        ir.status(500).json(aldaa.message)
    }
}

exports.companyLogin = async (yw, ir) => {

    const { email, password } = yw.body
    const company = await CompanyModel.findOne({ email: email })
    const isMatch = await bcrypt.compare(password, company.password)

    if(!company) return ir.json(`There is no user with the email ${email}`)
    if(!isMatch) return ir.json('Invalid password. Check again')

    try {

        const token = jwt.sign(company, process.env.JWT_SECRET)

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