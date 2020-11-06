const { UserModel } = require('../models/User_model')

exports.createValidate = async (yw, ir, next) => {

    const {
        fathername,
        name,
        email,
        phone,
        password
    } = yw.body

    const emailregex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    const pass = emailregex.test(email)

    const existed = await UserModel.findOne({ email: email })

    try {
        // Checking empty inputs
        if(!fathername) return ir.json('Fathername field must be filled')
        if(fathername.length < 2) return ir.json('Enter your father name in full length')
        if(!name) return ir.json('Name field must be filled')
        if(!email) return ir.json('Email field must be filled')
        if(!phone) return ir.json('Phone field must be filled')
        if(!password) return ir.json('Password field must be filled')

        if(password.length < 8) return ir.json('Password must have at least 8 characters')

        // Email regex
        if(!pass) return ir.json('You must use correct email')

        // Check user existed or not
        if(existed) return ir.json(`User with the email ${email} has already registered`)

        // When successfully passes validators
        else return next()
    }
    catch(aldaa) {
        ir.json(aldaa.message)
    }
}

exports.updateValidate = async (yw, ir, next) => {

    const {
        fathername,
        name,
        email,
        phone,
        password
    } = yw.body

    // Checking empty inputs
    if(!fathername) return ir.json('Fathername field must be filled')
    if(fathername.length < 2) return ir.json('Enter your father name in full length')
    if(!name) return ir.json('Name field must be filled')
    if(!email) return ir.json('Email field must be filled')
    if(!phone) return ir.json('Phone field must be filled')
    if(!password) return ir.json('Password field must be filled')

    if(password.length < 8) return ir.json('Password must have at least 8 characters')

    const existed = await UserModel.findOne({ email: email })

    try {
        if(!existed) return ir.json(`There is no user with the email ${email} now. It seems you should create new account`)
        else return next()
    }
    catch(aldaa) {
        ir.json(aldaa.message)
    }
}

exports.removeValidate = async (yw, ir, next) => {

    const email = yw.body.email
    const exist = await UserModel.findOne({ email: email })

    try {
        if(!exist) return ir.json(`There is already no user with the email ${email}`)
        else return next()
    }
    catch(aldaa) {
        ir.json(aldaa.message)
    }
}