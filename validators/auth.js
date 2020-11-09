const jwt = require('jsonwebtoken')

const sysadminAuth = async (yw, ir, next) => {

    const header = yw.headers['authorization']
    const bearertoken = header && header.split(' ')[1]
    if(bearertoken == null) return ir.status(401).json('Access denied')

    try {
        jwt.verify(bearertoken, process.env.JWT_SECRET, (error, sysadmin) => {
            if(error) return ir.status(403).json('Invalid token')

            ir.sysadmin = sysadmin
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
        jwt.verify(bearertoken, process.env.JWT_SECRET, (error, company) => {
            if(error) return ir.status(403).json('Invalid token')

            ir.company = company
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
        jwt.verify(bearertoken, process.env.JWT_SECRET, (error, staffadmin) => {
            if(error) return ir.status(403).json('Invalid token')

            ir.staffadmin = staffadmin
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
        jwt.verify(bearertoken, process.env.JWT_SECRET, (error, staff) => {
            if(error) return ir.status(403).json('Invalid token')

            ir.staff = staff
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
        jwt.verify(bearertoken, process.env.JWT_SECRET, (error, user) => {
            if(error) return ir.status(401).json('Invalid token')

            ir.user = user
            console.log(ir)
            next()
        })
    }
    catch(aldaa) {
        ir.status(500).json(aldaa.message)
    }
}

module.exports = { sysadminAuth, userAuth, companyAuth, staffAuth, staffAdminAuth }