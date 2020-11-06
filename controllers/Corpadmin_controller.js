const mongoose = require('mongoose')
const { CorpAdminModel } = require('../models/Corpadmin_model')
const { StaffModel } = require('../models/Staff_model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.getAll = async (yw, ir) => {

    const admins = await CorpAdminModel.find().populate({
        path: 'staffs',
        model: 'Staff'
    })

    try {
        if(admins.lenght == 0) return ir.status(200).json('There is no admin')
        if(!admins) return ir.json('Error occured to fetch admins')
        ir.status(200).json(admins)
    }
    catch(aldaa) {
        ir.status(500).json(aldaa.message)
    }
}

exports.getSingle = async (yw, ir) => {

    const id = yw.params.id
    const admin = await CorpAdminModel.findById(id).populate({
        path: 'staffs',
        model: 'Staff'
    })

    try {
        if(admin.length == 0) return ir.status(404).json('There is no admin')
        if(!admin) return ir.status(404).json('This admin has been removed or not created yet')
        ir.status(200).json(admin)
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
        password
    } = yw.body

    const salt = await bcrypt.genSalt()
    const hashed = await bcrypt.hash(password, salt)

    const newAdmin = new CorpAdminModel({
        _id: new mongoose.Types.ObjectId(),
        fathername: fathername,
        givenname: givenname,
        email: email,
        phone: phone,
        password: hashed
    })

    const id = yw.params.id
    const exist = await CorpAdminModel.findById(id)
    const create = await newAdmin.save()

    try {
        if(exist) return ir.status(405).json('Admin is already exist')
        if(create) return ir.status(201).json(create)
        if(!create) return ir.status(400).json('Cannot create admin')
    }
    catch(aldaa) {
        ir.status(500).json(aldaa.message)
    }
}

exports.updateOne = async (yw, ir) => {

    const {
        fathername,
        givenname,
        email,
        phone,
        password
    } = yw.body

    const update = await CorpAdminModel.findOneAndUpdate({ _id: yw.params.id }, {
        fathername: fathername,
        givenname: givenname,
        email: email,
        phone: phone,
        password: password
    })

    const id = yw.params.id
    const exist = await CorpAdminModel.findById(id)

    try {
        if(!exist) return ir.status(404).json('This id does not exist')

        CorpAdminModel.findOne({ _id: update.id }, (aldaa, updatedAdmin) => {
            if(aldaa) return ir.status(404).json(aldaa.message)
            else return ir.status(200).json(updatedAdmin)
        })
    }
    catch(aldaa) {
        ir.status(500).json(aldaa.message)
    }
}

exports.removeOne = async (yw, ir) => {

    const id = yw.params.id
    const exist = await CorpAdminModel.findById(id)

    try {
        if(!exist) return ir.status(404).json('This admin has been removed or not in the list')
        CorpAdminModel.findByIdAndRemove(id, (aldaa, removedAdmin) => {
            if(aldaa) return ir.status(404).json(aldaa.message)
            else return ir.status(200).json(removedAdmin)
        })
    }
    catch(aldaa) {
        ir.status(500).json(aldaa.message)
    }
}

// Remove all Admin
exports.removeAll = async (yw, ir) => {

    const admins = await CorpAdminModel.find({})
    const remove = await CorpAdminModel.deleteMany({})

    try {
        if(admins.length == 0) return ir.status(404).json('There are already no admins in the list')
        if(!remove) return ir.status(400).json('Error occured to delete admin list')
        else return ir.status(200).json(remove)
    }
    catch(aldaa) {
        ir.status(500).json(aldaa.message)
    }
}

exports.adminLogin = async (yw, ir) => {

    const { email, password } = yw.body
    const admin = await CorpAdminModel.findOne({ email: email })
    const isMatch = await bcrypt.compare(password, admin.password)

    try {
        if(!admin) return ir.json(`There is no user with the email ${email}`)
        if(!isMatch) return ir.json('Invalid password. Check again')

        const token = jwt.sign({ _id: admin.id }, process.env.JWT_SECRET)

        if(isMatch) return ir.status(200).json(
            {
                token,
                admin
            }
        )
    }
    catch(aldaa) {
        ir.json(aldaa.message)
    }
}