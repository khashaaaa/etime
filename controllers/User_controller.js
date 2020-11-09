const mongoose = require('mongoose')
const { UserModel } = require('../models/User_model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

// Fetch all user
exports.getAll = async (yw, ir) => {
    const query = await UserModel.find({})

    try {
        if(query) return ir.status(200).json(query)
        else return ir.status(400).json('Error occured while finding')
    }
    catch(aldaa) {
        ir.status(500).json(aldaa.message)
    }
}

// Fetch single user by id
exports.getSingle = async (yw, ir) => {
    let id = yw.params.id
    const query = await UserModel.findById(id)

    try {
        if(query) return ir.status(200).json(query)
        else return ir.status(400).json('Error occured while finding')
    }
    catch(aldaa) {
        ir.status(500).json(aldaa.message)
    }
}

// Create single user
exports.createOne = async (yw, ir) => {

    const {
        fathername,
        name,
        email,
        phone,
        address,
        profilepic,
        password
    } = yw.body

    const salt = await bcrypt.genSalt()
    const hashed = await bcrypt.hash(password, salt)

    const newUser = new UserModel({
        _id: new mongoose.Schema.Types.ObjectId(),
        fathername: fathername,
        name: name,
        email: email,
        phone: phone,
        address: address,
        profilepic: profilepic,
        password: hashed
    })

    const created = await newUser.save()

    try {

        if(created) {
            ir.status(201).json(created)
            newUser.password = undefined
        }
        else return ir.status(400).json('Error occured to create new user')
    }
    catch(aldaa) {
        ir.status(500).json(aldaa.message)
    }
}

// Update user by id
exports.updateOne = async (yw, ir) => {

    const password = yw.body.password
    const salt = await bcrypt.genSalt()
    const hashed = await bcrypt.hash(password, salt)

    const update = await UserModel.findOneAndUpdate({ _id: yw.params.id }, {
        fathername: yw.body.fathername,
        name: yw.body.name,
        email: yw.body.email,
        phone: yw.body.phone,
        address: address,
        profilepic: yw.body.profilepic,
        password: hashed
    })

    try {
        UserModel.findOne({ _id: update.id }, (aldaa, updatedUser) => {
            if(aldaa) return ir.status(404).json(aldaa.message)
            else return ir.status(200).json(updatedUser)
        })
    }
    catch(aldaa) {
        ir.status(500).json(aldaa.message)
    }
}

// Remove user by id
exports.removeOne = async (yw, ir) => {

    const id = yw.params.id

    try {
        UserModel.findByIdAndRemove(id, (aldaa, removedUser) => {
            if(aldaa) return ir.status(404).json(aldaa.message)
            else return ir.status(200).json(removedUser)
        })
    }
    catch(aldaa) {
        ir.status(500).json(aldaa.message)
    }
}

// Remove all user
exports.removeAll = async (yw, ir) => {

    try {
        UserModel.deleteMany({}, (aldaa, removed) => {
            if(aldaa) return ir.status(404).json(aldaa.message)
            else return ir.status(200).json(removed)
        })
    }
    catch(aldaa) {
        ir.status(500).json(aldaa.message)
    }
}

// Login
exports.userLogin = async (yw, ir) => {

    const { email, password } = yw.body
    const user = await UserModel.findOne({ email: email })
    const isMatch = await bcrypt.compare(password, user.password)

    try {
        if(!user) return ir.json(`There is no user with the email ${email}`)
        if(!isMatch) return ir.json('Invalid password. Check again')

        const token = jwt.sign(user, process.env.JWT_SECRET)

        if(isMatch) return ir.json(
            {
                token,
                user
            }
        )
    }
    catch(aldaa) {
        ir.json(aldaa.message)
    }
}