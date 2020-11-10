const jwt = require('jsonwebtoken')

const sysadminAuth = async (yw, ir, next) => {

    const header = yw.headers['authorization']
    const bearertoken = header && header.split(' ')[1]
    if(bearertoken == null) return ir.status(401).json('Access denied')

    try {
        jwt.verify(bearertoken, process.env.JWT_SECRET, (error, decode) => {
            if(error) return ir.status(403).json(error.message)

            ir.sysadmin = decode.sysadmin
            next()
        })
    }
    catch(aldaa) {
        ir.status(500).json(aldaa.message)
    }
}

const companyAuth = async (yw, ir, next) => {

    const header = yw.headers['authorization']
    const bearertoken = header && header.split(' ')[1]
    if(bearertoken == null) return ir.status(401).json('Access denied')
    
    try {        
        jwt.verify(bearertoken, process.env.JWT_SECRET, (error, decode) => {
            if(error) return ir.status(403).json(error.message)

            ir.company = decode.company
            next()
        })
    }
    catch(aldaa) {
        ir.status(500).json(aldaa.message)
    }
}

const staffAdminAuth = async (yw, ir, next) => {

    const header = yw.headers['authorization']
    const bearertoken = header && header.split(' ')[1]
    if(bearertoken == null) return ir.status(401).json('Access denied')

    try {
        jwt.verify(bearertoken, process.env.JWT_SECRET, (error, decode) => {
            if(error) return ir.status(403).json(error.message)

            ir.staffadmin = decode.staffadmin
            next()
        })
    }
    catch(aldaa) {
        ir.status(500).json(aldaa.message)
    }
}

const staffAuth = async (yw, ir, next) => {

    const header = yw.headers['authorization']
    const bearertoken = header && header.split(' ')[1]
    if(bearertoken == null) return ir.status(401).json('Access denied')

    try {
        jwt.verify(bearertoken, process.env.JWT_SECRET, (error, decode) => {
            if(error) return ir.status(403).json(error.message)

            ir.staff = decode.staff
            next()
        })
    }
    catch(aldaa) {
        ir.status(500).json(aldaa.message)
    }
}

const userAuth = async (yw, ir, next) => {

    const header = yw.headers['authorization']
    const bearertoken = header && header.split(' ')[1]
    if(!bearertoken) return ir.status(405).json('Auth denied')
    
    try {        
        jwt.verify(bearertoken, process.env.JWT_SECRET, (error, decode) => {
            if(error) return ir.status(401).json(error.message)

            ir.user = decode.user
            next()
        })
    }
    catch(aldaa) {
        ir.status(500).json(aldaa.message)
    }
}

module.exports = { sysadminAuth, userAuth, companyAuth, staffAuth, staffAdminAuth }