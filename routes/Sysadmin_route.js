const rtr = require('express').Router()
const SysadminControl = require('../controllers/Sysadmin_controller')

// Systems admin Authentication
rtr.post('/login', SysadminControl.login)
rtr.post('/register', SysadminControl.createOne)

// Systems admin manipulate itself
rtr.get('/:sysadminID/profile', SysadminControl.getSingle)
rtr.patch('/:sysadminID/update', SysadminControl.updateOne)
rtr.delete('/:sysadminID/remove', SysadminControl.removeOne)

// Systems admin manipulates company routes
rtr.post('/:sysadminID/create-company', SysadminControl.createCompany)
rtr.get('/:sysadminID/companies', SysadminControl.getAllCompany)
rtr.get('/:sysadminID/:companyID/profile', SysadminControl.getSingleCompany)
rtr.patch('/:sysadminID/:companyID/update', SysadminControl.updateCompany)
rtr.delete('/:sysadminID/:companyID/remove', SysadminControl.removeCompany)
rtr.delete('/:sysadminID/remove-all', SysadminControl.removeAllCompany)

const SysadminRoute = rtr

module.exports = { SysadminRoute }