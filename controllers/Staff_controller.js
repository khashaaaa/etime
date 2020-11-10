const mongoose = require('mongoose')
const { CompanyModel } = require('../models/Company_model')
const { StaffModel } = require('../models/Staff_model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.staffProfile = async (yw, ir) => {

    const id = yw.params.id
    const staff = await StaffModel.findById(id)

    if(!staff) return ir.status(404).json('Staff not found')

    try {
        await StaffModel.findById(id).populate({
            path: 'company',
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

exports.getAll = async (yw ,ir) => {

    const exist = await StaffModel.find({})
    if(!exist) return ir.status(404).json('No staffs in the database')

    try {
        StaffModel.find({}).populate({
            path: 'company',
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
    const exist = await StaffModel.findById(id)
    if(!exist) return ir.status(404).json('Staff not found')

    try {
        await StaffModel.findById(id).populate({
            path: 'company',
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
    const adminId = await CompanyModel.find({})

    if(!adminId) return ir.status(404).json('Admin not exists. You should create admin first')

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

    if(!staffs) return ir.status(404).json('There are no staffs in the database')

    try {
        await StaffModel.deleteMany({}).then(deleted => {
            return ir.status(200).json(deleted)
        }).catch(error => {
            return ir.status(400).json(error.message)
        })
    }
    catch(aldaa) {
        ir.status(500).json(aldaa.message)
    }
}

exports.staffLogin = async (yw, ir) => {

    const { email, password } = yw.body
    const staff = await StaffModel.findOne({ email: email }).populate({
        path: 'company',
        model: 'CorpAdmin'
    })

    const isMatch = await bcrypt.compare(password, staff.password)

    if(!staff) return ir.status(404).json(`There is no staff with the email ${email}`)
    if(!isMatch) return ir.status(405).json('Invalid password. Check again')

    try {
        const token = jwt.sign(staff, process.env.JWT_SECRET)
        ir.status(200).json({ token, staff })
    }
    catch(aldaa) {
        ir.status(500).json(aldaa.message)
    }
}