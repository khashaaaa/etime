const { StaffModel } = require('../models/Staff_model')
const bcrypt = require('bcrypt')

exports.createStaffAdmin = async (yw, ir) => {

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
    const companyId = await CorpAdminModel.find({})

    if(!companyId) return ir.status(404).json('Corporate admin does not exists. You should create admin first')

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

    const id = yw.params.id
    const exist = await StaffModel.findById(id)
    const create = await newStaff.save()

    try {
        if(exist) return ir.status(405).json('Admin staff is already exists')
        if(!create) return ir.status(400).json('Cannot create admin staff')
        ir.status(201).json(create)
    }
    catch(aldaa) {
        ir.status(500).json(aldaa.message)
    }
}