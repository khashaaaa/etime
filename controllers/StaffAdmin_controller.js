const mongoose = require('mongoose')
const { CompanyModel } = require('../models/Company_model')
const { StaffModel } = require('../models/Staff_model')
const bcrypt = require('bcrypt')

exports.createOne = async (yw, ir) => {

    const companyId = await CompanyModel.find({})
    if(!companyId) return ir.status(404).json('Corporate admin does not exists. You should company admin first')

    const {
        fathername,
        givenname,
        email,
        phone,
        address,
        description,
        calendar,
        password
    } = yw.body

    const salt = await bcrypt.genSalt()
    const hashed = await bcrypt.hash(password, salt)

    const newStaff = new StaffModel({
        _id: new mongoose.Types.ObjectId(),
        isAdmin: true,
        fathername: fathername,
        givenname: givenname,
        email: email,
        phone: phone,
        address: address,
        description: description,
        calendar: calendar,
        password: hashed,
        company: companyId[0]
    })

    const exist = await StaffModel.findOne({ phone: phone })
    if(exist) return ir.status(405).json('Admin staff is already exists')

    try {
        await newStaff.save().then(saved => {
            return ir.status(201).json(saved)
        }).catch(error => {
            return ir.status(400).json(error)
        })
    }
    catch(aldaa) {
        ir.status(500).json(aldaa.message)
    }
}

exports.staffAdminLogin = async (yw, ir) => {

    const { phone, password } = yw.body
    const staffadmin = await StaffModel.findOne({ isAdmin: true, phone: phone })
    const isMatch = await bcrypt.compare(password, staffadmin.password)

    if(!staffadmin) return ir.json(`There is no record with the phone ${phone}`)
    if(!isMatch) return ir.json('Invalid password. Check again')

    try {

        const token = jwt.sign(staffadmin, process.env.JWT_SECRET, { expiresIn: '1h' })

        if(isMatch) return ir.status(200).json(
            {
                token,
                staffadmin
            }
        )
    }
    catch(aldaa) {
        ir.json(aldaa.message)
    }
}