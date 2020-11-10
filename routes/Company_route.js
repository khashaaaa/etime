const rtr = require('express').Router()

const CompanyControl = require('../controllers/Company_controller')

const { sysadminAuth } = require('../validators/auth')

// Company admin login route
rtr.post('/login', CompanyControl.companyLogin)

// System admin use these routes
rtr.get('/list', sysadminAuth, CompanyControl.getAll)
rtr.get('/:id', sysadminAuth, CompanyControl.getSingle)
rtr.post('/create-company', sysadminAuth, CompanyControl.createOne)
rtr.patch('/:id/update-company', sysadminAuth, CompanyControl.updateOne)
rtr.delete('/:id/remove-company', sysadminAuth, CompanyControl.removeOne)
rtr.delete('/remove-all', sysadminAuth, CompanyControl.removeAll)

const CompanyRoute = rtr

module.exports = { CompanyRoute }