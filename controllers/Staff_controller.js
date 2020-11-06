const mongoose = require('mongoose')
const { StaffModel } = require('../models/Staff_model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { CorpAdminModel } = require('../models/Corpadmin_model')

exports.staffProfile = async (yw, ir) => {

    const id = yw.params.id
    const profile = await StaffModel.findById(id)

    try {
        if(profile.length == 0) return ir.status(404).json('Staff not exist')
        ir.status(200).json(profile)
    }
    catch(aldaa) {
        ir.status(500).json(aldaa.message)
    }
}

exports.getAll = async (yw ,ir) => {

    const exist = await StaffModel.find({})

    try {
        if(!exist) return ir.status(404).json('No staffs in the database')

        StaffModel.find({}).populate({
            path: 'admin',
            model: 'CorpAdmin'
        }).exec((error, staffs) => {
            if(error) return ir.status(400).json(error)
            if(staffs) return ir.status(200).json(staffs)
        })
    }
    catch(aldaa) {
        ir.status(500).json(aldaa.message)
    }
}

exports.getSingle = async (yw, ir) => {

    const id = yw.params.id

    try {
        if(staff.length == 0) return ir.status(200).json('No staffs in the database')
        
        StaffModel.findById(id).populate({
            path: 'admin',
            model: 'CorpAdmin'
        }).exec((error, staff) => {
            if(error) return ir.status(400).json(error)
            if(staff) return ir.status(200).json(staff)
        })
    }
    catch(aldaa) {
        ir.status(500).json(aldaa.message)
    }
}

exports.createOne = async (yw, ir) => {

    const {
        fathername,
        givenname,
        email,
        phone,
        address,
        displayname,
        description,
        calendar,
        password
    } = yw.body

    const salt = await bcrypt.genSalt()
    const hashed = await bcrypt.hash(password, salt)
    const adminId = await CorpAdminModel.find({})

    const newStaff = new StaffModel({
        _id: new mongoose.Types.ObjectId(),
        fathername: fathername,
        givenname: givenname,
        email: email,
        phone: phone,
        address: address,
        displayName: displayname,
        description: description,
        calendar: calendar,
        password: hashed,
        admin: adminId[0]
    })

    const id = yw.params.id
    const exist = await StaffModel.findById(id)
    const create = await newStaff.save()

    try {
        if(exist) return ir.status(405).json('Staff is already exists')
        if(!create) return ir.status(400).json('Cannot create staff')
        ir.status(201).json(create)
    }
    catch(aldaa) {
        ir.status(500).json(aldaa.message)
    }
}

exports.updateOne = async (yw, ir) => {

    const staffobj = {
        fathername,
        givenname,
        email,
        phone,
        address,
        displayname,
        description,
        calendar,
        password
    } = yw.body

    const update = await StaffModel.findOneAndUpdate({ _id: yw.params.id }, staffobj)

    const exist = await StaffModel.findById(yw.params.id)

    try {
        if(!exist) return ir.status(404).json('Staff does not exist')

        StaffModel.findOne({ _id: update.id }, (aldaa, updatedStaff) => {
            if(aldaa) return ir.status(400).json(aldaa.message)
            else return ir.status(200).json(updatedStaff)
        })
    }
    catch(aldaa) {
        ir.status(500).json(aldaa.message)
    }
}

exports.removeOne = async (yw, ir) => {

    const id = yw.params.id
    const exist = await StaffModel.findById(id)

    try {
        if(!exist) return ir.status(404).json('Staff is not exist')
        StaffModel.findByIdAndRemove(id, (aldaa, removedStaff) => {
            if(aldaa) return ir.status(404).json(aldaa.message)
            else return ir.status(200).json(removedStaff)
        })
    }
    catch(aldaa) {
        ir.status(500).json(aldaa.message)
    }
}

exports.removeAll = async (yw, ir) => {

    const staffs = await StaffModel.find({})
    const remove = await StaffModel.deleteMany({})

    try {
        if(staffs.length == 0) return ir.status(404).json('There are no staffs in the database')

        if(!remove) return ir.status(400).json('Error occured to delete staffs')
        else return ir.status(200).json(remove)
    }
    catch(aldaa) {
        ir.status(500).json(aldaa.message)
    }
}

exports.staffLogin = async (yw, ir) => {

    const { email, password } = yw.body
    const staff = await StaffModel.findOne({ email: email })
    const isMatch = await bcrypt.compare(password, staff.password)

    try {
        if(!staff) return ir.status(404).json(`There is no staff with the email ${email}`)
        if(!isMatch) return ir.status(405).json('Invalid password. Check again')

        const token = jwt.sign({ _id: staff.id }, process.env.JWT_SECRET)

        ir.status(200).json({ token, staff })
    }
    catch(aldaa) {
        ir.status(500).json(aldaa.message)
    }
}