const mongoose = require('mongoose')
const { SysadminModel } = require('../models/Sysadmin_model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.createOne = async (yw, ir) => {

    const {
        name,
        email,
        phone,
        password
    } = yw.body

    const salt = await bcrypt.genSalt()
    const hashed = await bcrypt.hash(password, salt)

    const newSysadmin = new SysadminModel({
        _id: new mongoose.Types.ObjectId(),
        name: name,
        email: email,
        phone: phone,
        password: hashed
    })

    const existed = await SysadminModel.find({})
    if(existed.length > 0) return ir.status(405).json('The system admin already exists')

    try {
        await newSysadmin.save().then(created => {
            return ir.status(201).json(created)
        }).catch(error => {
            return ir.status(401).json(error.message)
        })
    }
    catch(aldaa) {
        ir.status(500).json(aldaa.message)
    }
}

exports.getAll = async (yw, ir) => {

    const sysadmins = await SysadminModel.find().populate({
        path: 'companies',
        model: 'Company'
    })

    try {
        if(sysadmins.length == 0) return ir.status(400).json('No system admin found. Create new one')
        ir.status(200).json(sysadmins)
    }
    catch(aldaa) {
        ir.status(500).json(aldaa.message)
    }
}

exports.getSingle = async (yw, ir) => {

    const id = yw.params.id
    const found = await SysadminModel.findById(id).populate({
        path: 'companies',
        model: 'Company'
    })

    if(!found) return ir.status(404).json('There seems no system admin in the database. Create new one')

    try {
        await SysadminModel.findById(id).populate({
            path: 'companies',
            model: 'Company'
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

exports.updateOne = async (yw, ir) => {

    const found = await SysadminModel.findById(yw.params.id).populate({
        path: 'companies',
        model: 'Company'
    })

    const salt = await bcrypt.genSalt()
    const hashed = await bcrypt.hash(yw.body.password, salt)

    const update = await SysadminModel.findByIdAndUpdate(yw.params.id, {
        name: yw.body.name,
        email: yw.body.email,
        phone: yw.body.phone,
        password: hashed
    })

    if(found.length == 0) return ir.status(404).json('This user is not found or has been removed')

    try {
        await SysadminModel.findOne({ _id: update.id }, (error, result) => {
            if(error) return ir.status(401).json(error)
            ir.status(200).json(result)
        })
    }
    catch(aldaa) {
        return ir.status(500).json(aldaa.message)
    }
}

exports.removeOne = async (yw, ir) => {

    const found = await SysadminModel.findById(yw.params.id).populate({
        path: 'companies',
        model: 'Company'
    })

    if(found.length == 0) return ir.status(404).json('This user is not found or has been removed')

    const deleted = await SysadminModel.findByIdAndDelete(yw.params.id)

    try {
        if(!deleted) return ir.status(405).json('Error occured to delete user')
        ir.status(200).json(deleted)
    }
    catch(aldaa) {
        return ir.status(500).json(aldaa.message)
    }
}

exports.sysadminLogin = async (yw, ir) => {

    const { phone, password } = yw.body
    const sysadmin = await SysadminModel.findOne({ phone: phone }).populate({
        path: 'companies',
        model: 'Company'
    })
    const isMatch = await bcrypt.compare(password, sysadmin.password)

    if(!sysadmin) return ir.status(404).json('Account not found')
    if(!isMatch) return ir.status(405).json('Invalid password. Check again')

    try {
        const token = jwt.sign({ _id: sysadmin.id }, process.env.JWT_SECRET, { expiresIn: '1h' })
        ir.status(200).json({ token, sysadmin })
    }
    catch(aldaa) {
        ir.status(500).json(aldaa.message)
    }
}