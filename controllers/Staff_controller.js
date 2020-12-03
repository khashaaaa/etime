const { StaffModel } = require('../models/Staff_model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.profile = async (yw, ir) => {

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

exports.staffLogin = async (yw, ir) => {

    const { email, password } = yw.body
    const staff = await StaffModel.findOne({ email: email }).populate({
        path: 'company',
        model: 'CorpAdmin'
    })

    const isMatch = await bcrypt.compare(password, staff.password)

    if(staff.length == 0) return ir.status(404).json(`There is no staff with the email ${email}`)
    if(!isMatch) return ir.status(405).json('Invalid password. Check again')

    try {
        const token = jwt.sign(staff, process.env.JWT_SECRET)
        ir.status(200).json({ token, staff })
    }
    catch(aldaa) {
        ir.status(500).json(aldaa.message)
    }
}